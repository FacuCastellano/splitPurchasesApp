const partContainer = document.getElementById('partContainer')
//elementos para el usuario registrado
const inputUserMail = document.getElementById('inputUserMail')
const inputUserAlias = document.getElementById('inputUserAlias')
const btnAddUserRegistered = document.getElementById('btn-addUserRegistered')
//elementos para el participante invitado
const inputInvitedAlias = document.getElementById('inputInvitedAlias')
const btnAddInvitedPart = document.getElementById('btn-addInvetedPart')

const backBtn = document.getElementById('back-button') 
const participantsContainer = document.getElementById('participants-container')
const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')


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

// creo la interaccion con los vontes del menu desplegable
const goBillMenuBtn = document.getElementById('bill-menu-button')
goBillMenuBtn.addEventListener('click',()=>{
    location.href = './billMain.html'
})
const goPurchasesBtn = document.getElementById('purchases-button')
goPurchasesBtn.addEventListener('click',()=>{
    location.href = './purchases.html'
})
const goBalancesBtn = document.getElementById('balances-button')
goBalancesBtn.addEventListener('click',()=>{
    location.href = './balances.html'
})
const goTransfersBtn = document.getElementById('transfers-button')
goTransfersBtn.addEventListener('click',()=>{
    location.href = './transfers.html'
})
const logoutBtn = document.getElementById('logout-button')
logoutBtn.addEventListener('click',()=>{
    location.href = './index.html'
})


//
function GetEmailById(userStringId, arrayUsersIdAndMail) {
    const newArrayWhitFindedUser = arrayUsersIdAndMail.filter(dato => dato[0] === userStringId);
    return newArrayWhitFindedUser.length ? newArrayWhitFindedUser[0][1] : null;
  }

async function  deleteParticipant(billStringId,participantStringId){

    const url = 'http://localhost:3000/delete-participant-from-bill'
    fetch(url,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId,'participantStringId':participantStringId})
    })
    .then(()=>{
        document.getElementById(`participant-${participantStringId}`).remove()
    }) 
    .catch(error => {
        console.error('Error en la funcion deleteBill()', error);
    })

    console.log("eliminar participante: ",participantStringId,'\nDe la cuenta: ',billStringId)
}


//genero una funcion para que me cree los elementos participants para mostrar.
function createDivParticipant(stringId,alias,email='Not user Registered'){
    const aliasShowed = alias.charAt(0).toUpperCase() + alias.slice(1).toLowerCase()
    const div = document.createElement('div')
    div.classList.add("participant")
    div.id = `participant-${stringId}`
    div.innerHTML = `
    <div>
        &nbsp;<span>${aliasShowed}</span>&nbsp;-&nbsp;<span class="mail-addres">${email}</span>
    </div>  `
    //icono trash
    const divTrash = document.createElement('div')
    divTrash.innerHTML = `<i class="fa-solid fa-trash"></i>`
    divTrash.classList.add('trash-icon')
    divTrash.id = `trash-${stringId}`
    divTrash.addEventListener('click',async ()=>{
       await deleteParticipant(billStringId,stringId)
       
    })
    div.appendChild(divTrash)
   
    
    participantsContainer.appendChild(div)
}


//defino la funcion que me muestra los nombres de los participantes de la bill.
function updateParticipantsView(){
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
            participantsContainer.innerHTML = ''  
            const ParticipantsId = Object.keys(data.billParticipantsAlias)
            ParticipantsId.forEach(participant =>{
               // const stringId = participant
                const alias = data.billParticipantsAlias[participant]
                const mail = GetEmailById(participant, data.billParticipantsAndMails) ? GetEmailById(participant, data.billParticipantsAndMails) : "Not user registered" 
                createDivParticipant(participant,alias,mail)
            })
        }
    })
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
}
//muestro los participantes que forman parte de la bill. 
updateParticipantsView()

// defino una funcion para crear participantes que estan registrados, si no se encuentra registrado, muestra un alert y aclara que el usuario no esta registrado. 
btnAddUserRegistered.addEventListener('click',()=>{
    const emailUserToAdd = inputUserMail.value.trim().toLowerCase()
    const aliasUserToAdd = inputUserAlias.value.trim().toLowerCase()
    
    if(emailUserToAdd && aliasUserToAdd){
        const url = 'http://localhost:3000/add-user-registered-to-bill-participants'
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"emailUserToAdd":emailUserToAdd,"aliasUserToAdd":aliasUserToAdd})
        })
        .then(res => res.json())
        .then(data =>{
            const err = data.userProblem
            if(err){
                if(err === 1){
                    alert(`The email: "${emailUserToAdd}" is not registered in this app.\nYou should verify the mail or add "${aliasUserToAdd}" directly as a not user registered.`)
                } else if (err == 2){
                    alert(`The email or alias, has already registered in this bill.`)
                }
            }
        })
        .then(()=>{
            updateParticipantsView()
        })
        .catch(error => {
            console.error('Error al recuperar el valor de CODE', error);
        })
        .finally(()=>{
            inputUserMail.value = ''
        })
    }else{
        alert('Both fields must be filled to create a user')
    }
    inputUserMail.value = ''
    inputUserAlias.value = ''

})
//borro por si toca f5
inputUserMail.value = ''
inputUserAlias.value = ''


btnAddInvitedPart.addEventListener('click',()=>{
    console.log('ejecuntando bien')
    const aliasInvitedToAdd = inputInvitedAlias.value.trim().toLowerCase()
    
    if(aliasInvitedToAdd){
        const url = 'http://localhost:3000/add-invited-to-bill-participants'
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"aliasInvitedToAdd":aliasInvitedToAdd})
        })
        .then(res => {
            //console.log("aca va la data\n",data)
            //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
            if(res.status === 401){
                //aca en teoria entro si el usuario (el mail) ya esta registrado o si el alias ya esta registrado.
                alert(`The alias:${aliasInvitedToAdd} has already registered in this bill`)
            }
           
        })
        .then(()=>{
            updateParticipantsView()
        })
        .catch(error => {
            console.error('Error al recuperar el valor de CODE', error);
        })

    }else{
        alert('You must fill the alias in the input before to send')
    }
    inputInvitedAlias.value = ''
})
//borro por si actualiza la pagina.
inputInvitedAlias.value = ''