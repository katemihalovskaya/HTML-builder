const fs = require('fs');
const path = require('path');

const sourceFolder = './04-copy-directory/files';
const destFolder = './04-copy-directory/files-copy';

async function copyFiles() {
  try {
    await fs.promises.access(destFolder)
      // Delete everything in the project-dist folder
      await fs.promises.rmdir(destFolder, { recursive: true });
  } catch (err) {}
  
  await fs.promises.mkdir(destFolder);
// Copy files from the source folder to the destination folder
fs.readdir(sourceFolder, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
  } else {
    files.forEach((file) => {
      const sourceFile = path.join(sourceFolder, file);
      const destFile = path.join(destFolder, file);

      const readStream = fs.createReadStream(sourceFile);
      const writeStream = fs.createWriteStream(destFile);

      readStream.on('error', (err) => {
        console.error(`Error reading file: ${err}`);
      });

      writeStream.on('error', (err) => {
        console.error(`Error writing file: ${err}`);
      });

      writeStream.on('finish', () => {
        console.log(`File ${sourceFile} copied to ${destFile} successfully`);
      });

      readStream.pipe(writeStream);
    });
  }
});
}

copyFiles();