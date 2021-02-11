const conexao = require('./conexao');

const execuraQuery = (query, params = '') => {
  return new Promise((resolve, reject) => {
    conexao.query(query, params, (err, restultados, campos) => {
      if (err) {
        reject(err);
      } else {
        resolve(restultados);
      }
    });
  });
}