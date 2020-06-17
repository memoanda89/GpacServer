//Importing dependencies
const express = require('express');
var path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
 
const cors = require('cors'); 
//Starting Express app
const app = express();
app.set('port',process.env.PORT || 3000);
//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'dist/lavameappServicio')));



const connection=mysql.createConnection({
    host     : 'myGpac.cd6tpve8jdia.us-east-2.rds.amazonaws.com',
    user     : 'root',
    password : 'Guillermo10',
    database : 'Gpac'
});
// const connection=mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'Memo8910',
//     database : 'gpac'
// });

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors(
  
    ));
    
    
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
      });
//Any routes will be redirected to the angular app
// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist/lavameappServicio/index.html'));
// });

app.get('/', (req, res) => res.send('Hello World!'))


app.get('/api/getCatalogo/:catalogo', (req, res) => {
    var catalogo =req.params.catalogo
    let sql = `SELECT * FROM `+ catalogo;
    console.log(catalogo)
      
    let query = connection.query(sql, (err, rows) => {
        var data=
       {
           catalogo:catalogo,
           contenido:rows

       }
       console.log(data)
      
        res.send(data);
      
    });
});
app.get('/api/getActivity', (req, res) => {
    let sql = `select Id ,description FROM Gpac.activity `;
    let query = connection.query(sql, (err, rows) => {
       var data=
       {
           catalogo:"Activity",
           contenido:rows

       }
   res.send(data);
    });
});




app.get('/api/getTYPE', (req, res) => {
    let sql = `select Id ,description FROM Gpac.type `;
    let query = connection.query(sql, (err, rows) => {
       var data=
       {
           catalogo:"type",
           contenido:rows

       }
        res.send(data);
    });
});



app.get('/api/getGpac', (req, res) => {



    let sql = `select * FROM Gpac.gpac_registry `;
    let query = connection.query(sql, (err, rows) => {
        res.send(rows);
    });
});

app.post('/api/filtros',(req, res) => {
console.log(req.body);
     
var name =  req.body.filter.name!="" ?' name= "'+ req.body.filter.name +'" and ': '';
var state =  req.body.filter.state!="" ?' state= "'+ req.body.filter.state +'" and ': '';


    var specilty =  req.body.filter.specilty!=0 ?'idSpecialty= '+ req.body.filter.specilty +' and ': '';
    var functional =  req.body.filter.functional!=0?'idFunctional= '+ req.body.filter.functional +' and ': '';
    var activty =  req.body.filter.activty!=0?'idActivity= '+ req.body.filter.activty +' and ': '';
    var candidate =  req.body.filter.candidate!=0?'idCandidate= '+ req.body.filter.candidate +' and ': '';
    var coach =  req.body.filter.coach!=0?'idCoach= '+ req.body.filter.coach +' and ': '';
    var industry =  req.body.filter.industry!=0?'idIndustry= '+ req.body.filter.industry +' and ': '';
    var recluter =  req.body.filter.recluter!=0 ?'idRecluiter= '+ req.body.filter.recluter +' and ': '';
    var type =  req.body.filter.type!=0?'idtype= '+ req.body.filter.type +' and ': '';
    var zip =  req.body.filter.zip!=""?'zipCode= '+ req.body.filter.zip +' and ': '';

 

    let sql = `select * FROM Gpac.gpac_registry where `+name +state +specilty+functional+activty + candidate +coach +industry +recluter +type+zip;
   
    var query2="";
    
        query2= sql.substring(0, sql.length - 4)
     
 console.log(query2)
    let query = connection.query(query2, (err, rows) => {
        res.send(rows);
    });
   
});

app.post('/api/GuardaGpac',(req, res) => {

    var name =  req.body.GuardaGpac.name;
    var specilty =  req.body.GuardaGpac.specilty;
    var functional =  req.body.GuardaGpac.functional;
    var activty =  req.body.GuardaGpac.activty;
    var candidate =  req.body.GuardaGpac.candidate;
    var coach =  req.body.GuardaGpac.coach;
    var industry =  req.body.GuardaGpac.industry;
    var recluter =  req.body.GuardaGpac.recluter;
    var type =  req.body.GuardaGpac.type;
    var zip =  req.body.GuardaGpac.zip;
    var latitud =  req.body.GuardaGpac.latitud;
    var longitud =  req.body.GuardaGpac.longitud;
    var state =  req.body.GuardaGpac.state;
 console.log(name);
    let sql = `call Gpac.GuardaGpac(?,?,?,?,?,?,?,?,?,?,?,?,?,?)  `;
    let parametros = `  `;
    let query = connection.query(sql, [ name,activty,candidate,coach,functional,industry,recluter,
        specilty,0,type,zip,latitud,longitud,state], (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.log(rows);
        res.send(rows);
       
    });
});



 

 


//Starting server on port 8081
app.listen(8081, () => {
    console.log('Server started!');
    console.log('on port 8081');
});