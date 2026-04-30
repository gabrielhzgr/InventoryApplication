const express = require('express')
const demogRouter = express.Router()
const demogControllers = require('../controllers/demogControllers')

demogRouter.get('/',(req,res)=>res.send('Demography'))
demogRouter.get('/new',demogControllers.getNewForm)
demogRouter.delete('/:demogId',demogControllers.deleteDemog)
demogRouter.get('/:demogId',demogControllers.getDemog)
demogRouter.delete('/delete-model/:modelId', demogControllers.deleteModelInDemo)
demogRouter.post('/new',demogControllers.createNewDemog)


module.exports = demogRouter