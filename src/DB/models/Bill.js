//aca creo las "clase"("Schema"(esquema)) "Bills" de los documentos de MongoDB.
const {Schema, model}=require('mongoose')

//a continuacion instancio una nueva clase.
const billSchema = new Schema ({
    concept: String,
    date: {
        type:Date,
        default: new Date()
    },
    //idem participants, pero no necesariamente todos los participantes son admines.
    admins:[
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
    ],
    //participants es una lista de ObjectID en donde cada ObjectID hace referencia un documento del model (collection) "User"
    participants: [
      { type: Schema.Types.Mixed}
    ],
    alias:{
      type: Schema.Types.Mixed, // con esto inicializo un objeto vacio que despues lo voy a ir llenando.
      default: {}
    },
    purchases: [
      {
        concept: { type: String },
        amount: { type: Number },
        payer: { type: Schema.Types.Mixed },
        participants: [{ type: Schema.Types.Mixed}]
      }
    ],
    balances: {
      type: Schema.Types.Mixed, // con esto inicializo un objeto vacio que despues lo voy a ir llenando.
      default: {}
    }
        
    
},{ minimize: false })

model('Bill',billSchema )

module.exports = model('Bill',billSchema)