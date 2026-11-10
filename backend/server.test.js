const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sonusx32-'));
process.env.RECORDINGS_DIR = path.join(root, 'recordings');
const app = require('./index');

let server, base;
test.before(() => new Promise((r) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
test.after(() => { server.closeAllConnections(); server.close();fs.rmSync(root, { recursive: true, force: true }); });

const upload = (name, content) => {
  const form = new FormData();
  form.append('file', new Blob([content]), name);
  return fetch(`${base}/upload`, { method: 'POST', body: form });
};

test('upload, list, download, delete round trip (incl. UTF-8 name)', async () => {
  const name = '주일예배 Scene.scn';
  assert.strictEqual((await upload(name, 'v1')).status, 201);
  assert.deepStrictEqual(await (await fetch(`${base}/list`)).json(), [name]);
  assert.strictEqual(await (await fetch(`${base}/files/${encodeURIComponent(name)}`)).text(), 'v1');
  assert.strictEqual((await fetch(`${base}/delete/${encodeURIComponent(name)}`, { method: 'DELETE' })).status, 200);
  assert.deepStrictEqual(await (await fetch(`${base}/list`)).json(), []);
});

test('upload never overwrites an existing file', async () => {
  await upload('keep.scn', 'original');
  assert.strictEqual((await upload('keep.scn', 'clobber')).status, 409);
  assert.strictEqual(fs.readFileSync(path.join(process.env.RECORDINGS_DIR, 'keep.scn'), 'utf8'), 'original');
});

test('path traversal cannot touch files outside the recordings dir', async () => {
  const outside = path.join(root, 'canary.txt');
  fs.writeFileSync(outside, 'safe');
  assert.strictEqual((await fetch(`${base}/delete/..%2Fcanary.txt`, { method: 'DELETE' })).status, 400);
  assert.strictEqual((await fetch(`${base}/files/..%2Fcanary.txt`)).status, 404);
  await upload('../canary.txt', 'pwned'); // busboy strips the "../", so this lands inside recordings
  assert.strictEqual(fs.readFileSync(outside, 'utf8'), 'safe');
});

test('bad requests get clear errors', async () => {
  assert.strictEqual((await fetch(`${base}/delete/missing.wav`, { method: 'DELETE' })).status, 404);
  assert.strictEqual((await fetch(`${base}/upload`, { method: 'POST', body: new FormData() })).status, 400);
});
