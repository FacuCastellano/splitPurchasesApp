saludarIV()
saludarPF()
console.log("hola desde purchases.js")
const backBtn = document.getElementById('back-button')
const pAP = document.getElementById('pAP')//el contenedor de los nombres en el encabezado de la tabla.
const gTC = document.getElementById('gTC') // el contenedor de los ticks genericos del encabezado
const concept = document.getElementById('inpPurc-concept')
const amount = document.getElementById('inpPurc-amount')
const pWPoptions = document.getElementById('pWPoptions')
const btnAddPurchase =document.getElementById('btn-add-purchase')
const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')

backBtn.addEventListener('click',()=>{
    location.href = './billMain.html'
})


//defino la me actualiza los nombres en el encabezado, en las opciones y los cuadraditos correspondientes.
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

updateParticipantsHeader()
inputsValidation()

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
