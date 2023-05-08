const fs = require('fs');
const path = require('path');

const stylesDir = './05-merge-styles/styles';
const bundleFile = './05-merge-styles/project-dist/bundle.css';

// Функция проверки, является ли файл css
const isCssFile = (filename) => {
  const extname = path.extname(filename);
  return extname === '.css';
};

// Чтение содержимого папки styles
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const styles = [];

  // Фильтрация css-файлов
  const cssFiles = files.filter((file) => isCssFile(file));

  // Асинхронное чтение каждого файла и запись данных в массив стилей
  cssFiles.forEach((file) => {
    const filepath = path.join(stylesDir, file);
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      styles.push(data);

      // Запись массива стилей в файл bundle.css
      if (styles.length === cssFiles.length) {
        fs.writeFile(bundleFile, styles.join('\n'), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Styles were successfully merged into ${bundleFile}`);
        });
      }
    });
  });
});