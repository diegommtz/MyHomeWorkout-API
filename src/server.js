//********** Requires ***********/
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");

const fotoRoute = require('./routes/foto.route');
const horarioRoute = require('./routes/horario.route');
const objetivoRoute = require('./routes/objetivo.route');
const personaRoute = require('./routes/persona.route');


//********** Servidor ***********/
const app = express(); 


//********** Configuraciones ***********/
//Puerto del servidor
app.set('port', process.env.PORT || 3000);


//********** Middlewares ***********/
//Log de peticiones por consola
app.use(morgan('dev'));

//Enviar y recibir jsons
app.use(bodyParser.json());

//Aceptar datos de formularios
app.use(bodyParser.urlencoded({extended: true}));

//CORS
app.use(cors());


//********** Rutas ***********/
app.use('/foto', fotoRoute);
app.use('/horario', horarioRoute);
app.use('/objetivo', objetivoRoute);
app.use('/persona', personaRoute);


//********** Global variables ***********/
//Para usarse en el jsonwebtoken
//app.set('llavetoken', "parcialFinal");

//********** Starting the server ***********/
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
    //console.log('Key token: ' + app.get('llavetoken'));
});