const {Router} = require('express')
const {tokenValidator} = require('../functions/tokenFunctions.js')
const {validationUserInBill,getBillByStringId,validationRegisterUser} = require('../DB/crud/find')
const {addBillToUserRegisteredAndViceversa,addPurchaseToBill} = require('../DB/crud/update')
const User = require('../DB/models/User.js')
const router = Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

router.post("/get-bill-title", async (req,res)=>{
    try{
        const {accessToken,billStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const bill = await getBillByStringId(billStringId)
                const data = {
                    "billTitle":bill.concept
                }
                res.send(JSON.stringify(data))
            } else {
                res.send("the user is not in the bill")
            }

        }else{
            res.send("User not found")
        }
        res.end()
    } catch {
        res.send(null)
        res.end()
    } 
})

router.post("/get-bill-participants", async (req,res)=>{
    try{
        const {accessToken,billStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const bill = await getBillByStringId(billStringId)
                const participants = []
                
                //uso for.. of y NO array.forEach() por que el .forEach() NO espera que se resuelva la promesa y me devuelve  Bills=[]
                for (const userObjectId of bill.participants){
                    const participant = await validationRegisterUser(userObjectId)
                    participants.push(participant)
                }
                const data = {
                    "billParticipants":participants
                }
                res.send(JSON.stringify(data))
            } else {
                res.send("the user is not in the bill")
            }

        }else{
            res.send("User not found")
        }
        res.end()
    } catch {
        res.send(null)
        res.end()
    } 
})




// agrego nuevos participantes a la bill y agrego la bill en cada participante.
router.post("/add-user-regitered-to-bill-participants", async (req,res)=>{
    try{
        const {accessToken,billStringId,emailUserToAdd} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const add = await addBillToUserRegisteredAndViceversa(billStringId,emailUserToAdd)
                if(add){
                    console.log("The user with the email: ",emailUserToAdd," was added to this bill.")
                    res.status(200)

                } else {
                    console.log("Error!\nThe user with the email: ",emailUserToAdd," was not added to this bill.")
                    res.status(500)
                }
                
            } else {
                res.send("the user is not in the bill")
            }

        }else{
            res.send("User not found")
        }
        res.end()
    
    } catch {
        res.send(null)
        res.end()
    } 
})

// agrego un nuevo purchase a la Bill.
router.post("/add-purchase-to-bill", async (req,res)=>{
    try{
        const {accessToken,billStringId,purchaseToAdd} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const add = await addPurchaseToBill(billStringId,purchaseToAdd)
                if(add){
                    res.status(200)
                }else{
                    res.status(500)
                }
            } else {
                res.send("the user is not in the bill")
            }
            
        }else{
            res.send("User not found")
        }
        res.end()
    
    } catch {
        res.send(null)
        res.end()
    } 
})



//Ojo tengo que exportarlo asi, si le pongo --> module.exports = {router} me tira error no se pq, es decir no tengo que poner llaves.
module.exports = router
