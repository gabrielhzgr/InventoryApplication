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
    const {rows} = await pool.query('SELECT * FROM models WHERE demo_id=$1', [id])
    return rows
}

async function deleteDemographic(id){
    const query = `
    WITH cte1 AS (SELECT id FROM models WHERE demo_id=$1),
         cte2 AS (SELECT sku FROM models_shoes WHERE model_id IN (SELECT id FROM cte1)),
         dt1 AS (DELETE FROM models_tags WHERE model_id IN (SELECT id FROM cte1)),
         dt2 AS (DELETE FROM shoes WHERE sku IN (SELECT sku FROM cte2)),
         dt3 AS (DELETE FROM models_shoes WHERE model_id IN (SELECT id FROM cte1)),
         dte4 AS (DELETE FROM models WHERE id IN (SELECT id FROM cte1))
    DELETE FROM demographics WHERE id=$1`
    const result = await pool.query(query,[id])
    return result
}

async function getAllModels() {
    const {rows} = await pool.query('SELECT models.id, description,gender,name from models JOIN demographics ON demographics.id=demo_id JOIN brands ON brands.id=brand_id')
    return rows

}

async function getAllShoes() {
    const {rows} = await pool.query('SELECT sku, color, size, price, units_in_stock, description  FROM shoes JOIN models ON model_id=id')
    return rows
}

async function getShoesByModel(id) {
    const {rows} = await pool.query(`SELECT sku, color, size, price, units_in_stock, description  FROM shoes JOIN models ON model_id=id WHERE model_id=$1`,[id])
    return rows
}

async function createNewShoe(color, size, price, modelId, unitsInStock){

    const result = await pool.query(`INSERT INTO shoes(color, size, price, model_id, units_in_stock) VALUES ($1,$2,$3,$4,$5)`,
        [color, size, price, modelId, unitsInStock])
    return result
}

async function createNewModel(description, brandId, demoId, tags) {
    const {rows} = await pool.query(`SELECT * FROM createModel($1, $2, $3, ARRAY[$4])`, [description, brandId, demoId, tags])
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


module.exports = {
    getAllDemographics,
    getAllBrands, 
    getAllTags, 
    getDemographic, 
    getDemoModels,
    getAllModels,
    getAllShoes,
    getShoesByModel,
    createNewShoe,
    createNewModel,
    deleteDemographic
}