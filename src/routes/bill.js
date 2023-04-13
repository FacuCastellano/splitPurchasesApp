const {Router} = require('express')
const {tokenValidator} = require('../functions/tokenFunctions.js')
const {calculateTransfers} = require('../functions/severancePayFunctions.js')

const {validationUserInBill,getBillByStringId,validationRegisterUser,getPurchasesStrIdInBill,getParticipantsOfPurchase,getPurchaseInfo,getBalancesByBillStringId} = require('../DB/crud/find')
const {addBillToUserRegisteredAndViceversa,addPurchaseToBill,toggleParticipantInPurchase,makeBalance} = require('../DB/crud/update')
const {deleteBill,deleteParticipantFromBill} = require('../DB/crud/delete')
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
                const participantsAndMails = []
                
                //uso for.. of y NO array.forEach() por que el .forEach() NO espera que se resuelva la promesa y me devuelve  Bills=[]
                for (const userObjectId of bill.participants){
                    const participant = await validationRegisterUser(userObjectId)
                    participantsAndMails.push(participant)
                }
                const data = {
                    "billParticipantsAndMails":participantsAndMails,
                    "billParticipantsAlias":bill.alias
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
router.post("/add-user-registered-to-bill-participants", async (req,res)=>{
    try{
        const {accessToken,billStringId,emailUserToAdd,aliasUserToAdd} = await req.body
        if(accessToken && billStringId && emailUserToAdd && aliasUserToAdd){
            const validationResult = await tokenValidator(accessToken)
            if(validationResult){
                const userId = validationResult.SubId
                const checkValidation = await validationUserInBill(userId,billStringId)
                if(checkValidation){
                    const add = await addBillToUserRegisteredAndViceversa(billStringId,emailUserToAdd,aliasUserToAdd)
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
        }else {
            res.status(400)
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
        purchaseToAdd.amount = parseInt((parseFloat(purchaseToAdd.amount)*100).toFixed(2)) //toFix() devuelve un string --> por eso lo tengo que transformar a entero de nuevo.
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const add = await addPurchaseToBill(billStringId,purchaseToAdd)
                await makeBalance(billStringId)
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

//objtendo un array los Id de los purchases de la bill..
router.post("/get-purchases-stringid-in-bill", async (req,res)=>{
    try{
        const {accessToken,billStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const arrayPurchasesId = await getPurchasesStrIdInBill(billStringId)
                const data = {
                    "purchasesStringId":arrayPurchasesId
                }
                res.status(200)
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
//obtengo un array con los participants de un purchase especifico en una bill. tengo que pasa el stringId de la bill y el stringId del purchase.
router.post("/get-participants-on-particular-purchase", async (req,res)=>{
    try{
        const {accessToken,billStringId,purchaseStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const arrayParticipants = await getParticipantsOfPurchase(billStringId,purchaseStringId)
                const data = {
                    "purchaseParticipants":arrayParticipants
                }
                res.status(200)
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

//obtengo un objeto con el concept,amount y payer un purchase especifico en una bill. tengo que pasa el stringId de la bill y el stringId del purchase.
router.post("/get-purchase-basic-info", async (req,res)=>{
    try{
        const {accessToken,billStringId,purchaseStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const data = await getPurchaseInfo(billStringId,purchaseStringId)
                res.status(200)
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

//obtengo un objeto con el concept,amount y payer un purchase especifico en una bill. tengo que pasa el stringId de la bill y el stringId del purchase.
router.post("/toggle-participant-in-purchase", async (req,res)=>{
    try{
        const {accessToken,billStringId,purchaseStringId,participantStingId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
               await toggleParticipantInPurchase(billStringId,purchaseStringId,participantStingId)
                res.status(200)
                
            } else {
                res.send("the user how is trying to do this, is not in the bill")
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


//obtengo un objeto con el concept,amount y payer un purchase especifico en una bill. tengo que pasa el stringId de la bill y el stringId del purchase.
router.post("/get-bill-balances", async (req,res)=>{
    try{
        const {accessToken,billStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const data = await getBalancesByBillStringId(billStringId)
                res.status(200)
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


router.post("/get-bill-transfers", async (req,res)=>{
    try{
        const {accessToken,billStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                const balances = await getBalancesByBillStringId(billStringId)
                const transfers = calculateTransfers(balances)
                res.status(200)
                res.send(JSON.stringify(transfers))
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


router.delete("/delete-bill", async (req,res)=>{
    try{
        const {accessToken,billStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                await deleteBill(billStringId)
                res.status(200)
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

router.delete("/delete-participant-from-bill", async (req,res)=>{
    try{
        const {accessToken,billStringId,participantStringId} = await req.body
        const validationResult = await tokenValidator(accessToken)
        if(validationResult){
            const userId = validationResult.SubId
            const checkValidation = await validationUserInBill(userId,billStringId)
            if(checkValidation){
                await deleteParticipantFromBill(billStringId,participantStringId)
                res.status(200)
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

//{"concept": null, "amount":null,"payer":null}
//getPurchasesStrIdInBill()


//Ojo tengo que exportarlo asi, si le pongo --> module.exports = {router} me tira error no se pq, es decir no tengo que poner llaves.
module.exports = router
