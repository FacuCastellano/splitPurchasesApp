console.log("ejecutando update.js")
require('../connection')
const Bill = require('../models/Bill')
const User = require('../models/User')
const mongoose = require('mongoose')
//const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
//const { Schema, Types: { ObjectId } } = require('mongoose');
const {getUserObjectIdbyEmail} = require('./find.js')



//funcion para agregar el ObjectId de un nuevo participante (que SI esta registrado en la APP) a un Gasto (Bill)
async function addUserRegisteredToBill(billStringId,emailNewUser){

    try{

        //const billId = new ObjectId('6408f146af1cd25b725535d6')
        //const email = emailNewUser.toLowerCase()
        const userId = await getUserObjectIdbyEmail(emailNewUser)
        if(userId){
            const billObjectId = new ObjectId(billStringId)
            await Bill.updateOne({_id:billObjectId}, {$addToSet: {participants: userId}}) //el $addToSet es similar al push.. esto seria agregar al set participants el UserId (ojo!! en un set los elementos no se pueden duplicar)
            return true // si devuelve true es pq lo registro o pq ya existia. 
        } else {
            return false //si devuelve false es pq el mail del usuario no esta en la BD
        }

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addUserToBill.")
        console.log(err)
    }  

}
//funcion para agregar el ObjectId de un nuevo Gasto (Bill) en un User registrado, pero con el UserStringId(que es lo que obtengo automaticamente del token validado.).
async function addBillToUserRegiteredByStringId(billStringId,userStringId){
    
    try{
        //const billId = new ObjectId('6408f146af1cd25b725535d6')
        //const email = emailNewUser.toLowerCase()
        const userId = new ObjectId(userStringId)
        if(userId){
            const billObjectId = new ObjectId(billStringId)
            await User.updateOne({_id:userId}, {$addToSet: {bills: billObjectId}}) //el $addToSet es similar al $push.. esto seria agregar al set participants el UserId (ojo!! en un set los elementos no se pueden duplicar)
            //bien podria usar $push si necesito agregar elementos duplicados.-->  User.updateOne({_id:userId}, {$push: {bills: billId}})
            return true // si devuelve true es pq lo registro o pq ya existia. 
        } else {
            return false //si devuelve false es pq el mail del usuario no esta en la BD
        }
        

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addBillToUser.")
        console.log(err)
    }  
}


//funcion para agregar el ObjectId de un nuevo Gasto (Bill) en un User registrado, pero con el mail del usuario (el mail del usuario es lo que va a conocer el que este agregando gente.).
async function addBillToUserRegitered(billStringId,emailNewUser){
    
    try{
        //const billId = new ObjectId('6408f146af1cd25b725535d6')
        //const email = emailNewUser.toLowerCase()
        const userId = await getUserObjectIdbyEmail(emailNewUser)
        if(userId){
            const billObjectId = new ObjectId(billStringId)
            await User.updateOne({_id:userId}, {$addToSet: {bills: billObjectId}}) //el $addToSet es similar al $push.. esto seria agregar al set participants el UserId (ojo!! en un set los elementos no se pueden duplicar)
            //bien podria usar $push si necesito agregar elementos duplicados.-->  User.updateOne({_id:userId}, {$push: {bills: billId}})
            return true // si devuelve true es pq lo registro o pq ya existia. 
        } else {
            return false //si devuelve false es pq el mail del usuario no esta en la BD
        }
        

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addBillToUser.")
        console.log(err)
    }  
}


async function addBillToUserRegisteredAndViceversa(billStringId,emailNewUser){

    try{

        const email = emailNewUser.toLowerCase()
        const a = await addUserRegisteredToBill(billStringId,email)
        const b = await addBillToUserRegitered(billStringId,email)
        if (a === true && b === true){
            return true
        } else {
            return false
        }

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addBillToUserRegisteredAndViceversa.")
        console.log(err)
    }
}
//addBillToUserAndViceversa
//addBillToUserAndViceversa(new ObjectId('6408f146af1cd25b725535d6'),'ruben@gmail.com')

//esta funcion sirve para argregar un purchase a un bill,

purchase12 = {
        "concept":"asado",
        "amount":175263,
        "payer":"6410d3579f927194a5335203",
        "participants":["6410d3579f927194a5335203","6410d3579f927194a5335205","tose","gon"]
    }

console.log(JSON.stringify(purchase12))

async function addPurchaseToBill(strBillId,purchaseToAdd){
    try{
        const billId = new ObjectId(strBillId)
        const{concept,amount,payer,participants} = purchaseToAdd
        
        const purchase = {
            concept: concept,
            amount: amount,
            payer: payer,
            participants:participants
        }
        await Bill.updateOne({_id:billId}, {$addToSet: {purchases: purchase }})
        return true
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addBillToUser.")
        console.log(err)
        return false
    }  
}



module.exports = {
    addBillToUserRegisteredAndViceversa,
    addPurchaseToBill,
    addBillToUserRegiteredByStringId
}



// }

// const BillId1 = "6411146b768422404be13ee0"
// const NewUserMail = "magda@gmail.com"


 

// async function main2(billStringId,emailNewUser){
//     const a = await addBillToUserRegisteredAndViceversa(billStringId,emailNewUser)
//     console.log(a)
// }



// main2(BillId1,NewUserMail)




