const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const indexPath = path.join(srcDir, 'index.html');

// 读取 src 目录下的所有文件
fs.readdir(srcDir, (err, files) => {
  if (err) {
    return console.error('无法读取目录：', err);
  }

  // 过滤出 .html 文件，并排除 index.html
  const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');

  // 读取 index.html 文件内容
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      return console.error('无法读取 index.html:', err);
    }

    // 找到 <!-- FILE-LIST-START --> 和 <!-- FILE-LIST-END --> 之间的部分
    const startTag = '<!-- FILE-LIST-START -->';
    const endTag = '<!-- FILE-LIST-END -->';
    const startIndex = data.indexOf(startTag) + startTag.length;
    const endIndex = data.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1) {
      return console.error('未找到标记');
    }

    // 生成新的文件列表内容
    // 格式如下：<li><a href="./demo.html" title="demo.html" class="file html">demo.html</a></li>
    const fileListContent = htmlFiles.map(file => `        <li><a href="./${file}" title="${file}" class="file html">${file}</a></li>`).join('\n');

    // 插入新的文件列表内容
    const newData = data.slice(0, startIndex) + '\n' + fileListContent + `\n        ` + data.slice(endIndex);

    // 将更新后的内容写回 index.html
    fs.writeFile(indexPath, newData, 'utf8', err => {
      if (err) {
        return console.error('无法写入 index.html:', err);
      }
      console.log('index.html 更新成功');
    });
  });
});