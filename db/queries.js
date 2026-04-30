const pool = require('./pool')

async function getAllDemographics(){
    const {rows} = await pool.query('SELECT * FROM demographics')
    return rows
}

async function getDemographic(id){
    const {rows} = await pool.query('SELECT * FROM demographics WHERE id=$1', [id])
    return rows
}

async function getDemoModels(id){
    
    const {rows} = await pool.query(`SELECT models.id, description,name,name from models 
        JOIN demographics ON demographics.id=demo_id JOIN brands ON brands.id=brand_id WHERE demo_id=$1`
        , [id])
    return rows
}

async function getFilteredModels(description, tags) {
    let query = ''
    if(!tags){
        query += `SELECT * from models JOIN demographics ON demographics.id=demo_id 
        JOIN brands ON brands.id=brand_id WHERE description ILIKE ('%' || $1 || '%')`
        const {rows} = await pool.query(query,[description])
        return rows
    }else{
        query+=`AND models.id IN (SELECT model_id FROM models_tags WHERE tag_id = ANY($2))`
        const {rows} = await pool.query(query,[description, tags])
        return rows
        //My searching logic for tags is that a model must have any of the checked tags by the user
        //If we wanted to look only for models that had ALL the tags
        //we would replace last condition with AND models.id = ALL(SELECT tag_id FROM models_tags WHERE tag_id = ANY($2))
    }
}

async function updateModel(id, description, brandId, demoId, tags) {
    const {rows} = await pool.query(`SELECT * FROM updateModel($1, $2, $3, $4, $5)`, 
        [id, description, brandId, demoId, tags])
    return rows
}

async function updateShoe(id, color, size, price, modelId, inStock) {
    const {rows} = await pool.query(`UPDATE shoes SET(color, size, price, model_id, units_in_stock) 
        = ($2, $3, $4, $5, $6) WHERE sku=$1`, 
        [id, color, size, price, modelId, inStock])
    return rows
}


async function getFilteredShoes(minPrice, maxPrice, minStock, maxStock, colors, sizes) {
    let query = `SELECT color, size, price, units_in_stock, description FROM shoes JOIN models
    ON model_id=id WHERE price>=$1 AND price<=$2 AND units_in_stock>=$3 AND units_in_stock::float<=$4 `

    if(!colors && !sizes){
        const {rows} = await pool.query(query, [minPrice, maxPrice, minStock, maxStock])
        return rows
    }else if(colors && !sizes){
        query+=`AND color=ANY($5)`
        const {rows} = await pool.query(query, [minPrice, maxPrice, minStock, maxStock, colors])
        return rows
    }else{
        query+=`AND (color=ANY($5) OR size=ANY($6))`
        const {rows} = await pool.query(query, [minPrice, maxPrice, minStock, maxStock, colors, sizes])
        return rows   
    }
}

async function getBrand(id) {
    const {rows} = await pool.query('SELECT * FROM brands WHERE id=$1', [id])
    return rows
}

async function getBrandModels(id) {
    const {rows} = await pool.query('SELECT * FROM models WHERE brand_id=$1', [id])
    return rows
}

async function deleteDemographic(id){

    const query = `
    WITH cte1 AS (SELECT id FROM models WHERE demo_id=$1),
         cte2 AS (SELECT sku FROM shoes WHERE model_id IN (SELECT id FROM cte1)),
         dt1 AS (DELETE FROM models_tags WHERE model_id IN (SELECT id FROM cte1)),
         dt2 AS (DELETE FROM shoes WHERE sku IN (SELECT sku FROM cte2)),
         dte4 AS (DELETE FROM models WHERE id IN (SELECT id FROM cte1))
    DELETE FROM demographics WHERE id=$1`
    const result = await pool.query(query,[id])
    return result
}

async function createNewBrand(name) {
    const result = await pool.query('INSERT INTO brands(name) VALUES($1)',[name])
    return result
}

async function createNewDemo(name) {
    const result = await pool.query('INSERT INTO demographics(demo) VALUES($1)',[name])
    return result
}

