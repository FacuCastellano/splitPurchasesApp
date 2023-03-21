//funciones de validacion de login.
function verifyEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // cualquier cosa menos espacios y arroba.. una arroba cualquier cosa menos espacios y arroba, un punto.. cualquier cosa menos espacios y arroba.
    if (regex.test(email)) {
      return true
    } else {
      return false
    }
}


export function verifyEmailAndPassFilled(email,pass){
    console.log("hola desde verificacion de mail y pass")
    if(verifyEmail(email) && (pass !== null && pass !== '')){
        return true
    }else{
        console.log("entro al else de verifyEmailAndPassFilled")
        return false
    }
}


