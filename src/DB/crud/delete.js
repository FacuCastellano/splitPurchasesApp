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
  console.log("borrando a: ",participantStringId,"\nDe la cuenta: ",billStringID )
  const billObjectId = new ObjectId(billStringID)
  let participantId = participantStringId
  if(ObjectId.isValid(participantStringId)){
    participantId = new ObjectId(participantStringId)
    await User.updateOne(
      {_id:participantId},
      {$pull:{bills:billObjectId}}
      )
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
      }
      ,
      //elimino al alias de 
      {
        updateOne: {
          filter: { _id: billObjectId },
          update: { $unset: { ["alias." + participantStringId]: "" } },
        },
      }
      ,
      //elimino todos los gastos que lo tengan como pagador (elimino el gasto totalmente) 
      {
        updateMany: {
          filter: {  _id: billObjectId, "purchases.payer": participantStringId },
          update: { $pull: { purchases: { payer: participantStringId } } }
        }
       }
      ,
      //lo elimino a la persona de todos los gastos que participo. (no elimino el gasto solo al participante)
      {
        updateMany: {
          filter: { _id: billObjectId },
          update: {
            $pull: { "purchases.$[purchase].participants": participantStringId },
          },
          arrayFilters: [{ "purchase.participants": participantStringId }],//esta linea es clave para que elimine de todos los purchases, sino elimina solo del primero.
        },
      }
    ]
  )
  //Rehago el balance.
  await makeBalance(billStringID)
  console.log("en teoria todo ok")
}



async function deletePurchaseFromBill(billStringID,purchaseStringId){
  const billObjectId = new ObjectId(billStringID)
  const purchaseObjectId = new ObjectId(purchaseStringId)
 
  await Bill.findOneAndUpdate(
    { _id: billObjectId },
    { $pull: { purchases: { _id: purchaseObjectId } } },
    { new: true }
  );
  //Rehago el balance.
  await makeBalance(billStringID)
}
//deletePurchaseFromBill('64397c89ac0a79ac1baa03e2','643a9c58fad3db71b5cfec83')



//deleteParticipantFromBill("643d76d04d00053061ca9945","carbel") 

module.exports ={
  deleteBill,
  deleteParticipantFromBill,
  deletePurchaseFromBill
}