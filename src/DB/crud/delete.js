console.log('ejecutando deletejs')
const db = require('../connection')
const User = require('../models/User')
const Bill = require('../models/Bill')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const {makeBalance} = require('./update.js')
//console.log(db)
        
async function deleteBill(billStringId) {
  try {
    const billObjectId = new ObjectId(billStringId);

    // Buscar la bill correspondiente en la base de datos
    const bill = await Bill.findById(billObjectId);
    if (!bill) {
      throw new Error(`Bill con ID ${billStringId} no encontrada`)
    }

    // Obtener los identificadores de los participantes
    const participantsIds = bill.participants
      .filter(p => ObjectId.isValid(p))
      .map(p => new ObjectId(p))

    // Actualizo los documentos de usuario correspondientes
    await User.updateMany(
      { _id: { $in: participantsIds } },
      { $pull: { bills: billObjectId } }
    )

    // Eliminar la bill de la base de datos
    await Bill.findByIdAndDelete(billObjectId);

    console.log(`La bill con ID ${billStringId} eliminada exitosamente`)

    return true
  } catch (error) {
    console.error(`Error al eliminar la bill: ${error.message}`)
    return false
  }
}

async function deleteParticipantFromBill(billStringID,participantStringId){
  const billObjectId = new ObjectId(billStringID)
  let participantId = participantStringId
  if(ObjectId.isValid(participantStringId)){
    participantId = new ObjectId(participantStringId)
  }
  //aca hago todas las operaciones con una sola conexion a la BD
  await Bill.bulkWrite(
    [
      //elimino al participante de Participants (ojo que puesta estar como un ObjectId o como un string)
      {
        updateOne: {
          filter: { _id: billObjectId },
          update: { $pull: { participants: participantId } }
        }
      },
      //elimino todos los gastos que lo tengan como pagador (elimino el gasto totalmente)
      {
        updateMany: {
          filter: {  _id: billObjectId, "purchases.payer": participantStringId },
          update: { $pull: { purchases: { payer: participantStringId } } }
        }
      },
      //lo elimino a la persona de todos los gastos que participo. (no elimino el gasto solo al participante)
      {
        updateMany: {
          filter: { _id: billObjectId, "purchases.participants": participantStringId },
          update: { $pull: { "purchases.$.participants": participantStringId } }
        }
      }
    ]
  )
  //Rehago el balance.
  await makeBalance(billStringID)
  
}


//deleteParticipantFromBill("6436a06e2db10265cc469dab","64317dfa41891b318bcffac5")

module.exports ={
  deleteBill,
  deleteParticipantFromBill
}