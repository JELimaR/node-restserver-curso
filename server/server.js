require('./config/config');


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');


const bodyParser = require('body-parser'); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// hablitar la carpeta public
app.use( express.static( path.resolve(__dirname, '../public' )));


// configuracion de rutas
app.use( require('./routes/index') );



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
    useCreateIndex: true,
    dbName: 'cafe'
  })
  .then( () => {
    console.log('Base de datos ONLINE');
  })
  .catch((err) => console.log(err));


 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: ${ process.env.PORT }`);
});