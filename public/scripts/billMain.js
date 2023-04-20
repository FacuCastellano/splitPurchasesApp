const token = localStorage.getItem('accessToken')
const billStringId = localStorage.getItem('billStringId')
//const backBtn = document.getElementById('back-button')
const varBillTitle = document.getElementById('varBillTitle')
const homeBtn = document.getElementById('home-button')
const deleteBtn = document.getElementById('delete-button')
//creo la interaccion con el muenu desplegable.
const menuBtn = document.getElementById('menu-button')
const menu = document.getElementById('menu')
menuElementContainer= document.getElementById('menu-elements-container')
menuElementContainer.style.display = 'none'

menuBtn.addEventListener('click',()=>{
    menu.classList.remove('inactive')
    menuElementContainer.style.display = 'block'
})
menu.addEventListener('mouseleave',()=>{
    menu.classList.add('inactive')
    menuElementContainer.style.display = 'none'
})



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

function deleteBill() {

    const url = 'http://localhost:3000/delete-bill'
    fetch(url,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId})
    })
    .then(()=>{
        location.href = './myBills.html'
    }) 
    .catch(error => {
        console.error('Error en la funcion deleteBill()', error);
    })
}


function confirmDelete() {
    // Muestra un mensaje de confirmación
    const confirmMsg = "WARNING!\nIf you continue, the current bill will be deleted of all participants acount.\nIf you are nopt sure should click in 'Cancel'";
    const result = confirm(confirmMsg);
  
    // Si el usuario hizo clic en "Aceptar"
    if (result) {
        deleteBill();
    }
}

deleteBtn.addEventListener('click',()=>{
    confirmDelete()
})