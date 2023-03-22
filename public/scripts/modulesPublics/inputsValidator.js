function saludarIV(){
  console.log("hola desde modulesPublic/inputsValidator.js")
}

function verifyEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // cualquier cosa menos espacios y arroba.. una arroba cualquier cosa menos espacios y arroba, un punto.. cualquier cosa menos espacios y arroba.
    if (regex.test(email)) {
      return true
    } else {
      return false
    }
}

function verifyEmailAndPassFilled(email,pass){
    console.log("hola desde verificacion de mail y pass")
    if(verifyEmail(email) && (pass !== null && pass !== '')){
        return true
    }else{
        console.log("entro al else de verifyEmailAndPassFilled")
        return false
    }
}

//funcion para verificar que solo se hayan escrito letras y espacios.
function verifyLetters(name){
  const regex = /^[A-Za-z ñÑ]+$/ // solo letras o espacio en blanco.
  if(regex.test(name)){
      return true
  } else{
      return false
  }
}


//funcion para verificar que el argumento (del tipo string) se pueda convertir a float.
function verifyFloatable(testNumber){
  const regex = /^[0-9]*\.?[0-9]*$/
  if(regex.test(testNumber)){
      return true
  } else{
      return false
  }
}

//funcion para corroborar que 2 string son iguales
function stringEquality(str1,str2){
  if (str1 === str2){
      return true
  }else {
      return false
  }
}
