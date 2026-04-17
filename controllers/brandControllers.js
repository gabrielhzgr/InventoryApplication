const db = require('../db/queries')

async function getBrand(req,res){
    let {brandId} = req.params
    brandId = Number(brandId)
    const brand= await db.getBrand(brandId) 
    const models = await db.getBrandModels(brandId)
    res.render('brand',{title:brand[0].name, models, brand: brand[0]})}

function getNewForm(req,res){

}

function createNewBrand(req,res){
    res.send('New brand created')
}

async function deleteBrand(req,res){
    let {brandId} = req.params
    brandId = Number(brandId)
    await db.deleteBrand(brandId)
    res.json({redirect:'/'})
}

module.exports = {getBrand, getNewForm, createNewBrand, deleteBrand}