saludarIV()
saludarPF()
console.log("hola desde purchases.js")
const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')

const backBtn = document.getElementById('back-button')
const pAP = document.getElementById('pAP')//el contenedor de los nombres en el encabezado de la tabla.
const gTC = document.getElementById('gTC') // el contenedor de los ticks genericos del encabezado
const concept = document.getElementById('inpPurc-concept')
const amount = document.getElementById('inpPurc-amount')
const pWPoptions = document.getElementById('pWPoptions')
const btnAddPurchase =document.getElementById('btn-add-purchase')
const genericTicks = document.getElementsByClassName('genericTick')
const purchaseContainer = document.getElementById('purchase-container')
const purchaseRowsContainer = document.getElementById('purchase-rows-container')

backBtn.addEventListener('click',()=>{
    location.href = './billMain.html'
})


//defino la funcion que me actualiza los nombres en el encabezado, en las opciones y los cuadraditos correspondientes.
function updateParticipantsHeader(){
    const url = 'http://localhost:3000/get-bill-participants'
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId})
    })
    .then(res=>res.json()) 
    .then(data => {
        //console.log("aca va la data\n",data)
        //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
        if(Object.keys(data).length === 0){
            //console.log("el token es un objeto vacio {}")
            location.href = './index.html'
        } else {
            pAP.innerHTML=''
            data.billParticipants.forEach(participant => {
                //estas funciones las importo de modulePublics/purchasesFunction.js
                addNameToHeader(participant[0],participant[1])
                addSquareToHeader(participant[1])
                addParticipantTopWP(participant[0],participant[1])
            })
        }
    })
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
}
//defino la funcion que me habilita/deshabilita el boton submit de un 
function inputsValidation(){
    if ((concept.value !== '' ) && (verifyFloatable(amount.value)) &&(amount.value !=='')&& (pWPoptions.value !=='')){
        btnAddPurchase.classList.remove('inactive')
        btnAddPurchase.disbled = false
    }else {
        btnAddPurchase.classList.add('inactive')
        btnAddPurchase.disbled = false
    }
}




// creo dos event listener
// el input detecta cuando se pone algo en los input de concept, y amount
document.body.addEventListener('input',()=>{
    inputsValidation()
})
//el change detecta el cambio de opcion del select. (person who pay)
document.body.addEventListener('change',()=>{
    inputsValidation()
})


//creo la funcion para agregar un purchase a una base de datos. 

function addPurchaseToDB(){

    const payer = pWPoptions.value
    const participants= [] //["6410d3579f927194a5335203","6410d3579f927194a5335205","tose","gon"]
    Array.from(genericTicks).forEach(tick => {
        if(tick.classList.contains("activate")){
            const idToAdd = tick.id.split("-")[1]
            participants.push(idToAdd)
        }
    })
    //
    const purchase ={
        "concept" : concept.value,
        "amount"  : amount.value,
        "payer" : payer,
        "participants" : participants
    }

    const url = 'http://localhost:3000/add-purchase-to-bill'
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"purchaseToAdd":purchase})
    })
    .then(res=>{
        if (res.status === 200){
            console.log("purchase cargado")
        } else{
            console.log("error en la carga del purchase.")
        }
    }) 
    
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
}

btnAddPurchase.addEventListener("click",()=>{
    addPurchaseToDB()
})

//esta funcion recibe el stringId como argumento, y visualiza el purchase, dandole algunas funcionalidades.
//6424960f526a473a62ee609a
async function showPurchase(purchaseStringId){
    console.log("hola desde show purchase ")
    console.log(billStringId)
    console.log(purchaseStringId)
    const res1 = await fetch("http://localhost:3000/get-purchase-basic-info",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"purchaseStringId":purchaseStringId})
    })
    const {concept,amount,payer} = await res1.json() // no entiendo muy bien por que necesito poner el await aca, pq en teoria con el anterior deberia esperar, pero bueno. si no lo devuelvo me da "pending"
    const res2 = await fetch('http://localhost:3000/get-bill-participants',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId})
    })
    const dataRes2 = await res2.json()
    const allBillParticipants = dataRes2.billParticipants //aca tengo todos los participantes de la bill con esto tengo que crear los cuadraditos.
    
    const res3 = await fetch('http://localhost:3000/get-participants-on-particular-purchase',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId,'purchaseStringId':purchaseStringId})
    })
    const dataRes3 = await res3.json()
    const purchaseParticipants = dataRes3.purchaseParticipants
    // console.log(concept,amount,payer)
    // console.log(allBillParticipants)
    // console.log(purchaseParticipants)
    createPurchaseRow(purchaseStringId,concept,amount,payer,allBillParticipants,purchaseParticipants)

}

function deletePurchasesView(){
    const previousPurchases = document.querySelectorAll(".deletable")
    
    previousPurchases.forEach(element =>{
        element.remove()
    })

}

async function showAllPurchases(){
    deletePurchasesView()
    const res = await fetch('http://localhost:3000/get-purchases-stringid-in-bill',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId})
    })
    const dataRes = await res.json()
    dataRes.purchasesStringId.forEach(purchaseId => showPurchase(purchaseId) )
    return null
}

//ejecuto todas las funciones.
updateParticipantsHeader()
inputsValidation()
showAllPurchases()





