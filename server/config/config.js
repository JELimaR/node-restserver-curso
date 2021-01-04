


// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de Datos
let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://juanlr07:VPdeig0ecqXt7jif@cluster0.tmj2e.mongodb.net/cafe';
}

//urlDB = 'mongodb://juanlr07:VPdeig0ecqXt7jif@cluster0-shard-00-02.tmj2e.mongodb.net:27017/cafe';
urlDB = `mongodb://juanlr07:VPdeig0ecqXt7jif@cluster0.tmj2e.mongodb.net/`
        + 'cafe?retryWrites=true&w=majority';

process.env.URLDB = urlDB;
