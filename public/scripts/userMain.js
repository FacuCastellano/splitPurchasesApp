const backBtn =document.getElementById('back-button')
const token = localStorage.getItem('accessToken')
const varUserName = document.getElementById('varUserName')

//envio la peticion al servidor para obtener el nombre del usuario.
const url = 'http://localhost:3000/get-user-main-info'
fetch(url,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"accessToken":token})
})
.then(res=>res.json()) 
.then((data) => {
    //console.log("aca va la data\n",data)
    //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
    if(Object.keys(data).length === 0){
        //console.log("el token es un objeto vacio {}")
        location.href = './index.html'
    } else {
        localStorage.setItem('userID',data.stringID)
        varUserName.innerText= data.name
    }
})
.catch(error => {
    console.error('Error al recuperar el valor de CODE', error);
})


backBtn.addEventListener('click',()=>{
    location.href = './index.html'
})
