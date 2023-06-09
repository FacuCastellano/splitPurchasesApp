console.log("ejecutando create.js")
require('../connection')
const Bill = require('../models/Bill')
const User = require('../models/User')
const mongoose = require('mongoose')
//const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
//const { Schema, Types: { ObjectId } } = require('mongoose');
const {getUserObjectIdbyEmail,getUserByStringId} = require('./find.js')
const {addBillToUserRegiteredByStringId,addParticipantToBalances} = require('./update')
const {createPassHash} = require('../../functions/passwordFunctions')


//funcion para crear un nuevo usuario.
async function createUser(name,email,pass){
    try{
        const user= new User({
            name:name.toLowerCase(),
            email:email.toLowerCase(),
            password:createPassHash(pass)
        })
        await user.save()
        return true
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion createUser.")
        console.log(err)
        return null
    }
    

}

//funcion para crear un "bill" nuevo.  createBill(billTitle,userStringId)
async function createBill(billTitle,userStringId,userAlias){
    try{
        const creatorId = new ObjectId(userStringId)
        
        const bill= new Bill({
            
            concept: billTitle.trim().toLowerCase(),
            admins: [creatorId],
            participants: [creatorId]
        })
        bill.alias[userStringId] = userAlias
        await addBillToUserRegiteredByStringId(bill.id,userStringId) 
        await bill.save()
        //primero tengo que ejecutar bill.save(), por que sino addParticipantToBalances, no lo va a encontrar en la BD.
        await addParticipantToBalances(bill._id,userStringId)
        
        return true

    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion createBill.")
        console.log(err)

        return null
    }
}

module.exports = {
    createUser,
    createBill
}


// createUser("facu","facu@gmail.com","1234")
// createUser("euge","euge@gmail.com","1234")
// createUser("martin","martin@gmail.com","1234")
// createUser("male","male@gmail.com","1234")
// createUser("magda","magda@gmail.com","123456")
// createUser("ruben","ruben@gmail.com","123456")


