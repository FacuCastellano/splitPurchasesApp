console.log("hola desde register.js")
const name = document.getElementById("name")
const email1 = document.getElementById("email-1")
const email2 = document.getElementById("email-2")
const password1 = document.getElementById("password-1")
const password2 = document.getElementById("password-2")

const submitBtn = document.getElementById("btn-submit")

const colorNeutral = "rgb(255,255,255)"
const colorGood = "rgb(177,224,191)"
const colorWrong = "tomato"

const warning0 = document.getElementById("warning-0")
const warning1 = document.getElementById("warning-1")
const warning2 = document.getElementById("warning-2")
const warning3 = document.getElementById("warning-3")
const warning4 = document.getElementById("warning-4")

let flag0
let flag1
let flag2
let flag3
let flag4


//creo las funciones que voy a usar.

//funcion para verificar que solo se hayan escrito letras y espacios.
function verifyLetters(name){
    const regex = /^[A-Za-z ñÑ]+$/ // solo letras o espacio en blanco.
    
    if(regex.test(name)){
        return true
    } else{
        return false
    }
}


//funcion para verificar que un mail sea valido 
function verifyEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // cualquier cosa menos espacios y arroba.. una arroba cualquier cosa menos espacios y arroba, un punto.. cualquier cosa menos espacios y arroba.
    
    if (regex.test(email)) {
      return true
    } else {
      return false
    }
}

//funcion para corroborar si el email ya esta registrado.
function emailAvailability(email){
    //si esta funcion devuelve 200 es pq el usuario no exisite y lo podemos crear, si devuelve 401 es pq el usuario ya existe y por ende no lo podemos crear.
    return  fetch("http://localhost:3000/check-email-existence",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"email":email})
        })
        .then(res => {
            return res.status
        })
        .catch(e => console.log(e))
}

//funcion para corroborar que 2 string son iguales
function stringEquality(str1,str2){
    if (str1 === str2){
        return true
    }else {
        return false
    }
}

//checkeo que se todos los datos sean correctos para ver si puedo enviar el form o no.
function checkInfo(){
    if((flag0 === true) && (flag1 === true) && (flag2 === true) && (flag3 === true) && (flag4 === true)){
        submitBtn.classList.remove("disabled")
        submitBtn.disabled = false
    } else {
        submitBtn.classList.add("disabled")
        submitBtn.disabled = true
    }
}

// limpio todos los campos.
name.value = ''
email1.value = ''
email2.value = ''
password1.value = ''
password2.value = ''


// ahora voy a hacer las verificaciones. 

//verifico que en nombre sea un nombre.
name.addEventListener('input',()=>{
    if(verifyLetters(name.value)){
        warning0.hidden = true
        flag0 = true
        name.style.backgroundColor = colorGood
    }else{
        warning0.hidden = false
        flag0=false
        name.style.backgroundColor = colorWrong
    }
    
})

//verifico que el mail1 sea un mail y que este disponible. 
email1.addEventListener('blur',async ()=>{
    const email = email1.value
    //si el mail es valido me fijo si esta disponible.
    if(verifyEmail(email)){
        flag1 = true
        warning1.hidden = true
        const code = await emailAvailability(email)
        if(code === 401){ //si entro aca es pq el mail ya esta registrado
            warning2.hidden = false
            email1.style.backgroundColor = colorWrong
        }else if (code === 200){
            warning2.hidden = true
            flag2 = true
            email1.style.backgroundColor = colorGood
        }
    }else{ //si el mail no es valido muestro msj.
        warning2.hidden = true
        warning1.hidden = false
        flag1= false
        flag2= false
        email1.style.backgroundColor = colorWrong
    } 
})

//cuando modifico email1 elimino email2, para obligar a ponerlo de nuevo por ende disparar el 'blur' de email1
email1.addEventListener('input',()=>{
    email1.style.backgroundColor = colorNeutral
    if(email2.value != ''){
        email2.value = '' 
        email2.style.backgroundColor = colorNeutral
    }    
})



//verifico que mail2 y mail1 coincidan.
email2.addEventListener('input',()=>{
    if(stringEquality(email1.value,email2.value)){
        warning3.hidden = true
        flag3 = true
        email2.style.backgroundColor = colorGood
    }else{
        warning3.hidden = false
        flag3 = false
        email2.style.backgroundColor = colorWrong
    }
    
})

password1.addEventListener('input',()=>{

    if(password2.value != ''){
        password2.value = ''
        password2.style.backgroundColor = colorNeutral
    }
    
})

//verifico que los dos campos password se hayan completado con el mismo string.
password2.addEventListener('input',()=>{
    const pass1 = password1.value
    const pass2 = password2.value
    if(pass2 !== ''){
        if(stringEquality(pass1,pass2)){
            password2.style.backgroundColor = colorGood
            warning4.hidden = true
            flag4 = true
        }else{
            password2.style.backgroundColor = colorWrong
            warning4.hidden = false
            flag4 = false
        }
    }else{
        password2.style = `color: ${colorNeutral}`
        warning4.hidden = true
        flag4 = false
    }
    
})

//evaluo si todo esta bien 
document.body.addEventListener("input", ()=>{
    console.log("input en body")
    checkInfo()
})


//creo la funcion del boton submit
submitBtn.addEventListener('click',()=>{
    const nameUser= name.value
    const emailUser=email1.value
    const passwordUser = password1.value
    console.log({"name":nameUser,"email":emailUser,"password":passwordUser})
    
    fetch("http://localhost:3000/create-new-user",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"name":nameUser,"email":emailUser,"password":passwordUser})
        })
        .then(res => {
            if(res.status === 200){
                alert("The user was created successfully")
                location.href= './index.html'
            }
        })
        .catch(e => console.log(e))
})

