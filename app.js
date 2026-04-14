require('dotenv').config()

const express = require('express')
const path = require('node:path')
const app = express()
const indexRouter = require('./routes/indexRoutes')
const brandRouter = require('./routes/brandRoutes')
const demogRouter = require('./routes/demogRoutes')

const PORT = 3000
app.listen(PORT,(error)=>{
    if(error){
        throw error
    }
    console.log(`EXPRESS APP. LISTENING ON PORT: ${PORT}`);
})

const assetsPath = path.join(__dirname,'public')
app.use(express.static(assetsPath))
app.use(express.urlencoded({extended:true}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs')

app.use('/',indexRouter)
app.use('/brands',brandRouter)
app.use('/demographics',demogRouter)



