//Requires
require('./config/config');
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Usuario = require('./models/usuarios');
const bodyParser = require('body-parser');
const session = require('express-session');
var MemoryStore = require('memorystore')(session)
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const axios = require('axios');

io.on('connection', client => {
	//  client.emit("nuevaConexion", {client:client.id})

	client.on("login", async (data) => {
		// console.log("Address:", data.user);
		await axios.post("http://localhost:3000/login",{name: data.user}).then(function(response){console.log(response.data)})
		.catch(function (error){console.log(error)})
	})
})

// global.participantes=[];

// io.on('connection', client => {
// 	client.emit("newConection", {client:client.id})

// 	client.on('event', data => { /* … */ });

// 	client.on('disconnect', () => {
// 		desconectado = participantes.find(conection => conection.id==client.id)
// 		newList = participantes.filter(conection => conection.id!=client.id)
// 		participantes=newList;
// 		if(desconectado){
// 			contador=participantes.length
// 			io.emit('disconnet', {desconectado:desconectado.user.nickname, participantes:participantes, count:contador});
// 		}
// 	});
// });

app.use(session({
	cookie: { maxAge: 86400000 },
	store: new MemoryStore({
		checkPeriod: 86400000 // prune expired entries every 24h
	}),
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}))

app.use((req, res, next) => {
	if (req.session.usuario) {
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
	}
	next()
})

//Paths
const dirPublic = path.join(__dirname, '../public')
//Statics
app.use(express.static(dirPublic))

//BodyParser 
app.use(bodyParser.urlencoded({ extended: false }))

//Routes
app.use(require('./routes/index'))

//Database
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, resultado) => {
	if (err) {
		return console.log(error)
	}
	console.log("conectado")
});

// SETINGS 
const port = process.env.PORT || 3000

//SERVIDOR
server.listen(port, () => {
	console.log(`server on port  ${port}`)
});

