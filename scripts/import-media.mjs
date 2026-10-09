import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { marked } from 'marked';
import { parse } from 'node-html-parser';
const snapshot = JSON.parse(readFileSync('src/data/discussions.json'));
const manifestPath = 'src/data/discussion-media.json';
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath)) : {};
mkdirSync('public/media/discussions', { recursive: true });
const sources = new Set();
for (const item of snapshot.items) {
  const dom = parse(await marked.parse(item.body));
  for (const img of dom.querySelectorAll('img')) sources.add(img.getAttribute('src'));
  for (const match of item.body.matchAll(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/g)) sources.add(`https://img.youtube.com/vi/${match[1]}/0.jpg`);
  for (const match of item.body.matchAll(/https:\/\/github\.com\/[^\s<>"()]+\/assets\/\d+\/[a-f0-9-]+/g)) sources.add(match[0]);
}
const types = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' };
let failed = 0;
for (const source of sources) {
  if (!source) continue;
  const url = new URL(source);
  if (url.protocol !== 'https:' || !['github.com', 'user-images.githubusercontent.com', 'img.youtube.com', 'i.ytimg.com'].includes(url.hostname)) continue;
  if (manifest[source] && existsSync(`public${manifest[source].path}`)) continue;
  try {
    const response = await fetch(source, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    const mime = response.headers.get('content-type')?.split(';')[0];
    const ext = types[mime];
    if (!ext) throw Error(`Unsupported type ${mime}`);
    const size = Number(response.headers.get('content-length') || 0);
    if (size > 80 * 1024 * 1024) throw Error('Asset exceeds 80 MB');
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 80 * 1024 * 1024) throw Error('Asset exceeds 80 MB');
    let path = `/media/discussions/${createHash('sha256').update(source).digest('hex').slice(0, 20)}.${ext}`;
    writeFileSync(`public${path}`, buffer);
    let savedMime = mime;
    if (ext === 'mov') {
      const converted = path.replace(/\.mov$/, '.mp4');
      execFileSync('ffmpeg', ['-y', '-i', `public${path}`, '-c:v', 'libx264', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart', `public${converted}`], { stdio: 'ignore', timeout: 120000 });
      const { unlinkSync } = await import('node:fs');
      unlinkSync(`public${path}`); path = converted; savedMime = 'video/mp4';
    }
    manifest[source] = { path, mime: savedMime, bytes: statSync(`public${path}`).size };
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Imported ${ext} (${Math.round(buffer.length / 1024)} KB)`);
  } catch (error) { failed++; console.warn(`Could not import ${source}: ${error.message}`); }
}
console.log(`${Object.keys(manifest).length} cached media assets; ${failed} unavailable.`);
// Channel metadata is a curated snapshot; refresh its titles and thumbnails without downloading movies.
const videosPath = 'src/data/videos.json';
if (existsSync(videosPath)) {
  const videos = JSON.parse(readFileSync(videosPath));
  mkdirSync('public/media/videos', { recursive: true });
  for (const video of videos.items) {
    const path = `/media/videos/${video.id}.jpg`;
    if (!existsSync(`public${path}`)) {
      try {
        execFileSync('curl', ['-fLsS', '--max-time', '30', `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`, '-o', `public${path}`]);
      } catch { console.warn(`Thumbnail unavailable: ${video.id}`); continue; }
    }
    video.poster = path;
  }
  writeFileSync(videosPath, JSON.stringify(videos, null, 2) + '\n');
}
