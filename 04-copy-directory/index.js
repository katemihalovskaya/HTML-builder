const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const sourceFolder = './04-copy-directory/files';
const destFolder = './04-copy-directory/files-copy';

// Remove the destination folder and its contents
rimraf(destFolder, (err) => {
  if (err) {
    console.error(`Error removing directory: ${err}`);
  } else {
    // Create the destination folder
    fs.mkdir(destFolder, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`);
      } else {
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
    });
  }
});


