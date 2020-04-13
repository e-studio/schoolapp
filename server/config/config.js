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
urlDB = 'mongodb+srv://schoolapp:HORUgkx7i8L4qLYo@cmstudio-0lz0x.mongodb.net/tigerApp';

}

process.env.URLDB = urlDB;