function getBrand(req,res){
    res.send('Brand'+req.params.brandId)
}

function getNewForm(req,res){
}

function createNewBrand(req,res){
    res.send('New brand created')
}

function deleteBrand(req,res){
    res.send('Brand '+req.params.brandId+' deleted')
}

module.exports = {getBrand, getNewForm, createNewBrand, deleteBrand}