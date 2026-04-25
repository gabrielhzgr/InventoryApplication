const db = require('../db/queries')
const {body, validationResult} = require('express-validator')

async function getIndex(req,res){
    const demographics  = await db.getAllDemographics()
    const brands  = await db.getAllBrands()
    const tags = await db.getAllTags()
    res.render('index',{title: 'Shoe Inventory', demographics, brands, tags})
}

async function getSearchModelsForm(req,res) {
    const tags = await db.getAllTags()
    res.render('searchModels',{title: 'Search Models', tags})
}

async function getSearchVariationsForm(req,res) {
    let colors = await db.getAllColors()
    let sizes = await db.getAllSizes()

    colors = colors.map(color=>color.color)
    sizes = sizes.map(size=>size.size)

    res.render('searchVariations',{title: 'Search Variations', colors, sizes})
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
    let colors = await db.getAllColors()
    colors = colors.map(color=>color.color)
    let sizes = await db.getAllSizes()
    sizes = sizes.map(size=>size.size)

    res.render('newShoeForm',{title:'Add new shoe', models, tags, colors, sizes})
}

async function getAllShoes(req,res){
    const {colors} = req.query
    let {minPrice} = req.query
    minPrice = Number(minPrice)
    let {maxPrice} = req.query
    if(maxPrice==''){
        maxPrice='Infinity'
    }else{
        maxPrice = Number(maxPrice)
    }
    let{minStock} = req.query
    minStock = Number(minStock)
    let {maxStock} = req.query
    if(maxStock==''){
        maxStock='Infinity'
    }else{
        maxStock = Number(maxPrice)
    }
    const {sizes} = req.query
    
    if(minPrice || maxPrice || minStock || maxStock || colors || sizes){
        const shoes = await db.getFilteredShoes(minPrice, maxPrice, minStock, maxStock, colors, sizes)
        res.render('allShoes',{title: `All Shoe Stock for search`, shoes})
        return
        //TODO: test this search
    }else if(req.query.modelId){
        const shoes = await db.getShoesByModel(Number(req.query.modelId))
        const model = await db.getModel(req.query.modelId)
        res.render('allShoes',{title: `All Shoe Stock for ${model[0].description}`, shoes})
        return
    }
    const shoes = await db.getAllShoes()
    res.render('allShoes',{title: 'All Shoe Stock', shoes})
}

async function getAllModels(req,res){
    const {description} = req.query
    let {tags} = req.query
    if (description || tags) {
        const models = await db.getFilteredModels(description, tags)
        const modTags = await db.getAllModelsTags()
        res.render('allModels',{title: 'All models', models, modTags})
        return
    }

    const models = await db.getAllModels()
    const modTags = await db.getAllModelsTags()

    res.render('allModels',{title: 'All models', models, modTags})
}
const validateShoe = [
    body('color').trim()
        .isLength({min:1, max: 25}).withMessage('Color must be between 1 and 25 characters'),
    body('size').trim()
        .isLength({min: 1, max: 25}).withMessage('Size must be between 1 and 25 characters'),
    body('price')
        .isFloat({min:0, max:99_999_999.99}).withMessage('Price must be between 0 and 99,999,999.99'),
    body('unitsInStock')
        .isFloat({min:0, max: 2_147_483_647}).withMessage('Stock must be between 0 and 2,147,483,647')
]

const createNewShoe = [
    validateShoe, async(req,res)=>{
        const errors = validationResult(req)   
        if(!errors.isEmpty()){
            const models  = await db.getAllModels()
            const tags = await db.getAllTags()
            let colors = await db.getAllColors()
            colors = colors.map(color=>color.color)
            let sizes = await db.getAllSizes()
            sizes = sizes.map(size=>size.size)
            res.status(404).render('newShoeForm',{title:'Add new shoe', models, tags, colors, sizes, errors: err})
        }  
        const {color, size, price, modelId, unitsInStock} = req.body
        const result = await db.createNewShoe(color, size, Number(price), Number(modelId), Number(unitsInStock))
        res.redirect(`/all-shoes?modelId=${modelId}`)
    }
]

const validateModel = 
    body("description").trim()
        .isLength({min:1, max:255}).withMessage('Description must be between 1 and 255 characters')
const createNewModel = [
    validateModel, async (req,res)=> {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const demographics  = await db.getAllDemographics()
            const brands  = await db.getAllBrands()
            const tags = await db.getAllTags()
            return res.status(400).render('newModelForm',{title:'Add new model', demographics, brands, tags, errors: errors.array()})
        }
        let {description, brandId, demoId, tags} = req.body
        if(!tags){
            tags=[]
        }
        const result = await db.createNewModel(description, Number(brandId), Number(demoId), tags)
        res.redirect('/all-models')
    }
]

function deleteShoe(req,res){
    res.send('Shoe deleted'+req.params.id)
}

module.exports = {
    getIndex,
     getNewModelForm, 
     getNewShoeForm, 
     getAllShoes, 
     getAllModels, 
     getSearchModelsForm,
     createNewShoe, 
     createNewModel,
     getSearchVariationsForm,
     deleteShoe
}