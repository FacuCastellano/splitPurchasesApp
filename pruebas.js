console.log("hola mundo desde pruebas.js")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const {createUser,createBill} = require ('./src/DB/crud/create.js')
const {addBillToUserAndViceversa,createPurchase,addBillToUser} = require('./src/DB/crud/update.js')
const {getUserObjectIdbyEmail, getUserNameByObjectId,getUserbyEmail,getCreatorObjectIdByBillObjectId,getBillsbyUserId,validationUserInBill} = require('./src/DB/crud/find.js')
const {passVerify} = require('./src/functions/passwordFunctions')
const {generateAccessToken,tokenValidator} = require('./src/functions/tokenFunctions')
const jwt = require('jsonwebtoken')
const { minTransformDependencies } = require('mathjs')



const BillObjectId = new ObjectId("6409dfb529d40c1399d61933")

// getCreatorObjectIdByBillObjectId(BillObjectId)
//     .then(creatorObId => {console.log(creatorObId)})
//     .catch(e => console.log(e))


//createUser('facu2','facu2@gmail.com','pass1234')

//passVerify('facu123123@gmail.com','1234')


// passVerify('facu@gmail.com','pass1234')
//    .then(response => {console.log(response)})



// async function main() {
//     const token = await generateAccessToken('facu@gmail.com','pass1234')
//     console.log(token)
    
// }

// main()



// const tokenA = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybWFpbCI6ImZhY3VAZ21haWwuY29tIiwiU3ViSWQiOiI2NDBiMzBjZDBkNGRjMzhkNDU0ZDYxNTQiLCJleHAiOjE2Nzg0NzM2MzIsImlhdCI6MTY3ODQ3MzU3Mn0.nEFFMOhqWv5f_yyMNL60yV1Qc8wxvxV2rFk0Wnrnslo"

// async function main2(){ 
//     const respuesta = await tokenValidator(tokenA)   
// }
// main2()

// addBillToUser(new ObjectId("6411146b768422404be13ed6"),"facu@gmail.com")
// addBillToUser(new ObjectId("6411146b768422404be13ed8"),"facu@gmail.com")
// addBillToUser(new ObjectId("6411146b768422404be13edc"),"facu@gmail.com")
// addBillToUser(new ObjectId("6411146b768422404be13ede"),"facu@gmail.com")
// addBillToUser(new ObjectId("6411146b768422404be13ed3"),"facu@gmail.com")
// addBillToUser(new ObjectId("6411146b768422404be13ee0"),"facu@gmail.com")
// addBillToUser(new ObjectId("6411146b768422404be13eda"),"facu@gmail.com")
// async function main() {
//     const bills = await getBillsbyUserId("6410d3579f927194a5335203")
//     console.log(bills)
//     console.log(Object.getPrototypeOf(bills))
// }
// //main()



// async function main2() {
//     const stringId = "6411146b768422404be13ed6"
//     const billId = new ObjectId(stringId)
//     const concept = await getBillConceptByObjectId(billId)
//     console.log(concept)
    
// }
// //main2()


// async function main3() {
       
//     const userStringId = "6410d3579f927194a5335206"
//     const billStringId = '6411146b768422404be13ed6'
//     const check = await validationUserInBill(userStringId,billStringId)
//     console.log(check)
    
// }
// //main3()