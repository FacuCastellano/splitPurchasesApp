const bcrypt = require('bcryptjs')
const {getUserbyEmail} = require('../DB/crud/find')

function createPassHash(pass){
    try{
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(pass, salt)
        return hash
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion createPassHash.")
        console.log(err)
    }
    
}

//pasao la nueva contraseña y el hash a comparar.. como el hash a comprar ya tiene el Salt, el metodo compareSync lo extrae de ahi y con la contraseña que le paso compara.. si la contraseña que pase, y el salt que extrae del hash, vuelve a general el hass el metodo devuelve true, sino devuelve false.
async function passVerify (usermail,pass){
    try{
        const user = await getUserbyEmail(usermail)

        if (bcrypt.compareSync(pass, user.password)) {
            return true
        } else {
            return false
        }
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion passVerify.")
        console.log(err)
    }
}      

module.exports = {
    createPassHash,
    passVerify
}