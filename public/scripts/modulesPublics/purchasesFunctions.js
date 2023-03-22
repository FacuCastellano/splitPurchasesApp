function saludarPF(){
    console.log("hola desde modulesPublic/purchasesFunctions.js")
}


//esta funcion me agrega un nombre en el header.
function addNameToHeader(name,id){
    const div = document.createElement('div')
    div.id = `headName-${id}`
    div.innerText = name
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
    return price.toFixed(2)*100
}




