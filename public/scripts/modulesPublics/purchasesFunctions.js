function saludarPF(){
    console.log("hola desde modulesPublic/purchasesFunctions.js")
}


//esta funcion me agrega un nombre en el header.
function addNameToHeader(alias,id){
    const div = document.createElement('div')
    div.id = `headAlias-${id}`
    div.innerText = alias
    pAP.appendChild(div)
}

//esta funcion me agrega los cuadraditos en el header(por defecto tickeados)
function addSquareToHeader(id){
    const div = document.createElement('div')
    div.id = `headName-${id}`
    div.classList.add('genericTick','square', 'activate')
    div.innerHTML='<i class="fa fa-check"></i>'
    div.addEventListener('click',()=>{
        div.classList.toggle('activate')
        inputsValidation()
    })
    gTC.appendChild(div)
}

//esta funcion agrega las opciones del menu desplegable "Person Who Pay"(pWP)
function addParticipantTopWP(name,id){
    const option = document.createElement('option')
    //option.id = `option-${id}`
    option.value = `${id}`
    option.innerText = name
    pWPoptions.appendChild(option)
}

//esta funcion recibe un numero y lo convierte en centavos, se va a trabajar con centavos para evitar errores de redondeo y antes de mostrar todo se pasa a 
function convertToCents(priceString){
    const price = parseFloat(priceString)
    
    return parseInt(price.toFixed(2)*100)
}
//esta funcion resetea los inputs.
function resetInputs(){
    concept.value = ''
    amount.value = ''
    pWPoptions.value = ''
    ticksGenericos = document.querySelectorAll('.genericTick')
    ticksGenericos.forEach(tick => {tick.classList.add('activate')})
    inputsValidation()
}



//defino la funcion que me habilita/deshabilita el boton submit de un 

function inputsValidation(){
    if ((concept.value !== '' ) && (verifyFloatable(amount.value)) &&(amount.value !=='')&& (pWPoptions.value !=='')){
        let bandera = false
        ticksGenericos = document.querySelectorAll('.genericTick')
        ticksGenericos.forEach(tick => {
            if(tick.classList.contains('activate')){
                bandera = true //si bandera es true, es que al menos hay un tick activo (osea el gasto esta asignado a alguien)
            }
        })
        if(bandera){
            btnAddPurchase.classList.remove('inactive')
            btnAddPurchase.disabled = false 
        } else {
            btnAddPurchase.classList.add('inactive')
            btnAddPurchase.disabled = true
        }

    }else {
        btnAddPurchase.classList.add('inactive')
        btnAddPurchase.disabled = true
    }
}

async function deletePurchase(billStringId,purchaseStringId){
    try{
        const url = 'http://localhost:3000/delete-purchase-from-bill'
        await fetch(url,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"accessToken":token,'billStringId':billStringId,'purchaseStringId':purchaseStringId})
        })

    }catch(err){
        console.log("error en la funcion deletePurchase()")
        console.log(err)
    }
    console.log(`estas bien.. eliminando ${purchaseStringId}`)
}

//aca va la funcion de editar los gastos.
function editPurchase(billStringId,purchaseStringId){
    alert(`Sorry!\nThis funcionality is not avaible yet.\nBut you are trying to edit the purchase with id=${purchaseStringId}, in the bill with id=${billStringId}`)
    
}

//esta funcion busca en el array usersArray el string y devuelve el name correspondiente

function findUserName(stringId,usersArray){

    for(index in usersArray){
        if(usersArray[index][1] == stringId){
            return usersArray[index][0]
        }
    }
    return null
}

//esta funcion crea los purchases para visualizarlos en el front
function createPurchaseRow(purchaseStringId,concept,amount,payer,allBillParticipants,purchaseParticipants){

    const divContainer = document.createElement('div')
    divContainer.classList.add("purchase","deletable")
    divContainer.id = `purchase-${purchaseStringId}`
    const divConcept = document.createElement('div')
    divConcept.id = `pConcept-${purchaseStringId}`
    divConcept.classList.add('purchase-concept')
    divConcept.innerText = concept
    divContainer.appendChild(divConcept)

    const divAmount = document.createElement('div')
    divAmount.id = `pAmount-${purchaseStringId}`
    divAmount.classList.add('purchase-amount')
    divAmount.innerText = amount
    divContainer.appendChild(divAmount)

    const divPayer = document.createElement('div')
    divPayer.id = `pPayer-${purchaseStringId}`
    divPayer.classList.add('purchase-payer')
    divPayer.innerText = payer.charAt(0).toUpperCase() + payer.slice(1).toLowerCase()
    divContainer.appendChild(divPayer)

    const divTicksContainer = document.createElement('div')
    divTicksContainer.classList.add('purchase-afect-color')

    //creo los iconos de editar y eliminar con sus atributos y funciones.
    //contenedor de los iconos
    const divIcons = document.createElement('div')
    divIcons.classList.add('icons-container')
    //icono edit(pencil)
    const divEdit= document.createElement('div')
    divEdit.innerHTML = `<i class="fa-solid fa-pencil"></i>`
    divEdit.classList.add('edit-icon')
    divEdit.id = `edit-${purchaseStringId}`   
    divEdit.addEventListener('click',()=>{
        editPurchase(billStringId,purchaseStringId)
    })
    //icono trash
    const divTrash = document.createElement('div')
    divTrash.innerHTML = `<i class="fa-solid fa-trash"></i>`
    divTrash.classList.add('trash-icon')
    divTrash.id = `trash-${purchaseStringId}`
    divTrash.addEventListener('click',async ()=>{
       await deletePurchase(billStringId,purchaseStringId)
       document.getElementById(`purchase-${purchaseStringId}`).remove()
    })
    
    //agrego cada div donde corresponde.
    divIcons.appendChild(divEdit)
    divIcons.appendChild(divTrash)
    divContainer.appendChild(divIcons)


    allBillParticipants.forEach(participant => {
        
        const divParticipantSquare = document.createElement('div')
        divParticipantSquare.id = `tick-${participant[0]}`
        divParticipantSquare.innerHTML = '<i class="fa fa-check"></i>'
        divParticipantSquare.classList.add('square')
        if(purchaseParticipants.includes(participant[0])){
            divParticipantSquare.classList.add('activate')
        }
        
        divParticipantSquare.addEventListener('click',async() => {
    
            //hago el toggle en la base de datos.
            const res = await fetch("http://localhost:3000/toggle-participant-in-purchase",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"purchaseStringId":purchaseStringId,"participantStingId": `${participant[0]}`})
            })
            //cambio la visualizacion en la pagina (cuando inicie de nuevo deberia estar bien pq la primera vez levanta segun la )
            divParticipantSquare.classList.toggle('activate')
        })

        divTicksContainer.appendChild(divParticipantSquare)
        

    })
    divContainer.appendChild(divTicksContainer)
    purchaseContainer.appendChild(divContainer)
}




