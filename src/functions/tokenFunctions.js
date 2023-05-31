require('dotenv').config() //esta linea lee el archivo .env y por ende puedo usar las variables que defini en dicho archivo.
const jwt = require('jsonwebtoken')
const {passVerify} = require('./passwordFunctions')
const {getUserbyEmail} = require('../DB/crud/find')

//const secret = process.env.JWT_SECRET

//no se pq no me lo lee del .env
const secret = "kFasFd/srS+q*a+sSf+-3*4+1-235AScadwq*-sgfuer+sSf+-3*4+1-2+sSf+-3*4+1-2+sSf+-3*4+1-2+sSf+-3*12348927dasadousadfhdsajksdfhi34yr9w0yf34serry8q4trewaf34-*56/456-*/5t*-y/rt-*h/4-*7h/-*/64*-h/rt*-h/47*-h/rtd*-gth/ert*-uy/e56*-y/gh*-e56/y*-rte/h*-456/7*-4/yhr*-dtjh/45*-7/4-*th/4*-65/345*-t/er*-hgy/435*-6/45*-gh/45*-6/+1-2i/*-3f+a4v+sdDas"



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
            //console.log("te deberia devolver null")
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


