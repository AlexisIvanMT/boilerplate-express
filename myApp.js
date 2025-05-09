const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// ==============================
// MIDDLEWARE PARA SERVIR ARCHIVOS ESTÁTICOS
// ==============================
// Sirve archivos desde la carpeta /public, accesibles con la ruta /public/archivo
app.use("/public", express.static(__dirname + "/public"));
// Middleware para analizar datos codificados en el cuerpo de un formulario
app.use(bodyParser.urlencoded({ extended: false }));


// ==============================
// MIDDLEWARE DE REGISTRO (LOGGER) A NIVEL GLOBAL
// ==============================
// Registra todas las peticiones que llegan al servidor
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next(); // pasa al siguiente middleware o ruta
});

// ==============================
// RUTA PRINCIPAL "/"
// ==============================
// Envía el archivo HTML principal ubicado en /views/index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// ==============================
// RUTA "/now" CON MIDDLEWARE ENCADENADO
// ==============================
// Paso 1: Middleware para agregar la hora actual al objeto `req`
function addTime(req, res, next) {
  req.time = new Date().toString();
  next();
}

// Paso 2: Controlador que responde con un JSON que contiene la hora
app.get("/now", addTime, (req, res) => {
  console.log({ time: req.time }); // Imprime la hora en consola
  res.json({ time: req.time });   // Responde con la hora en formato JSON
});

// ==============================
// RUTA "/:word/echo" capturar una palabra estrictamente en minuscula desde la URL y devolverla en un objeto JSON
// ==============================
// Responde con un objeto JSON que contiene la palabra
app.get("/:word/echo", (req, res) => {
  const word = req.params.word; // Captura la palabra de la URL
  console.log({ echo: word }); // Imprime la palabra en consola
  res.json({ echo: word });      
});

// ==============================
//RUTA GET /name responde con un documento json que contiene el nombre y apellido
// ==============================
//app.route(path).get(handler).post(handler)
// Maneja tanto GET como POST en la misma ruta
app.route("/name")
  .get((req, res) => {
    const { first: firstName, last: lastName } = req.query; // Captura los parámetros de consulta
    console.log({ name: { first: firstName, last: lastName } }); // Imprime el nombre en consola
    res.json({ name: `${firstName} ${lastName}` }); // Responde con el nombre completo en formato JSON
  })
  .post((req, res) => {
    const { first: firstName, last: lastName } = req.body; // Captura los parámetros del cuerpo de la solicitud
    console.log({ name: { first: firstName, last: lastName } }); // Imprime el nombre en consola
    res.json({ name: `${firstName} ${lastName}` }); // Responde con el nombre completo en formato JSON
  });


// ==============================
// RUTA "/json" QUE RESPONDE CON UN MENSAJE
// ==============================
// Si la variable de entorno MESSAGE_STYLE está en "uppercase", el mensaje se convierte a mayúsculas
app.get("/json", (req, res) => {
  let message = "Hello json";

  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }

  res.json({ message });
});

// ==============================
// MIDDLEWARE DE 404 (RUTA NO ENCONTRADA)
// ==============================
// Captura cualquier ruta no definida y responde con mensaje de error
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

module.exports = app;




























module.exports = app;
