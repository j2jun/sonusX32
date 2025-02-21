const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fileManager = require('./fileManager');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// API Routes
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    fileManager.saveFile(file.name, file.data);
    res.send({ message: 'File uploaded successfully', fileName: file.name });
});

app.get('/list', (req, res) => {
    res.send(fileManager.listFiles());
});

app.delete('/delete/:fileName', (req, res) => {
    fileManager.deleteFile(req.params.fileName);
    res.send({ message: 'File deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});