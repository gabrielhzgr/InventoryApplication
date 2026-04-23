const express = require('express')
const indexRouter = express.Router()
const indexControllers = require('../controllers/indexControllers')

indexRouter.get('/',indexControllers.getIndex)
indexRouter.get('/newModel',indexControllers.getNewModelForm)
indexRouter.get('/newShoe',indexControllers.getNewShoeForm)
indexRouter.get('/all-shoes',indexControllers.getAllShoes)
indexRouter.get('/all-models',indexControllers.getAllModels)
indexRouter.post('/newShoe',indexControllers.createNewShoe)
indexRouter.post('/newModel',indexControllers.createNewModel)
indexRouter.get('/search-models', indexControllers.getSearchModelsForm)
indexRouter.get('/search-variations',indexControllers.getSearchVariationsForm)
indexRouter.delete('/:shoeId',indexControllers.deleteShoe)

module.exports = indexRouter