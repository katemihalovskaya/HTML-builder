const fs = require('fs').promises;
const path = require('path');

const distDir = './06-build-page/project-dist';

async function buildPage() {
  try {
    await fs.access(distDir)
      // Delete everything in the project-dist folder
      await fs.rm(distDir, { recursive: true });
  } catch (err) {}

  await fs.mkdir(distDir);

  // Load the contents of the template.html file
  const template = await fs.readFile('./06-build-page/template.html', 'utf8');

  // Define paths to component files
  const components = await getComponents();
  
  // Function to replace all tag occurrences in a string with the content of the corresponding file
  async function replaceTagsInString(str, tags) {
    for (const tag of Object.keys(tags)) {
      const filePath = tags[tag];
      const fileContent = await fs.readFile(filePath, 'utf8');
      str = str.split(`{{${tag}}}`).join(fileContent);
    }
    return str;
  }

  // Replace all tags in the template with the contents of the corresponding files
  const indexHTML = await replaceTagsInString(template, components);
  
  // Save the new index.html file in the project-dist folder
  await fs.writeFile(path.join(distDir, 'index.html'), indexHTML);

  // Combine all styles from the styles folder into one file
  const styles = (await fs.readdir('./06-build-page/styles'))
    .filter((file) => path.extname(file) === '.css');
  const styleContent = await Promise.all(styles.map((file) => fs.readFile(path.join('./06-build-page/styles', file), 'utf8')));

  // Save the new style.css file in the project-dist folder
  await fs.writeFile(path.join(distDir, 'style.css'), styleContent.join('\n'));

  // Copy the assets folder to the project-dist folder
  const copyDir = async (src, dest) => {
    await fs.mkdir(dest, { recursive: true });
    const files = await fs.readdir(src);
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      if ((await fs.stat(srcPath)).isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  };
  await copyDir('./06-build-page/assets', path.join(distDir, 'assets'));
}

buildPage().catch(console.error);

//create components object

const folderPath = './06-build-page/components';

async function getComponents() {
  const files = await fs.readdir(folderPath);
  const components = {};

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isFile()) {
      const extension = path.extname(file).substring(1);
      const fileName = path.basename(file, `.${extension}`);
      components[fileName] = `./06-build-page/components/${fileName}.html`;
    }
    
  }
  
  return components;
}