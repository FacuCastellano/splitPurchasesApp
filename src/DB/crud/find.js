console.log('ejecutando find.js')
require('../connection')
const User = require('../models/User')
const Bill = require('../models/Bill')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


//esta funcion devuelve true si el usuario existe 
async function checkUserExistenceByEmail(email){
    try{
        
        const user = await User.findOne({email:email.toLowerCase()})
        if(user){
            return true
        }else{
            return false
        }

    }catch(err){
        return null // si ocurre un error tira null.. no error.
    }
}

//esta funcion recibe el email(string) de un usuario y devuelve el ObjectId() del usuario.
async function getUserObjectIdbyEmail(email){
    try{
        const user = await User.findOne({email:email})
        return user._id //es clave poner el _id por que si pongo solo id, me tira el string no el ObjectId
    }catch(err){
        //console.log("ha ocurrido el siguiente error en la funcion getUserObjectIdbyEmail.")
        //console.log(err)
        return null // si no lo encuentra tirar devuelve null.. no error.
    }
}
//esta funcion devuelve a todo el User, por su ID 
async function getUserByObjectId(ObjectId){
    try{
        const user = await User.findOne({_id:ObjectId})
        return user 
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getUserByObjectId.")
        console.log(err)
    }
}



//esta funcion me devuelve el usuario completo usando su mail (recordar que el mail es unico)
async function getUserbyEmail(email){
    try{
        const user = await User.findOne({email:email})
        return user //esta me devuelve todo el documento del usuario.
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getUserbyEmail.")
        console.log(err)
    }    
}
//getUserbyEmail("facu@gmail.com")

//esta funcion me devuelve el usuario completo usando su ID como string (que es lo q voy a almacenar en el localStorage)
async function getUserByStringId(stringId){
    try{
        const userObjectId = new ObjectId(stringId)
        const user = await User.findOne({_id:userObjectId})
        return user //esta me devuelve todo el documento del usuario.
    }catch(err){
        //aca pueden pasar varior errores, lo importante es q devuelva (null) cuando se le pasa algo que no es un StingId valido o existente.
        console.log("ha ocurrido el siguiente error en la funcion getUserbyEmail.")
        console.log(err)
        return null
    }    
}

//esta funcion me devuelve el nombre del usuario usando su ID como string (que es lo q voy a almacenar en el localStorage)
async function getUserNameByStringId(stringId){
    try{
        const userObjectId = new ObjectId(stringId)
        const user = await User.findOne({_id:userObjectId})
        return user.name //esta me devuelve todo el documento del usuario.
    }catch(err){
        //aca pueden pasar varior errores, lo importante es q devuelva (null) cuando se le pasa algo que no es un StingId valido o existente.
        console.log("ha ocurrido el siguiente error en la funcion getUserbyEmail.")
        console.log(err)
        return null
    }    
}


async function getUserNameByObjectId(ObjectId){
    try{
        const user = await User.findOne({_id:ObjectId})
        return user.name //esta me devuelve todo el documento del usuario.
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getUserbyEmail.")
        console.log(err)
    }    
}
//esta funcion me devuelve el Bill.concept segun el ObjectID de la Bill.
async function getBillByObjectId(ObjectId){
    try{
        const bill = await Bill.findOne({_id:ObjectId})
        return bill //esta me devuelve todo el documento del usuario.
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getUBillConceptByObjectId.")
        console.log(err)
    }    
}

//esta funcion me devuelve el Bill.concept segun el StringID de la Bill.
async function getBillByStringId(StringId){
    try{
        const billObjectId = new ObjectId(StringId)
        const bill = await Bill.findOne({_id:billObjectId})
        return bill //esta me devuelve todo el documento del usuario.
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getBillByStringId")
        console.log(err)
    }    
}



//esta funcion me devuelve un  array de bills,del usuario segun la pagina que este queriendo ver.
// en funcion del userID (el ID como string) y la pagina q solicito.
async function getBillsbyUserId(UserStringId,page = 0){
    try{
        const n = 7 //estos son las cuentas a mostrar, en cada pagina.
        const bills = []
        const userObjectId = new ObjectId(UserStringId)
        const user = await User.findOne({_id:userObjectId})
        //uso for.. of y NO array.forEach() por que el .forEach() NO espera que se resuelva la promesa y me devuelve  Bills=[]
        const billsToShow = user.bills.reverse().slice((page*n),(page*n+n))
        for (const billObjectId of billsToShow) {
            const bill = await getBillByObjectId(billObjectId);
            bills.push([bill.id, bill.concept])
          }
        console.log(bills)
        return bills //esta me devuelve todo el documento del usuario.
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getBillbyObjectId.")
        console.log(err)
        
    }  
}
//esta funcion devuelve la cantidad total de bills del usuario.
async function getTotalBillsbyUserId(UserStringId){
    try{
        const userObjectId = new ObjectId(UserStringId)
        const user = await User.findOne({_id:userObjectId})        
        return user.bills.length //esta me devuelve todo el documento del usuario.

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getBillbyObjectId.")
        console.log(err)
        
    }  
}


