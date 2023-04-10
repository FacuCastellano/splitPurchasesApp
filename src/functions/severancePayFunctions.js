// creo una funcion que me tire el mayor beneficiario de una array como "creditor"
function higherCreditor(array){
	let mayor = array[0] //supongo que el primer elemento es el mayor y despues si encuentro otro mayor lo reemplazo.
	for(let i=1; i<array.length; i++){
			if( array[i][1] > mayor[1]){
					mayor = array[i]
			}
	}
	return mayor
}

//creo una funcion que me busque el mayor deudor.. (el que tiene el balance mas negativo)
function higherDebtor(array){
	let menor = array[0] //supongo que el primer elemento es el menor (maximo debtor) y despues si encuentro otro mayor lo reemplazo.
	for(let i=1; i<array.length; i++){
			if( array[i][1] < menor[1]){
					menor = array[i]
			}
	}
	return menor
}

//creo una funcion que me borre el participante higherCreditor o higherDebtor del array "debtors" o "creditors"
function deletePerson(generalArray,personArray){
	const index = findIndex(generalArray,personArray)
	const newArray = generalArray.filter((_, idx) => idx != index);
	return newArray
}

//aca busco el indice que te gno q eliminar en la funcion deletePerson
function findIndex(generalArray,personArray){
	let idx = 0;
	for(let i = 0; i < generalArray.length;i++){
			if(personArray[0] === generalArray[i][0]){
					return idx
			}else {
					idx++
			}
	}
}

const balancesPrueba = {
	'642db8845aae3915ba3702e0': {
	  mustPay: 154881.6666666667,
	  payed: 132500,
	  balance: -22381.666666666686,
	  name: 'facu'
	},
	'642db8e15aae3915ba3702ef': {
	  mustPay: 207056.6666666667,
	  payed: 231200,
	  balance: 24143.333333333314,
	  name: 'male'
	},
	'642db8aa5aae3915ba3702e9': {
	  mustPay: 460786.6666666667,
	  payed: 453100,
	  balance: -7686.666666666686,
	  name: 'martin'
	},
	'642db8c15aae3915ba3702ec': {
	  mustPay: 240181.6666666667,
	  payed: 341200,
	  balance: 101018.33333333331,
	  name: 'euge'
	},
	'642ee97e04fa72677d6a9e30': {
	  mustPay: 240181.6666666667,
	  payed: 266845,
	  balance: 26663.333333333314,
	  name: 'ruben'
	},
	'64317de441891b318bcffac2': {
	  mustPay: 75516.66666666667,
	  payed: 0,
	  balance: -75516.66666666667,
	  name: 'magda'
	},
	'64317dfa41891b318bcffac5': { mustPay: 46240, payed: 0, balance: -46240, name: 'tose' }
  }

function calculateTransfers(balances){
// creo la funcion para que me calcule las trasnferencias. el orden es -->  [Deudor, Monto, Beneficiario]
	const participants = Object.keys(balances)
	let debtors = []
	let creditors = []
	const transfers = []

	for(let i in participants){
		const userStringId = participants[i]
		const userAlias = balances[userStringId].name
		const userBalance = balances[userStringId].balance
		if(userBalance > 0){
			creditors.push([userStringId,userAlias,userBalance])
		}else if (userBalance  < 0){
			debtors.push([userStringId,userAlias,userBalance])
		}	
	}
	console.log(creditors)
	console.log(debtors)
	//al while pongo > y no == por las dudas haya errores de redondeo, lo mismo que el  && en lugar del  ||
	while((debtors.length > 0 && creditors.length > 0)){
		
		const debtor = higherDebtor(debtors)
		const creditor = higherCreditor(creditors)
		
		if(Math.abs(debtor[2]) > creditor[2]){
			transfers.push([[debtor[0],debtor[1]],creditor[2],[creditor[0],creditor[1]]])
			indexDebtor = findIndex(debtors,debtor) //aca obtengo que indice ocupa este deudor en el array de deudores y le tengo que bajar la deuda pq ya se creo la transferencia
			debtors[indexDebtor][2] += creditor[2] 
			creditors = deletePerson(creditors,creditor) 
		}else if(Math.abs(debtor[2]) < creditor[2]){
			transfers.push([[debtor[0],debtor[1]],Math.abs(debtor[2]),[creditor[0],creditor[1]]]) //aca le transfiero todo la deuda del deudor al creditor
			indexCreditor = findIndex(creditors,creditor)//tengo que reducir el credito, pq no lo cancele pero si lo reduje.
			creditors[indexCreditor][2] += debtor[2] //la deuda debtor[1] tiene signo negativo, por lo que hay q sumarlo para reducirla-
			debtors = deletePerson(debtors,debtor) // como se le cancelo el credito lo borro de los creditores
		} else { //esto deberia darse al ultimo y es cuando quedan los ultimos 2. un deudor que le debe solo a un creditor.. por lo que trasnfiero y los borro a ambos. 
				
				transfers.push([[debtor[0],debtor[1]],creditor[2],[creditor[0],creditor[1]]])
				debtors = deletePerson(debtors,debtor)
				creditors = deletePerson(creditors,creditor) 
		}
	}
	return transfers
}


module.exports = {
	calculateTransfers
}