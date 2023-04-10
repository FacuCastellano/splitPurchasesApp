const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')
const severancePayContainer = document.getElementById('severance-pay-container')
const backBtn = document.getElementById('back-button')


const div1 = document.createElement('div')
div1.classList.add('head')
div1.innerHTML = '<h2> Severance Pay </h2>'

const div2 = document.createElement('div')
div2.classList.add('severance-pay-title')
div2.innerHTML = '<div>Debtor</div> <div>Amount</div> <div>Beneficiary</div>'
hr = document.createElement('hr')


backBtn.addEventListener('click',()=>{
    location.href = './billMain.html'

})

function showTransfers(transfersArray){
    severancePayContainer.innerHTML = ''
    severancePayContainer.appendChild(div1)
    severancePayContainer.appendChild(div2)
    severancePayContainer.appendChild(hr)

    for(i in transfersArray ){
        const transfer = transfersArray[i]
        const debtor = transfer[0][1].charAt(0).toUpperCase() + transfer[0][1].slice(1).toLowerCase()
        const creditor = transfer[2][1].charAt(0).toUpperCase() + transfer[2][1].slice(1).toLowerCase()
        const amount = (transfer[1]/100).toFixed(2)
        const divTransfer = document.createElement('div')
        divTransfer.classList.add('severance-pay-row')
        divTransfer.innerHTML =`<div>${debtor}</div> <div>${amount}</div> <div>${creditor}</div>`
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