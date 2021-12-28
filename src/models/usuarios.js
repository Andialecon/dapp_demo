const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    address : {
        type : String,
        trim:true,
        required : true
    },
    email : {
        type : String,
        trim:true,
        required : true
    },
    avatar : {
        type : Buffer
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario 
