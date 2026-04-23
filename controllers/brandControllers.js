const db = require('../db/queries')

async function getBrand(req,res){
    let {brandId} = req.params
    brandId = Number(brandId)
    const brand= await db.getBrand(brandId) 
    const models = await db.getBrandModels(brandId)
    const modTags = await db.getAllModelsTags()
    res.render('brand',{title:brand[0].name, models, brand: brand[0], modTags})}

function getNewForm(req,res){
    res.render('newBrandForm',{title:'Create new Brand'})

}

async function createNewBrand(req,res){
    const result = await db.createNewBrand(req.body.name)
    res.redirect('/')
}

async function deleteBrand(req,res){
    let {brandId} = req.params
    brandId = Number(brandId)
    await db.deleteBrand(brandId)
    res.json({redirect:'/'})
}

module.exports = {getBrand, getNewForm, createNewBrand, deleteBrand}