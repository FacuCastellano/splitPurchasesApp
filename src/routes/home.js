const {Router} = require('express')
const router = Router()

router.get("/",(req,res)=>{
    res.redirect("/public/views/index.html")
})


//Ojo tengo que exportarlo asi, si le pongo --> module.exports = {router} me tira error no se pq, es decir no tengo que poner llaves.
module.exports = router
