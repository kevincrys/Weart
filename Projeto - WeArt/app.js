var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var autenticacaoRouter = require('./routes/autenticacao');
var cadastroRouter = require('./routes/cadastro');
var validacaoRouter = require('./routes/validacao');
var vendasRouter = require('./routes/vendas');
var comprasRouter = require('./routes/compras');
var portfolioRouter = require('./routes/portfolio');
var visualizarRouter = require('./routes/visualizar');
var profissionalRouter = require('./routes/profissional');
var servicoRouter = require('./routes/servico');


const passport = require("passport");
var app = express();

const dbsql = require("./bd/dbsql");

var bodyParser = require('body-parser')
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Sequelize = require('sequelize');


require('./config/auten')(passport);
app.use(session({
  store: new MySQLStore({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Kevinbd1999",
    database: "base1"
  }),
  secret: "senhadoblg4321",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30min
}))
app.use(passport.initialize());
require('./config/googleauten');
app.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/google' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.use(passport.session());


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/', indexRouter);
app.use('/autenticacao', autenticacaoRouter);
app.use('/cadastro', cadastroRouter);
app.use('/validacao', validacaoRouter);
app.use('/vendas', vendasRouter);
app.use('/compras', comprasRouter);
app.use('/portfolio', portfolioRouter);
app.use('/visualizar', visualizarRouter);
app.use('/profissional', profissionalRouter);
app.use('/servico', servicoRouter);

  app.get('/data', (req, res) => {
    var sqlp = dbsql.selectallprof();
    sqlp.then(sql => {
        res.send(sql)

    })
  });


  app.get('/datac', (req, res) => {
    var sqlp = dbsql.checacompras(req.session.passport.user[0].clienteid);
    sqlp.then(sql => {
        res.send(sql)

    })
  });

  app.get('/datav', (req, res) => {
    var sqlp = dbsql.checavendas(req.session.passport.user[0].clienteid);
    sqlp.then(sql => {
        res.send(sql)

    })
  });
  app.get('/datav/:id', function(req, res, next) {
    var sqlp = dbsql.selectrevisao(req.params.id);
    sqlp.then(sql => {
        res.send(sql)
    })
  });

  app.get('/dataprojeto', (req, res) => {
    var sqlp = dbsql.selectprojetobyid(req.session.passport.user[0].clienteid);
    sqlp.then(sql => {
        res.send(sql)

    })
  });


  app.get('/sessao', (req, res) => {

    res.send(req.session.passport.user)

  });
  app.get('/prof', (req, res) => {
if(req.session.passport.user != undefined){
    var sqlp = dbsql.selectclienteProfById(req.session.passport.user[0].clienteid);
    sqlp.then(sql => {
        res.send(sql)

    })
  }
  });



app.listen(3000, function(){});
