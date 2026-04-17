const db = require('../db/queries')

async function getIndex(req,res){
    const demographics  = await db.getAllDemographics()
    const brands  = await db.getAllBrands()
    
    res.render('index',{title: 'Shoe Inventory', demographics: demographics, brands: brands})
}

async function getNewModelForm(req,res){
    const demographics  = await db.getAllDemographics()
    const brands  = await db.getAllBrands()
    const tags = await db.getAllTags()
    res.render('newModelForm',{title:'Add new model', demographics, brands, tags})
}

async function getNewShoeForm(req,res){
    const models  = await db.getAllModels()
    const tags = await db.getAllTags()
    res.render('newShoeForm',{title:'Add new shoe', models, tags})
}

async function getAllShoes(req,res){
    if(req.query.modelId){
        const shoes = await db.getShoesByModel(Number(req.query.modelId))
        const model = await db.getModel(Number(req.query.modelId))
        res.render('allShoes',{title: `All Shoe Stock for ${model[0].description}`, shoes})
        return
    }
    const shoes = await db.getAllShoes()
    res.render('allShoes',{title: 'All Shoe Stock', shoes})
}

async function getAllModels(req,res){
    const models = await db.getAllModels()
    res.render('allModels',{title: 'All models', models})
}

async function createNewShoe(req,res){
    const {color, size, price, modelId, unitsInStock} = req.body
    const result = await db.createNewShoe(color, size, Number(price), Number(modelId), Number(unitsInStock))
    res.send('Created new')
}

async function createNewModel(req,res) {
    const {description, brandId, demoId, tags} = req.body
    const result = await db.createNewModel(description, Number(brandId), Number(demoId), tags)
    res.send('Created model')
}

function deleteShoe(req,res){
    res.send('Shoe deleted'+req.params.id)
}

module.exports = {
    getIndex,
     getNewModelForm, 
     getNewShoeForm, 
     getAllShoes, 
     getAllModels, 
     createNewShoe, 
     createNewModel,
     deleteShoe
}