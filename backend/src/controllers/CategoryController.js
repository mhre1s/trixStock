const CategoryService = require('../services/CategoryService')

class CategoryController{
    async getCategories(req, res){
        try {
            const categories = await CategoryService.getAllCategories(
              req.query,
            );
            res.status(200);
            return res.json(categories);
        } catch (error) {
            res.status(500).json({error: "Erro ao buscar categorias"})
        }       
    }
    async createCategories(req,res){
        try {
            const category = await CategoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({error: error.message})
        }       
    }
}

module.exports = new CategoryController()