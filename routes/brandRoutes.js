const express = require('express')
const brandRouter = express.Router()
const brandControllers = require('../controllers/brandControllers')

brandRouter.get('/:brandId',brandControllers.getBrand)
brandRouter.get('/new',brandControllers.getNewForm)
brandRouter.post('/new',brandControllers.createNewBrand)
brandRouter.delete('/:brandId',brandControllers.deleteBrand)

module.exports = brandRouter