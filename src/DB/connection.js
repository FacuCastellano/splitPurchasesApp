const mongoose = require('mongoose')
const uri = 'mongodb://127.0.0.1:27017/splitpurchasesDB'
const db = mongoose.connection 

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})

//este evento se dispara cuando se conecto a la BD.
db.on('open',()=>{
    console.log("database is connected to ",uri)
})

//este evento se dispara cuando hubo un error en la coneccion a la BD.
db.on('error',err=>{
    console.log("Ha ocurrido un error")
    console.log(err)
})