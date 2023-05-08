const fs = require('fs');
const path = require('path');

// Создаем папку project-dist, если она еще не существует
if (!fs.existsSync('./06-build-page/project-dist')) {
  fs.mkdirSync('./06-build-page/project-dist');
}

// Загружаем содержимое файла template.html
const template = fs.readFileSync('./06-build-page/template.html', 'utf8');

// Создаем объект с путями к файлам компонентов
const components = {
  section: './06-build-page/components/articles.html',
  header: './06-build-page/components/header.html',
  footer: './06-build-page/components/footer.html',
  // добавьте сюда пути к другим компонентам, если они есть
};

// Функция, которая заменяет все вхождения тегов в строке на содержимое соответствующих файлов
function replaceTagsInString(str, tags) {
  Object.keys(tags).forEach((tag) => {
    const filePath = tags[tag];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    str = str.split(`{{${tag}}}`).join(fileContent);
  });
  return str;
}

// Заменяем все теги в шаблоне на содержимое соответствующих файлов
const indexHTML = replaceTagsInString(template, components);

// Сохраняем новый файл index.html в папке project-dist
fs.writeFileSync(path.join('./06-build-page/project-dist', 'index.html'), indexHTML);

// Собираем все стили из папки styles в один файл
const styles = fs.readdirSync('./06-build-page/styles').filter((file) => path.extname(file) === '.css');
const styleContent = styles.map((file) => fs.readFileSync(path.join('./06-build-page/styles', file), 'utf8')).join('\n');

// Сохраняем новый файл style.css в папке project-dist
fs.writeFileSync(path.join('./06-build-page/project-dist', 'style.css'), styleContent);

// Копируем папку assets в project-dist
const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};
copyDir('./06-build-page/assets', path.join('./06-build-page/project-dist', 'assets'));