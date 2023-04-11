console.log("hola mundo desde myBills.js")
const token = localStorage.getItem('accessToken')
let totalBills //va a ser numero con la cantidad de Bills del usuario.
let totalPages
let bills //esto va ser un array con los Id de los Bills, y los conceptos. 
const n = 5 //cantidad de escritos a mostrar por pagina.
let page = 0 //la primera pagina es la 0.
const ArrowL = document.getElementById('leftButton') 
const ArrowR = document.getElementById('rightButton')

const logoutBtn = document.getElementById('logout-button') 
const billContainer = document.getElementById('bills-container')
const divCreator = document.createElement('div')
divCreator.classList.add('bill', 'creator')
divCreator.id = 'create-button'
divCreator.innerHTML = `Create New + <i class="fa-light fa-note></i>`
divCreator.addEventListener('click',()=>{
    location.href = './createNewBill.html'
})

logoutBtn.addEventListener('click',()=>{
    location.href = './index.html'
})

//genero una funcion para que me cree los elementos bill para mostrar.
function createBill(bill){
    const div = document.createElement('div')
    div.classList.add("bill")
    div.id = bill[0]
    div.innerText = bill[1]
    div.addEventListener('click',()=>{
        localStorage.setItem('billStringId',div.id)
        location.href = './billMain.html'
    })
    billContainer.appendChild(div)
}

//creo una funcion, que me da de a 7 bills (por fecha descendente), esta funcion recibe la pagina a mostrar como argumento.
async function showBills(page){
    const url = 'http://localhost:3000/get-user-bills'
fetch(url,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"accessToken":token,"page":page})
})
.then(res=>res.json()) 
.then((data) => {
    //console.log("aca va la data\n",data)
    //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
    if(Object.keys(data).length === 0){
        //console.log("el token es un objeto vacio {}")
        location.href = './index.html'
    } else {
        billContainer.innerHTML ='' 
        billContainer.appendChild(divCreator)
        bills = data.bills
        bills.forEach(bill => {
            createBill(bill)
        });
        console.log(bills)
    }
})
.catch(error => {
    console.error('Error al recuperar el valor de CODE', error);
})
}
// creo una funcion para evaluar el estilo de las flechas 
function evaluateArrowsStyle(page,totalPages){
    if(page > 0){
        ArrowL.classList.remove('inactive')
    }else{
        ArrowL.classList.add('inactive')
    }

    if (page < totalPages){
        ArrowR.classList.remove('inactive')
    }else{
        ArrowR.classList.add('inactive')
    }

}


showBills(page) // en primera instancia siempre muestro la primera pagina (page = 0)

//creo una peticion para ver la cantidad total de bills del usuario(para calcular las paginas totales)

fetch("/get-user-total-bills",{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"accessToken":token})
})
.then(res=>res.json()) 
.then((data) => {
    totalBills = data.totalBills
    totalPages = Math.ceil(totalBills/n)-1
    evaluateArrowsStyle(page,totalPages)
})
.catch(error => {
    console.error('Error al recuperar el valor de CODE', error);
})

//creo las funciones de los flechas.
//Arrow Left
ArrowL.addEventListener('click',async ()=>{
    if(page > 0){
        page--
        await showBills(page)
        evaluateArrowsStyle(page,totalPages)
        console.log('page= ' +page+'; totalPages='+totalPages)
    }else{
        console.log("ArrowL, con page = 0.")
    }
})
//Arrow Right
ArrowR.addEventListener('click',async ()=>{
    if(page < totalPages){
        page++
        await showBills(page)
        evaluateArrowsStyle(page,totalPages)
        console.log('page= ' +page+'; totalPages='+totalPages)
    }else{
        console.log(`ArrowR, con page=${page} y totalPages=${totalPages}`)
    }
})
