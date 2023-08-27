import { unstable_dev } from 'wrangler';

const STEP = 100; // ms between each step

const target = await unstable_dev('./src/target.js', { port: 7777 });
const worker = await unstable_dev('./src/proxy.js');
const fetchToggle = async () => (await worker.fetch('http://dummy/toggle')).json();
const fetchRoot = async () => (await worker.fetch('http://dummy/')).text();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await fetchToggle().then(console.log);
console.log('          ^ Expecting NO responses to be logged because paused === true');

await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);

await fetchToggle().then(console.log);
console.log('          ^ Expecting responses to be logged because paused === false');

await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);

await fetchToggle().then(console.log);
console.log('          ^ Expecting NO responses to be logged because paused === true');

await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);

await fetchToggle().then(console.log);
console.log('          ^ Expecting responses to be logged because paused === false');

await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);
fetchRoot().then(console.log);
await wait(STEP);

await worker?.stop();
await target?.stop();
console.log('Disposed');
