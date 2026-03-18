const Category = require('../model/Category')

class CategoryService{
    async getAllCategories(){
        try {
            return await Category.findAll({
                order: [['name', 'ASC']]
            })
        } catch (error) {
            throw new Error("Erro ao obter categorias")
        }
    }
    async createCategory(data){
        try {
            const exists = await Category.findAll({
                where:{
                    name: data.name
                }
            })
            if(exists){
                throw new Error("Categoria já existente")
            }
            return await Category.create({
                name: data.name.trim().toUpperCase(),
                minimum: data.minimum || 0
            })
        } catch (error) {
            throw new Error('Erro ao criar categoria')
        }
    }
}

module.exports = new CategoryService()