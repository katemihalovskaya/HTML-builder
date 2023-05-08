const fs = require('fs');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error getting file stats for ${file}: ${err}`);
        return;
      }

      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = Math.ceil(fileSizeInBytes / 1024);
        const extension = path.extname(file).substring(1);
        const fileName = path.basename(file, `.${extension}`);

        console.log(`${fileName} - ${extension} - ${fileSizeInKB}kb`);
      }
    });
  });
});