//obtener el creador del la Bill (osea el admins[0])
async function getCreatorObjectIdByBillObjectId(ObjectId){
    try{
        const bill = await Bill.findOne({_id:ObjectId})
        return bill.admins[0] //esta me devuelve todo el documento del usuario.

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getCreatorObjectIdByBillObjectId.")
        console.log(err)
    }
}

//aca valido si un userId(string) esta bill.participants.
//
async function validationUserInBill(userStringId,billStringId) {
    try{
        const billObjectId = new ObjectId(billStringId)
        const userObjectId = new ObjectId(userStringId)
        const bill = await Bill.findOne({_id:billObjectId})
        if(bill.participants.includes(userObjectId)){
            return true
        } else {
            return false
        }

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion validationUserInBill.")
        console.log(err)
    }
}

//aca valido si el estring cooresponde a un userId(string) o si es un string de un invitado, en todo caso devuelvo el user.name o el mismo string de invitado con un "nombre (Inv)""
//
async function validationRegisterUser(strUser) {
    try{
        const user = await getUserByStringId(strUser)
        
        if(user){
            return [user.name,user.id]
        } else {
            return strUser+" (Inv)"
        }

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion validationUserInBill.")
        console.log(err)
    }
}


//creo una funcion en la que intruciendo el stringid de una bill, me vuelve una lista de stringID de cada purchase de la bill.
async function getPurchasesStrIdInBill(stringIdBill) {
    try{
        const purchasesStringsId =[]
        const billObjectId = new ObjectId(stringIdBill)
        const bill = await Bill.findOne({_id:billObjectId})
        const purchases = bill.purchases
        purchases.forEach(p =>{
            purchasesStringsId.push(p.id)
        })
        return purchasesStringsId

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getPurchasesStrIdInBill")
        console.log(err)
    }
}

//creo una funcion en la que intruciendo el stringid de una bill, y el stringid de un purchase, me devuelve una lista de los participantes de ese purchase.
async function getParticipantsOfPurchase(stringIdBill,stringIdPurchase) {
    try{
        //const participants =[]
        const billObjectId = new ObjectId(stringIdBill)
        let participants = null
        const bill = await Bill.findOne({_id:billObjectId})
        for (const purchase in bill.purchases) {
            if (bill.purchases[purchase].id == stringIdPurchase) {
                participants = bill.purchases[purchase].participants
                return participants
            }
        }
        return participants

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getParticipantsOfPurchase")
        console.log(err)
    }
}

//creo una funcion en la que intruciendo el stringid de una bill, y el stringid de un purchase, me devuelve un objeto con el concept, el amount y el payer de la purchase.
async function getPurchaseInfo(stringIdBill,stringIdPurchase) {
    try{
        //const participants =[]
        const billObjectId = new ObjectId(stringIdBill)
        const data = {"concept": null, "amount":null,"payer":null}
        const bill = await Bill.findOne({_id:billObjectId})
        for (const purchase in bill.purchases) {
            if (bill.purchases[purchase].id == stringIdPurchase) {
                data.concept = bill.purchases[purchase].concept
                data.amount = bill.purchases[purchase].amount
                data.payer = bill.purchases[purchase].payer
                
                return data
            }
        }
        return participants

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion getParticipantsOfPurchase")
        console.log(err)
    }
}










module.exports = {
    getUserByObjectId,
    getUserObjectIdbyEmail,
    getUserNameByObjectId,
    getUserbyEmail,
    getBillsbyUserId,
    getCreatorObjectIdByBillObjectId,
    getBillByObjectId,
    validationUserInBill,
    getBillByStringId,
    getUserByStringId,
    validationRegisterUser,
    getTotalBillsbyUserId,
    checkUserExistenceByEmail,
    getPurchasesStrIdInBill,
    getPurchaseInfo,
    getParticipantsOfPurchase,
    getUserNameByStringId
}

// async function main(){
//     const a = await getPurchaseInfo("6411146b768422404be13ee0","6424960f526a473a62ee609a")
//     console.log("aca va a: ",a)
//     if(a){
//         console.log("usuario valido")
//     }else {
//         console.log("invitado")
//     }
// }

// main()