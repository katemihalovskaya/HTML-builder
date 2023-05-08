const fs = require('fs');
const path = require('path');

// Create the files-copy directory if it doesn't exist
const targetDir = path.join(__dirname, 'files-copy');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

// Read the contents of the files directory
const sourceDir = path.join(__dirname, 'files');
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error(`Error reading files directory: ${err}`);
    return;
  }

  // Copy each file from the source directory to the target directory
  files.forEach(file => {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);

    fs.copyFile(sourceFile, targetFile, err => {
      if (err) {
        console.error(`Error copying file ${file}: ${err}`);
        return;
      }
      console.log(`Copied ${file} to files-copy directory`);
    });
  });
});

