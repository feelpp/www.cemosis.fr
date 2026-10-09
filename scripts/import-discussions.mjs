import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('src/data/discussion-topics.json', 'utf8'));
const [owner, name] = config.repository.split('/');
const query = `query($owner:String!, $name:String!, $cursor:String) {
  repository(owner:$owner, name:$name) {
    isPrivate
    discussions(first:100, after:$cursor, orderBy:{field:CREATED_AT,direction:DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes { number title url body createdAt updatedAt category { name }
        labels(first:100) { nodes { name } } author { login } comments { totalCount } }
    }
  }
}`;
const discussions = [];
let cursor = null;
try {
  do {
    const variables = { owner, name, cursor };
    let response;
    if (process.env.GITHUB_TOKEN) {
      const result = await fetch('https://api.github.com/graphql', {
        method: 'POST', signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'cemosis-site-import' },
        body: JSON.stringify({ query, variables }),
      });
      if (!result.ok) throw new Error(`GitHub returned HTTP ${result.status}`);
      response = await result.json();
    } else {
      // gh uses the existing local login. Never print or persist credentials.
      response = JSON.parse(execFileSync('gh', ['api', 'graphql', '--input', '-'], {
        input: JSON.stringify({ query, variables }), encoding: 'utf8', timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe'],
      }));
    }
    if (response.errors?.length) throw new Error('GitHub GraphQL query failed.');
    const repository = response.data?.repository;
    if (!repository || repository.isPrivate) throw new Error('Only the configured public repository may be imported.');
    discussions.push(...repository.discussions.nodes);
    cursor = repository.discussions.pageInfo.hasNextPage ? repository.discussions.pageInfo.endCursor : null;
  } while (cursor);

  const topicsFor = discussion => {
    const title = discussion.title.toLowerCase();
    const labels = discussion.labels.nodes.map(label => label.name.toLowerCase());
    return config.topics.filter(topic => topic.keywords.some(word => title.includes(word)) || topic.labels.some(word => labels.some(label => label.includes(word)))).map(topic => topic.id);
  };
  const items = discussions.flatMap(discussion => {
    const topics = topicsFor(discussion);
    if (config.excludeNumbers.includes(discussion.number) || (!topics.length && !config.includeNumbers.includes(discussion.number))) return [];
    const url = new URL(discussion.url);
    if (url.origin !== 'https://github.com' || ![`/${config.repository}/discussions/`, `/orgs/${owner}/discussions/`].some(prefix => url.pathname.startsWith(prefix))) throw new Error('Unexpected discussion URL.');
    return [{ number: discussion.number, title: discussion.title, url: discussion.url,
      body: discussion.body, createdAt: discussion.createdAt, updatedAt: discussion.updatedAt,
      category: discussion.category.name, labels: discussion.labels.nodes.map(label => label.name),
      author: discussion.author?.login || 'GitHub', commentCount: discussion.comments.totalCount, topics }];
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!items.length) throw new Error('No relevant discussions returned; preserving the existing snapshot.');
  mkdirSync('src/data', { recursive: true });
  const path = 'src/data/discussions.json';
  writeFileSync(`${path}.tmp`, JSON.stringify({ source: config.source, importedAt: new Date().toISOString(), items }, null, 2) + '\n');
  renameSync(`${path}.tmp`, path);
  console.log(`Imported ${items.length} relevant public discussions from ${discussions.length} total.`);
} catch {
  console.warn('Discussion refresh unavailable. The checked-in snapshot is retained. Run pnpm import:discussions with an authenticated gh login or GITHUB_TOKEN to refresh.');
  if (process.argv.includes('--strict')) process.exit(1);
}
