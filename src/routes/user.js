const {Router} = require('express')
const {tokenValidator} = require('../functions/tokenFunctions.js')
const {getUserNameByObjectId,getBillsbyUserId,getTotalBillsbyUserId} = require('../DB/crud/find')
const {createBill} = require('../DB/crud/create')
const User = require('../DB/models/User.js')
const router = Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId




router.get("/user-main",(req,res)=>{
    res.send("hola desde homeRouter")
})


router.post("/get-user-main-info", async (req,res)=>{
    const {accessToken} = await req.body
    const validationResult = await tokenValidator(accessToken)
    if(validationResult){
        const userID = validationResult.SubId
        const name = await getUserNameByObjectId(userID)
        const data = {
            "stringID":userID,
            "name":name
        }
        res.send(JSON.stringify(data))
    }else{
        res.send("User not found")
    }
    res.end()
})
//esta ruta me devuelve la cantidad total del bills del usuario (para obtener las paginas totales)
router.post("/get-user-total-bills", async (req,res)=>{
    const {accessToken} = await req.body
    const validationResult = await tokenValidator(accessToken)
    if(validationResult){
        const userID = validationResult.SubId
        const bills = await getTotalBillsbyUserId(userID)
        const data = {"totalBills":bills}
        res.send(JSON.stringify(data))
    }else{
        res.send("User not found")
    }
    res.end()
})

//esta ruta me devuelve las bills del usuario (segun la pagina que este visitando)
router.post("/get-user-bills", async (req,res)=>{
    const {accessToken,page} = await req.body
    const validationResult = await tokenValidator(accessToken)
    if(validationResult){
        const userID = validationResult.SubId
        const bills = await getBillsbyUserId(userID,page)
        const data = {"bills":bills}
        res.send(JSON.stringify(data))
    }else{
        res.send("User not found")
    }
    res.end()
})

//creo la ruta para crear bills.
router.post("/create-new-bill", async (req,res)=>{
    const {accessToken,billTitle} = await req.body
    const validationResult = await tokenValidator(accessToken)
    if(validationResult){
        const userStringId = validationResult.SubId
        const newBill = await createBill(billTitle,userStringId)
        if(newBill){
            res.status(200)
            res.send('Ok')
        }
    }else{
        res.send("User not found")
    }
    res.end()
})


//Ojo tengo que exportarlo asi, si le pongo --> module.exports = {router} me tira error no se pq, es decir no tengo que poner llaves.
module.exports = router
