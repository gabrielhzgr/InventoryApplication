const db = require('../db/queries')

async function getDemog(req,res){
    let {demogId} = req.params
    demogId = Number(demogId)
    const demographic= await db.getDemographic(demogId) 
    const models = await db.getDemoModels(demogId)
    res.render('demography',{title:demographic[0].gender, demographic: demographic[0], models})
}

function getNewForm(req,res){    
    res.render('newDemogForm',{title:'Create New Demography'})
}

function createNewDemog(){

}

async function deleteDemog(req,res){
    let {demogId} = req.params
    demogId = Number(demogId)
    await db.deleteDemographic(demogId)
    res.json({redirect:'/'})
}

module.exports = {getDemog, getNewForm, createNewDemog, deleteDemog}