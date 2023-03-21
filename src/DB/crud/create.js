console.log("ejecutando create.js")
require('../connection')
const Bill = require('../models/Bill')
const User = require('../models/User')
const mongoose = require('mongoose')
//const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
//const { Schema, Types: { ObjectId } } = require('mongoose');
const {getUserObjectIdbyEmail,getUserByStringId} = require('./find.js')
const {addBillToUserRegiteredByStringId} = require('./update')
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
async function createBill(billTitle,userStringId){
    try{
        const creatorId = new ObjectId(userStringId)
        
        const bill= new Bill({
            concept: billTitle.toLowerCase(),
            admins: [creatorId],
            participants: [creatorId]
        })
        await addBillToUserRegiteredByStringId(bill.id,userStringId)
        await bill.save()
        
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


