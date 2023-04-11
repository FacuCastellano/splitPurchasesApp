const submitButton = document.getElementById('btn-submit')

/////////// creo las funciones que voy a usar en este script /////////////////////

function verifyEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // cualquier cosa menos espacios y arroba.. una arroba cualquier cosa menos espacios y arroba, un punto.. cualquier cosa menos espacios y arroba.
    if (regex.test(email)) {
      return true
    } else {
      return false
    }
}

function verifyEmailAndPassFilled(email,pass){

    if(verifyEmail(email) && (pass !== null && pass !== '' && pass !== undefined)){
        return true
    }else{
        return false
    }
}

///////////////////////////////////////////////////////////////////////////////////

submitButton.addEventListener('click',() => {
    //extraigo los datos que puso el usuario.
    const email = document.getElementById('email').value 
    const password = document.getElementById('password').value

    if(verifyEmailAndPassFilled(email,password)){

        //hago la peticion HTTP al login y le envio  el "email"(usuario) y "contraseña".
        const loginData = {"email":email, "password":password}

        const url = 'http://localhost:3000/login'

        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(res=>res.json()) //esta sentencia es clave pq pasa de un objeto response a un darte el valor del body de la response, por lo que en el proximo .then(), data es o null o un string (si es un string es el token.)
        .then((data) => {
            if(data){
                //console.log("Accesso Aprobado, el Token se ha enviado.")
                localStorage.setItem('accessToken',data)
                //sessionStorage.setItem('accessToken',data)
                location.href = './myBills.html'
            } else {
                //console.log("Accesso Denegado.")
                alert("User or Password incorrect! please try again!")
                password = '' //no entiendo pq no borra el password.
                localStorage.setItem('accessToken',data)
                //sessionStorage.setItem('accessToken',data)
                
            }
        })
        .catch(error => {
            console.error('Error al recuperar el valor de CODE', error);
        })

    }else{
        alert("Error! You must entry a valid email and a not empty password.")
    }
    
    
}) 