const fs = require('fs');
import config from './config.json';

const folder = `${config["input-path"]}`;
const outputPath = `${config["file-name"]}`;

fs.readdir(folder, (err, files) => {
  const havingLogs = [];
  if(err) {
    console.error(err)
    return;
  }
  files.forEach((file) => {
    havingLogs.push(file);
  });

  const json = JSON.stringify(havingLogs);
  fs.writeFile(outputPath, json, () => {
    console.log('Change log history update..');
  });

});
