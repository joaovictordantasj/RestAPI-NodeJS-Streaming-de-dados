const Atendimento = require('../models/atendimentos')

module.exports = app => {
    app.get('/atendimentos', (req, res) => {
      Atendimento.lista()
                 .then(resultados => res.json(resultados))
                 .catch(err => res.status(400).json(err));
    });

    app.get('/atendimentos/:id', (req, res) => {
      const id = parseInt(req.params.id);   
      
      Atendimento.buscaPorId(id, res);
      // res.send('OK');
    });

    app.post('/atendimentos', (req, res) => {
      const atendimento = req.body

      Atendimento.adiciona(atendimento)
                 .then(atendimentoCadastrado => {
                   res.status(201).json(atendimentoCadastrado);
                 })
                 .catch(err => res.status(400).json(err));
    });

    app.patch('/atendimentos/:id', (req, res) => {
      const id = parseInt(req.params.id);
      const valores = req.body;

      Atendimento.altera(id, valores, res);
    });

    app.delete('/atendimentos/:id', (req, res) => {
      const id = parseInt(req.params.id);
      Atendimento.deleta(id, res)
    });
}