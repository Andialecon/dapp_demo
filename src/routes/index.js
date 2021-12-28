//REQUIRES
const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const Usuario = require('../models/usuarios');
var multer = require('multer');
require('./../helpers/helpers')
const bcrypt = require('bcrypt');
const saltRounds = 10;

//PATH
const dirPartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views');
//HBS
app.set('view engine', 'hbs')
app.set('views', dirViews)
hbs.registerPartials(dirPartials)

//PAGINAS
app.get('/', (req, res) => {
    res.render('index', {
        mostrar: "",
        user: req.session.usuario,
        avatar: req.session.avatar
    })
});

app.get('/inicio', (req, res) => {
    res.redirect('/')
});

app.get('/aplication', (req, res) => {
    res.render('aplication', {
        user: req.session.usuario,
        avatar: req.session.avatar,
        mostrar: req.session.mostrar
    })
});

//Register
app.post('/login', (req, res) => {
    // console.log("Address user >>> ", req.body)
    Usuario.findOne({ address: req.body.address }, (err, encontrado) => {
        if (err) {
            return console.log(err)
        }
        if (encontrado) {
            // mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; width: max-content;">
            //                 Hola denuevo ${encontrado.address}!
            //              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            //          </div>`;
            req.session.usuario = encontrado;
            req.session.avatar = encontrado.avatar.toString('base64');
            req.session.mostrar = "";
            res.redirect('aplication')
        } else {
            const imagen = "public/uploads/user-avatar"
            let usuario = new Usuario({
                address: req.body.address,
                email: "user@gmail.com",
                avatar: imagen
            })
            usuario.save((err, newUser) => {
                if (err) {
                    return console.log(err)
                }
                
                mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; width: max-content;">
                            Bienvenido ${newUser.address}!
                         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                     </div>`;
                
                req.session.usuario = newUser;
                req.session.avatar = newUser.avatar.toString('base64');
                req.session.mostrar = mostrar;
                res.render('aplication', {
                    user: req.session.usuario,
                    avatar: req.session.avatar,
                    mostrar: req.session.mostrar
                })
                res.redirect('aplication')
                // res.send("Hello world")
                // console.log("LLEGAAA0000")
            })
        }
    })
});

//Update profile
var upload = multer({})
app.post('/editImage', upload.single('photo'), (req, res) => {
    Usuario.findOneAndUpdate({ address: req.session.usuario.address }, { avatar: req.file.buffer }, { new: true }, (err, usuario) => {
        if (err) {
            return console.log(err)
        }
        req.session.avatar = usuario.avatar.toString('base64')
        req.session.mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; width: max-content;"> The image was changed <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return res.redirect('aplication')
    })
})
app.post('/editProfile', (req, res) => {
    Usuario.findOneAndUpdate({ _id: req.session.usuario.address }, { nickname: req.body.nickname, email: req.body.email, gender: req.body.gender, age: req.body.age, country: req.body.country, idiomaNativo: req.body.idiomaNativo, idiomaDeInteres: req.body.idiomaDeInteres, description: req.body.description }, (err, usuario) => {
        if (err) {
            return console.log(err)
        }
        req.session.mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; width: max-content;"> Los cambios han sido realizados <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return res.redirect('aplication')
    })
});

//Cerrar sesion
app.post('/signOut', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err)
    })
    res.redirect('/')
})

//Error 404
app.get('*', function (req, res) {
    res.render('error');
})

module.exports = app

