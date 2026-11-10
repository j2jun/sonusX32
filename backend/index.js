const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dir = path.resolve(process.env.RECORDINGS_DIR || path.join(__dirname, 'recordings'));
fs.mkdirSync(dir, { recursive: true });

// Plain file names only: blocks "../x", "a/b", absolute paths, dotfiles and NUL bytes.
function filePath(name) {
  if (!name || name !== path.basename(name) || name.startsWith('.') || name.includes('\0')) return null;
  return path.join(dir, name);
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// Temp files keep large recordings out of RAM; utf8 keeps non-ASCII names intact.
app.use(fileUpload({ useTempFiles: true, tempFileDir: os.tmpdir(), defParamCharset: 'utf8' }));

app.get('/list', (req, res) => {
  const files = fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();
  res.json(files);
});

app.post('/upload', async (req, res) => {
  const file = req.files?.file;
  if (!file || Array.isArray(file)) return res.status(400).json({ error: 'Send one file in field "file"' });
  try {
    const dest = filePath(file.name);
    if (!dest) return res.status(400).json({ error: 'Invalid file name' });
    // COPYFILE_EXCL: never overwrite someone else's file (atomic, no check-then-write race).
    await fs.promises.copyFile(file.tempFilePath, dest, fs.constants.COPYFILE_EXCL);
    res.status(201).json({ fileName: file.name });
  } catch (err) {
    if (err.code === 'EEXIST') return res.status(409).json({ error: `"${file.name}" already exists. Rename it or delete the old one first.` });
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  } finally {
    fs.promises.rm(file.tempFilePath, { force: true }).catch(() => {});
  }
});

app.get('/files/:fileName', (req, res) => {
  const p = filePath(req.params.fileName);
  if (!p || !fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
  res.download(p);
});

app.delete('/delete/:fileName', (req, res) => {
  const p = filePath(req.params.fileName);
  if (!p) return res.status(400).json({ error: 'Invalid file name' });
  fs.unlink(p, (err) => {
    if (err?.code === 'ENOENT') return res.status(404).json({ error: 'Not found' });
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'File deleted' });
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`sonusX32 running on http://localhost:${PORT} (files in ${dir})`));
}
