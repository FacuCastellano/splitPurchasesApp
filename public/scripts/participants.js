const partContainer = document.getElementById('partContainer')
const inputPartUser = document.getElementById('inputPartUser')
const inputPartInvited = document.getElementById('inputPartInvited')
const btnAddPartUser = document.getElementById('btn-inputPartUser')
const backBtn = document.getElementById('back-button') 
const participantsContainer = document.getElementById('participants-container')
const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')

backBtn.addEventListener('click',()=>{
    location.href = './billMain.html'
})


//genero una funcion para que me cree los elementos participants para mostrar.
function createDivParticipant(participantAlias,participantMail='Not user Registered'){

    const div = document.createElement('div')
    div.classList.add("participant")
    div.innerHTML = `<i class="fas fa-times delete-icon"></i>&nbsp;<span>${participantAlias}</span>&nbsp;-&nbsp;<span class="mail-addres">${participantMail}</span>`
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
            const alias = data.billParticipantsAlias
            participantsContainer.innerHTML = ''  
            data.billParticipantsAndMails.forEach(participant => {
                const participantAlias = alias[participant[0]].charAt(0).toUpperCase() + alias[participant[0]].slice(1).toLowerCase()
                const participantMail = participant[1]
                createDivParticipant(participantAlias,participantMail)
            });
        }
    })
    .catch(error => {
        console.error('Error al recuperar el valor de CODE', error);
    })
}
//muestro los participantes que forman parte de la bill. 
updateParticipantsView()

btnAddPartUser.addEventListener('click',()=>{
    const emailUserToAdd = inputPartUser.value.trim().toLowerCase()
    const aliasUserToAdd = inputPartInvited.value.trim().toLowerCase()
    
    //const aliasUserToAdd = inputPartInvited.value.trim().charAt(0).toUpperCase()+ inputPartInvited.value.trim().slice(1).toLowerCase()
    
    if(emailUserToAdd && aliasUserToAdd){
        const url = 'http://localhost:3000/add-user-registered-to-bill-participants'
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"emailUserToAdd":emailUserToAdd,"aliasUserToAdd":aliasUserToAdd})
        })
        .then(res => {
            //console.log("aca va la data\n",data)
            //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
            if(res.status === 401){
                //aca en teoria entro si el usuario (el mail) ya esta registrado o si el alias ya esta registrado.
                alert(`The email or alias, has already registered in this bill`)
            }
            if(res.status === 500){
                //console.log("el token es un objeto vacio {}")
                alert(`Error!\nThe user with the email: ${emailUserToAdd}, was not added to the bill.\n It's probably that this mail is not registered in the app.`)
            }
        })
        .then(()=>{
            updateParticipantsView()
        })
        .catch(error => {
            console.error('Error al recuperar el valor de CODE', error);
        })
        .finally(()=>{
            inputPartUser.value = ''
        })
    }else{
        alert('Both fields must be filled to create a user')
    }
    inputPartUser.value = ''
    inputPartInvited.value = ''

})


// defino una funcion para crear participantes que estan registrados, si no se encuentra registrado, muestra un alert y aclara que el usuario no esta registrado. 