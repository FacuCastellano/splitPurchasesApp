const partContainer = document.getElementById('partContainer')
const inputPartUser = document.getElementById('inputPartUser')
const btnAddPartUser = document.getElementById('btn-inputPartUser')
const backBtn = document.getElementById('back-button') 
const participantsContainer = document.getElementById('participants-container')
const billStringId = localStorage.getItem('billStringId')
const token = localStorage.getItem('accessToken')

backBtn.addEventListener('click',()=>{
    location.href = './billMain.html'
})


//genero una funcion para que me cree los elementos participants para mostrar.
function createDivParticipant(participantName){
    const div = document.createElement('div')
    div.classList.add("participant")
    div.innerHTML = `<i class="fas fa-times delete-icon"></i><span>${participantName}</span>`
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
            data.billParticipants.forEach(participant => {
                createDivParticipant(participant[0])
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
    const emailUserToAdd = inputPartUser.value
    
    const url = 'http://localhost:3000/add-user-regitered-to-bill-participants'

    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,'billStringId':billStringId,"emailUserToAdd":emailUserToAdd})
    })
    .then(res => {
        //console.log("aca va la data\n",data)
        //si el token expiro data = object{} (objeto vacio), por lo que la lista de keys sera de longitud 0, por ende uso esto para saber si el token expiro.
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
})


// defino una funcion para crear participantes que estan registrados, si no se encuentra registrado, muestra un alert y aclara que el usuario no esta registrado. 