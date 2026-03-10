const UserService = require('../services/UserService')

class UserController{
   async addUser(req,res){
        try {
            const user = await UserService.createUser(req.body)
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
   }
}
module.exports = new UserController();