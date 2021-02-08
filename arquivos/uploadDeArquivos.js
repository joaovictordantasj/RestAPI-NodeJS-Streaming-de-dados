const fs = require('fs');

fs.createReadStream('../assets/gato.jpg')
  .pipe(fs.createWriteStream('../assets/gatoStream.jpg'))
  .on('finish', () => {
    console.log('A imagem foi escrita com sucesso');
  });