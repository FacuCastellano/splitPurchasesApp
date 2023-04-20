const token = localStorage.getItem('accessToken')
const inputNewBIll = document.getElementById('inputBillTitle')
const btnCreate = document.getElementById('btn-inputBillTitle')
const homeBtn = document.getElementById('home-button')
const inputAdminAlias = document.getElementById('inputAdminAlias')

homeBtn.addEventListener('click',()=>{
    location.href = './myBills.html'
})


btnCreate.addEventListener('click',async ()=>{
    const alias = inputAdminAlias.value.trim().toLowerCase()
    const billTitle = inputNewBIll.value.trim().toLowerCase()
    if(inputNewBIll.value && inputAdminAlias.value){
        const url = 'http://localhost:3000/create-new-bill'
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"accessToken":token,"billTitle":billTitle,"userAlias":alias}) 
        })
        .then(()=>{
            location.href = './myBills.html'
        }) 
        .catch(error => {
            console.error('Error intentar crear la nueva Bill', error);
        })
    }else{
        alert('both fields must be filled to create a new bill.')
    }
})
