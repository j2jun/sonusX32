const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sonus-'));
process.env.RECORDINGS_DIR = path.join(root, 'recordings');
const app = require('./index');

let server, base;
before(() => new Promise((r) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
after(() => { server.close(); fs.rmSync(root, { recursive: true, force: true }); });

const upload = (name, text) => {
  const form = new FormData();
  form.append('file', new Blob([text]), name);
  return fetch(`${base}/upload`, { method: 'POST', body: form });
};

test('upload, list, download, delete round trip', async () => {
  assert.strictEqual((await upload('Sunday Worship.scn', 'scene-a')).status, 201);
  assert.deepStrictEqual(await (await fetch(`${base}/list`)).json(), ['Sunday Worship.scn']);
  assert.strictEqual(await (await fetch(`${base}/files/Sunday%20Worship.scn`)).text(), 'scene-a');
  assert.strictEqual((await fetch(`${base}/delete/Sunday%20Worship.scn`, { method: 'DELETE' })).status, 200);
  assert.deepStrictEqual(await (await fetch(`${base}/list`)).json(), []);
});

test('upload never overwrites an existing file', async () => {
  await upload('choir.scn', 'ours');
  assert.strictEqual((await upload('choir.scn', 'theirs')).status, 409);
  assert.strictEqual(fs.readFileSync(path.join(process.env.RECORDINGS_DIR, 'choir.scn'), 'utf8'), 'ours');
});

test('path traversal is rejected on delete, download and upload', async () => {
  const victim = path.join(root, 'victim.txt');
  fs.writeFileSync(victim, 'keep me');
  assert.strictEqual((await fetch(`${base}/delete/..%2Fvictim.txt`, { method: 'DELETE' })).status, 400);
  assert.strictEqual((await fetch(`${base}/files/..%2Fvictim.txt`)).status, 404);
  await upload('../victim.txt', 'pwned'); // busboy strips the path, so this lands inside recordings/
  assert.strictEqual(fs.readFileSync(victim, 'utf8'), 'keep me');
});

test('missing file and missing upload give clear errors', async () => {
  assert.strictEqual((await fetch(`${base}/delete/nope.scn`, { method: 'DELETE' })).status, 404);
  assert.strictEqual((await fetch(`${base}/upload`, { method: 'POST' })).status, 400);
});

test('UI is served', async () => {
  assert.match(await (await fetch(base)).text(), /sonusX32/);
});
