const moment = require('moment');
const axios = require('axios');
const conexao = require('../infraestrutura/database/conexao');
const repositorio = require('../repositorios/atendimento');

class Atendimento {
  constructor () {
    this.dataEhValida = ({data, dataCriacao}) => moment(data).isSameOrAfter(dataCriacao);
    this.clienteEhValido = (tamanho) => tamanho >= 3;

    this.valida = parameters => this.validacoes.filter(campo => {
      const { nome } = campo;
      const parameto = parametos[nome];

      return !campo.valido(parameto);
    });

    this.validacoes = [
      {
        nome: 'data',
        valido: this.dataEhValida,
        mensagem: 'Data deve ser maior ou igual a data atual'
      },
      {
        nome: 'cliente',
        valido: this.clienteEhValido,
        mensagem: 'Cliente deve ter pelo menos 3 caracteres'
      }
    ];
  }

  adiciona(atendimento) {
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
    
    const paramentros = {
      data: { data, dataCriacao },
      cliente: { tamanho: atendimento.cliente.lenth }
    };
    const erros = this.valida(paramentros);
    const existemErros = erros.length;

    if(existemErros) {
      return new Promise(resolve, reject => reject(erros))
    } else {
      const atendimentoDatado = {...atendimento, dataCriacao, data};

      return repositorio.adiciona(atendimentoDatado)
                        .then(resultados => {
                          const id = resultados.insertId 
                          return ({... atendimento, id});
                        });
    }
  }

  lista(res) {
    const sql = 'SELECT * FROM Atendimentos';
    conexao.query(sql, (err, resultados) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(resultados);
      }
    });
  }

  buscaPorId (id, res) {
    const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

    conexao.query(sql, async (err, resultados) => {
      const atendimento = resultados[0];
      const cpf = atendimento.cliente;
      if (err) {
        res.status(400).json(err);
      } else {
        const { data } = await axios.get(`http://localhost:8082/${cpf}`);
        atendimento.cliente = data;
        res.status(200).json(atendimento);
      }
    })
  }

  altera(id, valores, res) {
    if (valores.data) {
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
    }
    const sql = 'UPDATE Atendimentos SET ? WHERE id=?';

    conexao.query(sql, [valores, id], (err, resultados) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({...valores, id});
      }
    })
  }

  deleta(id, res) {
    const sql = 'DELETE FROM Atendimentos WHERE id=?';

    conexao.query(sql, id, (err, resultados) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({id});
      }
    })
  }
}

module.exports = new Atendimento