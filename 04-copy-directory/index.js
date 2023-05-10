const fs = require('fs');
const path = require('path');

const sourceFolder = './04-copy-directory/files';
const destFolder = './04-copy-directory/files-copy';

async function removeDirectory(dirPath) {
  const dirExists = await directoryExists(destFolder);
  console.log(dirExists);
  if (dirExists) {
    try {
      const files = await fs.promises.readdir(dirPath);
      console.log(files);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStat = await fs.promises.lstat(filePath);
        if (fileStat.isDirectory()) {
          await removeDirectory(filePath);
        } else {
          await fs.promises.unlink(filePath);
        }
      }
      await fs.promises.rmdir(dirPath);
    } catch (err) {
      console.error(`Error removing directory ${dirPath}: ${err}`);
    }
  }
}

removeDirectory(destFolder);

/* async function copyFolder() {
  const dirExists = await directoryExists(destFolder);
  console.log(dirExists);
  if(!dirExists) {
    
  } else {
    copyFiles();
  }
} */

function copyFolder() {
  // Create the destination folder
  fs.mkdir(destFolder, (err) => {
    if (err) {
      console.error(`Error creating directory: ${err}`);
    } else {
      copyFiles();
    }
  });
}

copyFolder();

function directoryExists(dirPath) {
  return new Promise((resolve) => {
    fs.stat(dirPath, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

function copyFiles() {
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
