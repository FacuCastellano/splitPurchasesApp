console.log('si son balances.')
const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')
const backBtn = document.getElementById('back-button')
const balanceContainer = document.getElementById('personal-balance-container')
const div1 = document.createElement('div')
div1.classList.add('head')
div1.innerHTML='<h2> Personal Balance </h2>'
const div2 = document.createElement('div')
div2.classList.add('personal-balance-title')
div2.innerHTML='<div>Participant</div> <div>Must Pay</div> <div>Payed Done</div> <div>Balance</div>'
const hr = document.createElement('hr')

backBtn.addEventListener('click',()=>{
    location.href = './billMain.html'
})


function showParticipantBalance(participant){
    const nameParticipant = participant.alias.charAt(0).toUpperCase() + participant.alias.slice(1).toLowerCase()
    const mustPay = participant.mustPay/100
    const payed = participant.payed/100
    const balance = participant.balance/100

    const divParticipant = document.createElement('div')
    divParticipant.classList.add('personal-balance-participant')
    divParticipant.innerHTML = `<div>${nameParticipant}</div> <div>${mustPay.toFixed(2)}</div> <div>${payed.toFixed(2)}</div>` //recodar que toFixed(), devuelve el float redondeado pero como un string.
    const divPB = document.createElement('div') // divPB = PersonalBalance
    if(balance == 0){
        divPB.innerText = `Settle`
        divParticipant.style.backgroundColor = '#CCCCCC'
        divParticipant.style.color = 'rgb(40,40,40)'
    }else if(balance > 0 ){
        divPB.innerText = `Recover ${balance.toFixed(2)}`
        divParticipant.style.backgroundColor = 'rgb(196,215,183)'
    } else if (balance < 0){
        divPB.innerText = `Owe ${-balance.toFixed(2)}`
        divParticipant.style.backgroundColor = 'rgb(234,190,190)'
    }
    divParticipant.appendChild(divPB)
    balanceContainer.appendChild(divParticipant)

}

async function showBalances(){
    balanceContainer.innerHTML = ''
    balanceContainer.appendChild(div1)
    balanceContainer.appendChild(div2)
    balanceContainer.appendChild(hr)

}

showBalances()
// showParticipantBalance(facu)
// showParticipantBalance(mono)
// showParticipantBalance(tose)


function getBalances(){
    const url = 'http://localhost:3000/get-bill-balances'
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
            const participantsIds = Object.keys(data)
            for(index in participantsIds){
                showParticipantBalance(data[participantsIds[index]])
            }
        }
    })
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
}
getBalances()