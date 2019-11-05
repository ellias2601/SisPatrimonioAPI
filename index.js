const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3023; //porta padrão
const mysql = require('mysql');

	
//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

	
//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

	
//inicia o servidor
app.listen(port);
console.log('API funcionando!');

	
function execSQLQuery(sqlQry, res){

  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'root',
    database : 'SisPatr'
  });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('Query Executada!');
  });
}

	
router.get('/fundos', (req, res) =>{
    execSQLQuery('SELECT Fundo.idFundo, Fundo.siglaFundo, Fundo.nomeFundo FROM Fundo', res);
})


router.get('/tiposBem', (req, res) =>{
    execSQLQuery('SELECT TipoBem.idTipoBem, TipoBem.nomeTipoBem FROM TipoBem', res);
})


router.get('/subElementos', (req, res) =>{
    execSQLQuery('SELECT SubElemento.idSubElemento, SubElemento.descricaoSubElemento  FROM SubElemento', res);
})


router.get('/classificacoes', (req, res) =>{
    execSQLQuery(' SELECT Classificacao.idClassificacao, Classificacao.nomeClassificacao  FROM Classificacao', res);
})


router.get('/estadosBem', (req, res) =>{
    execSQLQuery('SELECT EstadoBem.idEstadobem, EstadoBem.nomeEstadoBem FROM EstadoBem', res);
})


router.get('/responsaveis', (req, res) =>{
    execSQLQuery(' SELECT Responsavel.idResponsavel, Responsavel.nomeResponsavel, Responsavel.sobrenomeResponsavel FROM Responsavel', res);
})

	
router.get('/secretariasPorFundo/:idFundo?', (req, res) =>{
    
    let filter = '';

    if(req.params.idFundo) 
  
       filter = ' WHERE Secretaria.idFundo=' + parseInt(req.params.idFundo);

       execSQLQuery('SELECT Secretaria.idSecretaria, Secretaria.descricaoSecretaria FROM Secretaria INNER JOIN Fundo ON Fundo.idFundo = Secretaria.idFundo' + filter, res);
   
})


router.get('/origensPorFundoESecretaria/:idFundo?/:idSecretaria?', (req, res) =>{
    
    let filter = '';

    if(req.params.idFundo && req.params.idSecretaria) 
  
       filter = ' WHERE Fundo.idFundo=' + parseInt(req.params.idFundo) + ' and Secretaria.idSecretaria=' + parseInt(req.params.idSecretaria);

       execSQLQuery('SELECT Origem.idOrigem, Origem.descricaoOrigem FROM Fundo INNER JOIN Secretaria ON Fundo.idFundo = Secretaria.idFundo INNER JOIN Origem         			     ON Secretaria.idSecretaria = Origem.idSecretaria' + filter, res);
   
})


router.get('/destinosPorFundoSecretariaEOrigem/:idFundo?/:idSecretaria?/:idOrigem?', (req, res) =>{
    
    let filter = '';

    if(req.params.idFundo && req.params.idSecretaria && req.params.idOrigem) 
  
       filter = ' WHERE Fundo.idFundo=' + parseInt(req.params.idFundo) + ' and Secretaria.idSecretaria=' + parseInt(req.params.idSecretaria) + ' and Destino.idOrigem=' +   			parseInt(req.params.idOrigem) ;

       execSQLQuery('SELECT Destino.idDestino, Destino.nomeDestino FROM Fundo INNER JOIN Secretaria  ON Fundo.idFundo = Secretaria.idFundo INNER JOIN Origem ON      		             Secretaria.idSecretaria = Origem.idSecretaria  INNER JOIN Destino ON Origem.idOrigem = Destino.idOrigem' + filter, res);
   
})


router.get('/subDestinosPorFundoSecretariaOrigemEDestino/:idFundo?/:idSecretaria?/:idOrigem?/:idDestino?', (req, res) =>{
    
    let filter = '';

    if(req.params.idFundo && req.params.idSecretaria && req.params.idOrigem && req.params.idDestino) 
  
       filter = ' WHERE Fundo.idFundo=' + parseInt(req.params.idFundo) + ' and Secretaria.idSecretaria=' + parseInt(req.params.idSecretaria) + ' and Destino.idOrigem=' +   			parseInt(req.params.idOrigem) + ' and SubDestino.idDestino=' + parseInt(req.params.idDestino);

       execSQLQuery('SELECT SubDestino.idSubDestino, SubDestino.nomeSubDestino FROM Fundo INNER JOIN Secretaria  ON Fundo.idFundo = Secretaria.idFundo  INNER JOIN Origem   			     ON Secretaria.idSecretaria = Origem.idSecretaria INNER JOIN Destino ON Origem.idOrigem = Destino.idOrigem INNER JOIN SubDestino ON Destino.idDestino = 			     SubDestino.idDestino' + filter, res);
   
})


router.get('/empresas', (req, res) =>{
    execSQLQuery('SELECT Empresa.idEmpresa, Empresa.nomeFantEmpresa FROM Empresa', res);
})


router.get('/contascontabeis', (req, res) =>{
    execSQLQuery('SELECT ContaContabil.idContaContabil, ContaContabil.descricaoContaContabil, ContaContabil.codigoContaContabil FROM ContaContabil', res);
})


