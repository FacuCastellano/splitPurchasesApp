const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')
const severancePayContainer = document.getElementById('trasnfer-container')



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
//creo la interaccion con el boton home
const homeBtn = document.getElementById('home-button')
homeBtn.addEventListener('click',()=>{
    location.href = './myBills.html'
})


function showTransfers(transfersArray){
    severancePayContainer.innerHTML = ''

    for(i in transfersArray ){
        const transfer = transfersArray[i]
        const debtor = transfer[0][1].charAt(0).toUpperCase() + transfer[0][1].slice(1).toLowerCase()
        const creditor = transfer[2][1].charAt(0).toUpperCase() + transfer[2][1].slice(1).toLowerCase()
        const amount = (transfer[1]/100).toFixed(2)
        const divTransfer = document.createElement('div')
        divTransfer.classList.add('severance-pay-row')
        divTransfer.innerHTML =`<div>${debtor}</div> <div>${amount}</div> <div>${creditor}</div> <div class="divIcon"><i class="fa-solid fa-money-bill-transfer transfer-icon"></i></div>`
        severancePayContainer.appendChild(divTransfer)
    }
}



function getTransfers(){
    const url = 'http://localhost:3000/get-bill-transfers'
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId})
    })
    .then(res=>res.json()) 
    .then(transfers => {
        showTransfers(transfers)
    })
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
}

getTransfers()