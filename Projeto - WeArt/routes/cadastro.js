var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser')
const dbsql = require("../dbsql");

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log()
res.sendFile(path.join(__dirname, '/../', 'cadastro.html'))
});
router.post('/envio', function(req, res, next) {
  dbsql.insertclientes({idade: req.body.idade, email: req.body.Email, nome: req.body.nome,infoCartão: req.body.infoCartão,endereçoCompra: req.body.endereço,telefone: req.body.tel,senha: req.body.Senha})
if(req.body.prof=="on"){res.redirect("http://localhost:3000/validacao")}

res.redirect("http://localhost:3000/")
});
module.exports = router;