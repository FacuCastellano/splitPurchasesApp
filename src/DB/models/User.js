//aca creo las "clase"("Schema"(esquema)) "users" de los documentos de MongoDB.
const {Schema, model} = require('mongoose')

//a continuacion instancio la clase "User"
const userSchema = new Schema ({
    name: {
        type:String,
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
    },
    //bills es una lista de elementos, en lo que cada elemento es un Objecto del tipo "ObjectID" que se refiere a documentos de Bill.
    bills:[
        {
          type: Schema.Types.ObjectId,
          ref: 'Bill'
        }
    ],
})

model('User',userSchema )

module.exports = model('User',userSchema )
