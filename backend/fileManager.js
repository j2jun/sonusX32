const fs = require('fs')
const path = require('path')

const baseDir = path.join(__dirname, 'recordings');

// Ensure directory exists
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

// Save a file
function saveFile(fileName, data) {
    const filePath = path.join(baseDir, fileName);
    fs.writeFileSync(filePath, data);
}

// List all files
function listFiles() {
    return fs.readdirSync(baseDir);
}

// Delete all files
function deleteFile(fileName) {
    const filePath = path.join(baseDir, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

module.exports = { saveFile, listFiles, deleteFile };