const express = require('express')
const homeRoutes = require('./routes/home')
const loginRoutes = require('./routes/login')
const userRoutes = require('./routes/user')
const billRoutes = require('./routes/bill')

//creo el servidor
const app = express()

//settings
const PORT = 3000

//middlewares
app.use(express.json())
app.use('/public',express.static('./public')) // poner el prefijo = "/public", si pongo "./public" o "public" no anda.


//routerr
app.use(homeRoutes)
app.use(loginRoutes)
app.use(userRoutes)
app.use(billRoutes)
//archivos publicas

app.listen(PORT)