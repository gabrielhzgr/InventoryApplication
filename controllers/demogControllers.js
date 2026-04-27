const db = require('../db/queries')
const {body, validationResult} = require('express-validator')



async function getDemog(req,res){
    let {demogId} = req.params
    demogId = Number(demogId)
    const demographic= await db.getDemographic(demogId) 
    const models = await db.getDemoModels(demogId)
    const modTags = await db.getAllModelsTags()
    res.render('demography',{title:demographic[0].name, demographic: demographic[0], models, modTags})
}

function getNewForm(req, res){    
    res.render('newDemogForm',{title:'Create New Demography'})
}

const validateDemo = body('demo').trim()
        .isLength({min:1, max: 255}).withMessage('Name must be between 1 and 25 characters')

const createNewDemog = [validateDemo, async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('newDemogForm',{title:'Create New Demography', errors: errors.array()})
        return
    }
    let {demo} = req.body
    const result = await db.createNewDemo(demo.trim())
    res.redirect('/')
}] 

async function deleteDemog(req, res){
    let {demogId} = req.params
    demogId = Number(demogId)
    await db.deleteDemographic(demogId)
    res.json({redirect:'/'})
}

module.exports = {getDemog, getNewForm, createNewDemog, deleteDemog}