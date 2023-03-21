const token = localStorage.getItem('accessToken')
const inputNewBIll = document.getElementById('inputBillTitle')
const btnCreate = document.getElementById('btn-inputBillTitle')
const backBtn = document.getElementById('back-button')


backBtn.addEventListener('click',()=>{
    location.href = './userMain.html'
})


btnCreate.addEventListener('click',async ()=>{
    const url = 'http://localhost:3000/create-new-bill'
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"accessToken":token,"billTitle":inputNewBIll.value}) 
    })
    .then(()=>{
        location.href = './myBills.html'
    }) 
    .catch(error => {
        console.error('Error intentar crear la nueva Bill', error);
    })
    
})
