// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Vencimiento del Token de acceso
// 60 sec, 60 mins, 24 hrs, 30 dias
// ============================
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';


// ============================
//  Secret o seed para token
// ============================
process.env.SEED = process.env.SEED || 'este=es-el-secret-desarrollo';



// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/ventasU3';
} else {
//variable de entorno creada en heroku con:  heroku config:set MONGO_URI="cadena de conexion a la base de datos mongoDB"
urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;


// ============================
// google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '859922926901-tqhv61258evs39gcphmn51725bn749lk.apps.googleusercontent.com';
