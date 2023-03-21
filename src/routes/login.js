const express = require("express");
const {generateAccessToken,tokenValidator} = require('../functions/tokenFunctions.js')
const {checkUserExistenceByEmail} = require('../DB/crud/find')
const {createUser} = require('../DB/crud/create')
const router = express.Router() //ver bien este obejeto Router() de express
router.use(express.json()) //esto es clave! para poder leer los json en los body de los request.

router.post("/login",async (req,res)=>{
    const {email,password}= req.body
    const token = await generateAccessToken(email,password)
    res.send(JSON.stringify(token))
    console.log(token)
    
})

router.post('/check-email-existence',async (req,res)=>{
    const{email} = req.body
    const existence = await checkUserExistenceByEmail(email)
    if(existence){
        res.status(401)
    }else{
        res.status(200)
    }
    res.end()
})


router.post('/create-new-user',async (req,res)=>{
    const{name,email,password} = req.body
    const code = await createUser(name,email,password)
    if(code){
        res.status(200)
    }else{
        res.status(500)
    }
    res.end()
})

//Ojo tengo que exportarlo asi, si le pongo --> module.exports = {router} me tira error no se pq, es decir no tengo que poner llaves.
module.exports = router
