console.log("ejecutando update.js")
require('../connection')
const Bill = require('../models/Bill')
const User = require('../models/User')
const mongoose = require('mongoose')
//const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
//const { Schema, Types: { ObjectId } } = require('mongoose');
const {getUserObjectIdbyEmail,getUserbyEmail} = require('./find.js')



//funcion para agregar el ObjectId de un nuevo participante (que SI esta registrado en la APP) a un Gasto (Bill)
async function addUserRegisteredToBill(billStringId,emailNewUser){

    try{

        //const billId = new ObjectId('6408f146af1cd25b725535d6')
        //const email = emailNewUser.toLowerCase()
        const user = await getUserbyEmail(emailNewUser)
        const userObjectId = user._id
        const userStringId = user.id
        console.log(userStringId )
        if(user){

            const billObjectId = new ObjectId(billStringId)
            await Bill.updateOne({_id:billObjectId}, {$addToSet: {participants: userObjectId }}) //el $addToSet es similar al push.. esto seria agregar al set participants el UserId (ojo!! en un set los elementos no se pueden duplicar)
            await addParticipantToBalances(billObjectId ,userStringId)
            return true // si devuelve true es pq lo registro o pq ya existia. 
        } else {
            return false //si devuelve false es pq el mail del usuario no esta en la BD
        }

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addUserToBill.")
        console.log(err)
    }  

}

//funcion para agregar como participante a un usuario invitado  (que NO esta registrado en la APP) a un Gasto (Bill)
async function addUserInvitedToBill(billStringId,nameUserInvited){

    try{

        const billObjectId = new ObjectId(billStringId)
        await Bill.updateOne({_id:billObjectId}, {$addToSet: {participants: nameUserInvited}}) //el $addToSet es similar al push..
        await addParticipantToBalances(billObjectId,nameUserInvited)
        return true // si devuelve true es pq lo registro o pq ya existia. 
    

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion addUserInvitedToBill.")
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

// purchase12 = {
//         "concept":"asado",
//         "amount":175263,
//         "payer":"6410d3579f927194a5335203",
//         "participants":["6410d3579f927194a5335203","6410d3579f927194a5335205","tose","gon"]
// }

//console.log(JSON.stringify(purchase12))

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
//esta funcion es un toggle del participante, es decir si existe lo elimina y si no existe lo agrega.
async function toggleParticipantInPurchase(strBillId,strPurchaseId,strParticipantId){
    try{
        
        const billObjectId = new ObjectId(strBillId)
        const purchaseObjectId = new ObjectId(strPurchaseId)

        let newParticipants = null

        const bill = await Bill.findOne({"_id":billObjectId})

        for(index in bill.purchases){      
            if(bill.purchases[index].id === strPurchaseId){
                let participants = bill.purchases[index].participants
                // console.log("1) participants: ")
                // console.log(participants)
            
                // console.log(" valor condicion: ")
                // console.log(participants.includes(strParticipantId))

                if(participants.includes(strParticipantId)){
                    //el participante si esta --> lo elimino
                    newParticipants = participants.filter(personId =>  personId != strParticipantId)
                } else {
                    //el participante no esta --> lo creo
                    newParticipants = [...participants, strParticipantId]
                }

                await Bill.updateOne(
                    {"_id":billObjectId,"purchases._id":purchaseObjectId}  //busco el documento con el billObject, dentro de este busco el atributo purchase, cuyo_id sea puchases objectID
                    ,
                    {
                        $set:{
                            
                            "purchases.$.participants":newParticipants //el $ es para meterme dentro "purchases", no se pq no es un solo (.) pero bueno
                        }
                    }
                )
                makeBalance(strBillId)
                return true
            } 
        }
        return false   
        
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion toggleParticipantInPurchase")
        console.log(err)
    }
}

// async function main(){
//     //await toggleParticipantInPurchase('6411146b768422404be13ee0','6424976e526a473a62ee60a1','6410d3579f927194a5335203')
//     await toggleParticipantInPurchase('6411146b768422404be13ee0','6424976e526a473a62ee60a1','pedrito')
// } 

async function addParticipantToBalances(billObjectId, participantStrId) {
    //const billObjectId = new ObjectId(strBillId)

    await Bill.updateOne(
      { _id: billObjectId },
      {
        $set: {
          [`balances.${participantStrId}`]: { mustPay: 0, payed: 0, balance: 0 }, // tengo que usar "$set" y seteo un nuevo atributo (como plus me da que no puedo agregar dos participantes iguales, pq la segunda vez reemplaza, y por ende elimina la primera.), ($push es para arrays, no para objetos.), con claves los [] en la definicion de la key
        },
      },
      { upsert: false }
    );
}

//esta funcion hace el balance
async function makeBalance(strBillId){
    try{
        
        const billObjectId = new ObjectId(strBillId)
        const bill = await Bill.findOne({"_id":billObjectId})
        const allPurchases = bill.purchases
        const n = allPurchases.length
        const balances = {}
        //seteo los balances en 0
        for(index in bill.participants){
            balances[bill.participants[index].toString()] = {'mustPay':0,'payed':0,'balance':0}
        }
        //en cada purchase voy sumando lo que le corresponde pagar a cada uno y asigno el amount al payer, cuando termine este ciclo for voy a tener el mustPay y el payed
        for (index in allPurchases){
            const purchase = allPurchases[index]
            const amount = purchase.amount
            const payer = purchase.payer
            const purchaseParticipants = purchase.participants
            
            if(amount > 0 && purchaseParticipants.length > 0){
                const averageAmount = amount / purchaseParticipants.length
                
                
                balances[payer]['payed'] += amount
                for(partIndex in purchaseParticipants){
                    const participant = purchaseParticipants[partIndex]
                    balances[participant]['mustPay'] += averageAmount //asd
                }


            }else{
                //aca deberia arreglar mejor esto
                console.log(`${purchase.concept} no se tuvo en cuenta por ser un amount no valido o por no estar asignado a ningun parcipante`)
            }
        }
        //en cada participante calculo el balance final. 
        for(index in bill.participants){
            balances[bill.participants[index]]['balance'] = balances[bill.participants[index]]['payed']-balances[bill.participants[index]]['mustPay']
        }
        //reemplazo el balance previo por el nuevo.
        await Bill.updateOne(
            { _id: billObjectId },
            {
              $set: {
                [`balances`]: balances, // tengo que usar "$set" y seteo un nuevo atributo (como plus me da que no puedo agregar dos participantes iguales, pq la segunda vez reemplaza, y por ende elimina la primera.), ($push es para arrays, no para objetos.), con claves los [] en la definicion de la key
              },
            },
            { upsert: false }
        )

        bill.save()

    }catch(err){
        
    } 

}





async function showBalances(strBillId){
    const billObjectId = new ObjectId(strBillId)
    const bill = await Bill.findOne({"_id":billObjectId})
    
    console.log(bill.balances)
}

module.exports = { 
    addBillToUserRegisteredAndViceversa,
    addPurchaseToBill,
    addBillToUserRegiteredByStringId,
    toggleParticipantInPurchase,
    addParticipantToBalances,
    makeBalance
}

async function main(){
   await makeBalance('642dbb629289377523383fac')
}

main()