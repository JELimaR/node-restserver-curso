

/*  ==============
        Puerto
    ==============  */  
process.env.PORT = process.env.PORT || 3000;

/*  ==============
    Entorno
    ==============  */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*  ==============
    Base de Datos
    ==============  */
let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/';
} else {
    urlDB = process.env.MONGO_URI
        + 'cluster0-shard-00-00.tmj2e.mongodb.net:27017'
        + 'cluster0-shard-00-01.tmj2e.mongodb.net:27017'
        + 'cluster0-shard-00-02.tmj2e.mongodb.net:27017'
        + '?tls=true';
}

process.env.URLDB = urlDB;
