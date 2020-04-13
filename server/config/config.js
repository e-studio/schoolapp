// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/tigerApp';
} else {
//variable de entorno creada en heroku con:  heroku config:set MONGO_URI="cadena de conexion a la base de datos mongoDB"
urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;