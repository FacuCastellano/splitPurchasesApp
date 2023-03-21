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
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
    ],
    purchases: [{
        concept: { type: String },
        amount: { type: Number },
        payer: { type: Schema.Types.ObjectId, ref: 'User' },
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
      }]
},{ minimize: false })

model('Bill',billSchema )

module.exports = model('Bill',billSchema)