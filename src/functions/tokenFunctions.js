require('dotenv').config()
const jwt = require('jsonwebtoken')
const {passVerify} = require('./passwordFunctions')
const {getUserbyEmail} = require('../DB/crud/find')


const secret = process.env.JWT_SECRET


async function generateAccessToken(usermail,pass){
    try{
        validation =  await passVerify(usermail,pass)
        ExpirationTimeInSeconds = 86400*365
        const expiration = new Date(new Date().getTime() + (ExpirationTimeInSeconds * 1000))

        if(validation){
            console.log("usuario validado, generando token...")
            const user = await getUserbyEmail(usermail)
            payload = {
                "usermail":usermail,
                "SubId":user.id,//al id lo estoy guardando como string.
                exp: Math.floor(expiration.getTime() / 1000)}
            const token = jwt.sign(payload, secret)
            return token
        } else {
            console.log("usuario no es correcto")
            return null
        }
    }catch(err){
        console.log("ha ocurrido el siguiente error en la funcion generateAccessToken.")
        console.log(err)
    }    
}

//analizar bien esta funcion y porque la otra no anda. 

async function tokenValidator(token) {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            //console.error('Error al verificar el token');
            console.log("te deberia devolver null")
            reject(err);
          } else {
            //console.log('Token verificado exitosamente');
            resolve(decoded);
          }
        });
      });
      return decoded;
    } catch (err) {
      console.log("ha ocurrido el siguiente un error en la funcion tokenValidator.")
      console.log(err)
      return err
    }
}



module.exports ={
    generateAccessToken,
    tokenValidator
}


