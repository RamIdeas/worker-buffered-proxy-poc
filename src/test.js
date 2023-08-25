import assert from 'assert';
import { fetch } from 'undici';
import { unstable_dev } from 'wrangler';

const worker = await unstable_dev('./src/proxy.js');
const fetchToggle = async () => (await worker.fetch('http://dummy/toggle')).json();
const fetchRoot = async () => (await worker.fetch('http://dummy/')).text();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);

await fetchToggle().then(console.log);

await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);

await fetchToggle().then(console.log);

await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);

await fetchToggle().then(console.log);

await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);
fetchRoot().then(console.log);
await wait(100);
