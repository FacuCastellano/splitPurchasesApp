const token = localStorage.getItem('accessToken')
const billStringId = localStorage.getItem('billStringId')
//const backBtn = document.getElementById('back-button')
const varBillTitle = document.getElementById('varBillTitle')
const homeBtn = document.getElementById('home-button')


//envio la peticion al servidor para obtener el nombre de la Bill.
const url = 'http://localhost:3000/get-bill-title'
fetch(url,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"accessToken":token,"billStringId":billStringId})
})
.then(res=>res.json()) 
.then((data) => {
    //console.log("aca va la data\n",data)
    //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
    console.log(data)
    if(Object.keys(data).length === 0){
        //console.log("el token es un objeto vacio {}")
        location.href = './index.html'
    } else {
        varBillTitle.innerText= data.billTitle
    }
})
.catch(error => {
    alert('Error al recuperar el valor de CODE en billMain.js')
    location.href = './index.html' 
})


// backBtn.addEventListener('click',()=>{
//     location.href = './myBills.html'
// })

homeBtn.addEventListener('click',()=>{
    location.href = './myBills.html'
})