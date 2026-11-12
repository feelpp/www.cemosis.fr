import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { peopleSchema, contractSchema, contractYears, contractDuration } from '../src/lib/people-schema.ts';

const fixture = contracts => ({ updated: '2026-11-10', source: 'Test fixture', people: [{ id: 'test-person', name: 'Test Person', status: 'former', contractBased: true, contracts }] });
const data = peopleSchema.parse(fixture([
  { startYear: 2018, endYear: 2021 },
  { startYear: 2022, ongoing: true },
  { startYear: null, endYear: null, durationYears: 2 },
]));
assert.equal(data.people[0].contracts.length, 3);
assert.equal(data.people[0].status, 'former', 'Contracts must not silently reclassify membership status');
assert.equal(contractYears(data.people[0].contracts[0], 'en'), '2018–2021');
assert.equal(contractYears(data.people[0].contracts[1], 'en'), '2022–present');
assert.equal(contractYears(data.people[0].contracts[2], 'en'), '');
assert.equal(contractDuration(data.people[0].contracts[2], 'fr'), '2 ans');
assert.equal(contractDuration(data.people[0].contracts[2], 'en'), '2 years');
assert.equal(contractYears(contractSchema.parse({ startYear: 2025, endYear: 2025 }), 'en'), '2025');
assert.equal(contractYears(contractSchema.parse({ endYear: 2025 }), 'en'), 'Ended: 2025');
assert.equal(contractSchema.safeParse({ startYear: 2026, endYear: 2024 }).success, false);
assert.equal(contractSchema.safeParse({ startYear: 2024, endYear: 2026, ongoing: true }).success, false);
assert.equal(contractSchema.safeParse({ funding: [{ project: 'exama', source: 'iti-irmia-plus-plus' }] }).success, false);
assert.equal(peopleSchema.safeParse({ ...fixture([]), updated: '2025-02-30' }).success, false);
const duplicate = fixture([]); duplicate.people.push({ ...duplicate.people[0] });
assert.equal(peopleSchema.safeParse(duplicate).success, false);
const directory = peopleSchema.parse(parse(readFileSync(new URL('../src/data/people.yaml', import.meta.url), 'utf8')));
const person = id => directory.people.find(person => person.id === id);
assert.deepEqual(directory.people.filter(person => !person.contractBased).map(person => person.id), ['christophe-prudhomme', 'vincent-chabannes']);
assert.equal(person('patrick-lemoine').contracts[0].durationYears, 2);
assert.equal(person('patrick-lemoine').contracts[0].startYear, null);
assert.equal(person('abdoulaye-diallo').contracts[0].funding[0].project, 'hidalgo2');
assert.deepEqual(person('luca-berti').projects.map(project => project.project), ['micro-swimmer', 'ktirio-urban-building']);
assert.equal(person('luca-berti').doctorate.source, 'https://theses.fr/2021STRAD021');
assert.equal(person('luca-berti').doctorate.defenseDate, '2021-12-13');
assert.equal(person('luca-berti').doctorate.startYear, 2018);
assert.equal(person('luca-berti').contracts.length, 0, 'Academic dates are not inferred as employment contracts');
assert.equal(person('celine-van-landeghem').contracts[0].endYear, null, 'A funding end date is not a confirmed employment end date');
assert.equal(directory.doctoralSince, 2012);
console.log(`Verified ${directory.people.length} people, multiple contracts, partial years, funding, doctoral history and date/status validation.`);