async function deleteBrand(id) {
     const query = `
    WITH cte1 AS (SELECT id FROM models WHERE brand_id=$1),
         cte2 AS (SELECT sku FROM shoes WHERE model_id IN (SELECT id FROM cte1)),
         dt1 AS (DELETE FROM models_tags WHERE model_id IN (SELECT id FROM cte1)),
         dt2 AS (DELETE FROM shoes WHERE sku IN (SELECT sku FROM cte2)),
         dte4 AS (DELETE FROM models WHERE id IN (SELECT id FROM cte1))
    DELETE FROM brands WHERE id=$1`
    const result = await pool.query(query,[id])
    return result
}

async function deleteModel(id) {
    const query = `
    WITH dt1 AS (DELETE FROM models_tags WHERE model_id=$1),
         dt2 AS (DELETE FROM shoes WHERE model_id=$1),
         dt3 AS (DELETE FROM models WHERE id=$1)
    SELECT * FROM models WHERE id=$1;
    `
    const result = await pool.query(query, [id])
    return result
}

async function getModel(id) {
    const {rows} = await pool.query(`SELECT models.id, description,
        demographics.demo,brands.name from models JOIN demographics 
        ON demographics.id=demo_id JOIN brands ON brands.id=brand_id WHERE models.id=$1`,[id])
    return rows
}

async function getShoeById(id){
     const {rows} = await pool.query(`SELECT * from shoes WHERE sku=$1`,[id])
    return rows
}

async function deleteShoe(sku) {
    const result = await pool.query(`DELETE FROM shoes WHERE sku=$1`, [sku])
    return result
}

async function getAllModels() {
    const {rows} = await pool.query('SELECT models.id, description,demographics.demo,brands.name from models JOIN demographics ON demographics.id=demo_id JOIN brands ON brands.id=brand_id')
    return rows
}

async function getAllColors(){
    const {rows} = await pool.query('SELECT DISTINCT color FROM shoes')
    return rows
}


async function getAllSizes(){
    const {rows} = await pool.query('SELECT DISTINCT size FROM shoes')
    return rows
}


async function getAllShoes() {
    const {rows} = await pool.query('SELECT sku, color, size, price, units_in_stock, description  FROM shoes JOIN models ON model_id=id')
    return rows
}

async function getShoesByModel(id) {
    const {rows} = await pool.query(`SELECT sku, color, size, price, units_in_stock,model_id, description  FROM shoes JOIN models ON model_id=id WHERE model_id=$1`,[id])
    return rows
}

async function createNewShoe(color, size, price, modelId, unitsInStock){

    const result = await pool.query(`INSERT INTO shoes(color, size, price, model_id, units_in_stock) VALUES ($1,$2,$3,$4,$5)`,
        [color, size, price, modelId, unitsInStock])
    return result
}

async function createNewModel(description, brandId, demoId, tags) {
    const {rows} = await pool.query(`SELECT * FROM createModel($1, $2, $3, $4)`, 
        [description, brandId, demoId, tags])
    return rows

}

async function getAllBrands(){
    const {rows} = await pool.query('SELECT * FROM brands')
    return rows
}

async function getAllTags(){
    const { rows } = await pool.query('SELECT * FROM tags')
    return rows
}

async function getAllModelsTags(params) {
    const { rows } = await pool.query('SELECT * FROM models_tags JOIN tags ON tag_id=id')
    return rows
}




module.exports = {
    getAllDemographics,
    getAllBrands, 
    getAllTags, 
    getAllModelsTags,
    getDemographic, 
    getDemoModels,
    getAllModels,
    updateModel,
    updateShoe,
    getModel,
    getShoeById,
    deleteShoe,
    getAllShoes,
    getShoesByModel,
    getFilteredModels,
    getFilteredShoes,
    getBrand,
    getAllColors,
    getAllSizes,
    createNewBrand,
    getBrandModels,
    createNewShoe,
    createNewModel,
    createNewDemo,
    deleteDemographic,
    deleteBrand,
    deleteModel
}