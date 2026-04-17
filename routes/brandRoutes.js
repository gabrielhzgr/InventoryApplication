const express = require('express')
const brandRouter = express.Router()
const brandControllers = require('../controllers/brandControllers')

brandRouter.get('/',(req,res)=>res.send('Brand'))
brandRouter.get('/:brandId',brandControllers.getBrand)
brandRouter.delete('/:brandId',brandControllers.deleteBrand)
brandRouter.get('/new',brandControllers.getNewForm)
brandRouter.post('/new',brandControllers.createNewBrand)


module.exports = brandRouter