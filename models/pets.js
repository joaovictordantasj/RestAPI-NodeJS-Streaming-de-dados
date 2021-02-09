const conexao = require('../infraestrutura/conexao')
const uploadDeArquivo = require('../arquivos/uploadDeArquivos')

class Pet {
  adiciona(pet, res) {
    const query = 'INSERT INTO Pets SET ?'

    uploadDeArquivo(pet.imagem, pet.nome, (err, novoCaminho) => {
      if (err) {
        res.status(400).json({ err })
      } else {
        const novoPet = { nome: pet.nome, imagem: novoCaminho }

        conexao.query(query, novoPet, err => {
          if (err) {
            console.log(err)
            res.status(400).json(err)
          } else {
            res.status(200).json(novoPet)
          }
        })
      }
    })
  }
}

module.exports = new Pet()