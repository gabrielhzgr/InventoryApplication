const {body, validationResult} = require('express-validator')

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

const validateBrand = body('name').trim()
    .isLength({min: 1, max: 255}).withMessage('Name must be between 1 and 255 characters')

const createNewBrand = [validateBrand, async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('newBrandForm',{title:'Create new Brand', errors: errors.array()})
        return
    }
    let {name} = req.body
    const result = await db.createNewBrand(name.trim())
    res.redirect('/')
}]

async function deleteBrand(req,res){
    let {brandId} = req.params
    brandId = Number(brandId)
    await db.deleteBrand(brandId)
    res.json({redirect:'/'})
}

module.exports = {getBrand, getNewForm, createNewBrand, deleteBrand}