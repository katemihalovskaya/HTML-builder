const fs = require('fs');
const path = require('path');

const stylesDir = './05-merge-styles/styles';

const isFileCss = (filename) => {
    const extname = path.extname(filename);
    return extname === '.css';
  };

const bundleFile = './05-merge-styles/project-dist/bundle.css';
const styles = [];

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (isFileCss(file)) {
      const filepath = path.join(stylesDir, file);
      const content = fs.readFileSync(filepath, 'utf8');
      styles.push(content);
    }
  });

  // запись стилей в файл bundle.css
  fs.writeFileSync(bundleFile, '');
  styles.forEach((style) => {
    fs.appendFileSync(bundleFile, style);
  });
});

