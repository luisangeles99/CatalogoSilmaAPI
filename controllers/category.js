const Category = require('../models/category.js');

//get all categories
const getCategories = async(req, res) => {
    let categories;

    try {
        categories = await Category.find({isActive: true});
    } catch (err) {
        return res.status(505).send({error: 'Internal server error'});
    }
    if(categories.length == 0) {
        return res.status(404).send({error: 'No categories found!'});
    }

    return res.json({data: categories});
}

//create category
const createCategory = async(req, res) => {
    let category = new Category(req.body);

    let categoryExist;

    try{
        categoryExist = await Category.findOne({name: category.name});
    } catch(err){
        return res.status(505).send({error: 'Internal server error'});
    } 

    if(categoryExist) {
        return res.status(400).send({error: 'Category with that name already exists'});
    }

    try {
        await category.save();
    } catch (err) {
        console.log('Error saving category ' + err);
        return res.sendStatus(505);
    }
    return res.json({success: 'Category created', category});
}


module.exports = {
    getCategories: getCategories,
    createCategory: createCategory
}