router.get('/tiposaquisicao', (req, res) =>{
    execSQLQuery(' SELECT TipoAquisicao.idTipoAquisicao, TipoAquisicao.descricaoTipoAquisicao FROM TipoAquisicao', res);
})


router.get('/tiposincorporacao', (req, res) =>{
    execSQLQuery('SELECT TipoIncorporacao.idTipoIncorporacao, TipoIncorporacao.descricaoTipoIncorporacao FROM TipoIncorporacao', res);
})

	
router.post('/salvarCadastro', (req, res) =>{

    const dataCadastroBem = req.body.dataCadastroBem;
    const descricaoBem = req.body.descricaoBem;
    const valorBem = req.body.valorBem;
    const numeroAtualBem = req.body.numeroAtualBem;
    const numeroAntigoBem = req.body.numeroAntigoBem;
    const observacoesBem = req.body.observaçõesBem;
    const qtdACadastrarBem = req.body.qtdACadastrarBem;
    const idUsuario = req.body.idUsuario;
    const idFundo = req.body.idFundo;
    const idTipoBem = req.body.idTipoBem;
    const idSubElemento = req.body.idSubElemento;
    const idClassificacao = req.body.idClassificacao;
    const idEstadoBem = req.body.idEstadoBem;
    const idEmpresa = req.body.idEmpresa;
    const idResponsavel = req.body.idResponsavel;
    const idOrigem = req.body.idOrigem;
    const idDestino = req.body.idDestino;
    const idSubDestino = req.body.idSubDestino;
    const idContaContabil = req.body.idContaContabil;
    const idTipoAquisicao = req.body.idTipoAquisicao;
    const idTipoIncorporacao = req.body.idTipoIncorporacao;
    
         execSQLQuery(`INSERT INTO Bem(dataCadastroBem, descricaoBem, valorBem, numeroAtualBem, numeroAntigoBem, observaçõesBem, qtdACadastrarBem, idUsuario, idFundo,
                                  idTipoBem,idSubElemento, idClassificacao, idEstadoBem, idEmpresa, idResponsavel, idOrigem, idDestino, idSubDestino, idContaContabil,    					  idTipoAquisicao, idTipoIncorporacao) 
                                  VALUES('${dataCadastroBem}','${descricaoBem}','${valorBem}', '${numeroAtualBem}', '${numeroAntigoBem}', '${observacoesBem}',
                                         '${qtdACadastrarBem}', '${idUsuario}', '${idFundo}', '${idTipoBem}', '${idSubElemento}', '${idClassificacao}', 
                                         '${idEstadoBem}', '${idEmpresa}', '${idResponsavel}', '${idOrigem}', '${idDestino}', '${idSubDestino}', '${idContaContabil}',
                                         '${idTipoAquisicao}', '${idTipoIncorporacao}' )`, res);
});


router.get('/consultaPorNumeroPatrimonio/:numeroAtualBem?', (req, res) =>{
    
    let filter = '';

    if(req.params.numeroAtualBem) 
  
       filter = ' WHERE Bem.numeroAtualBem=' + parseInt(req.params.numeroAtualBem);

       execSQLQuery('SELECT Bem.dataCadastroBem, Bem.descricaoBem, Bem.valorBem, Bem.numeroAtualBem, Bem.numeroAntigoBem, Bem.observaçõesBem, Fundo.nomeFundo,   		                    TipoBem.nomeTipoBem, SubElemento.descricaoSubElemento, Classificacao.nomeClassificacao, EstadoBem.nomeEstadoBem, Empresa.nomeFantEmpresa,    	                     Responsavel.nomeResponsavel, Responsavel.sobrenomeResponsavel, Origem.descricaoOrigem, Destino.nomeDestino, SubDestino.nomeSubDestino,   		                    ContaContabil.descricaoContaContabil, TipoAquisicao.descricaoTipoAquisicao, TipoIncorporacao.descricaoTipoIncorporacao  FROM Bem  INNER JOIN  				    Fundo ON Fundo.idFundo = Bem.idFundo INNER JOIN TipoBem ON TipoBem.idTipoBem = Bem.idTipoBem  INNER JOIN SubElemento ON 				    SubElemento.idSubElemento = Bem.idSubElemento INNER JOIN Classificacao ON Classificacao.idClassificacao = Bem.idClassificacao  INNER JOIN 				    EstadoBem ON EstadoBem.idEstadoBem = Bem.idEstadoBem  INNER JOIN Empresa ON Empresa.idEmpresa = Bem.idEmpresa INNER JOIN Responsavel ON 				    Responsavel.idResponsavel = Bem.idResponsavel INNER JOIN Origem ON Origem.idOrigem = Bem.idOrigem INNER JOIN Destino ON Destino.idDestino = 			    Bem.idDestino  INNER JOIN SubDestino ON SubDestino.idSubDestino = Bem.idSubDestino INNER JOIN ContaContabil  ON ContaContabil.idContaContabil = 				    Bem.idContaContabil INNER JOIN TipoAquisicao ON TipoAquisicao.idTipoAquisicao = Bem.idTipoAquisicao  INNER JOIN TipoIncorporacao ON 			    TipoIncorporacao.idTipoIncorporacao = Bem.idTipoIncorporacao' + filter, res);
   
})


	










