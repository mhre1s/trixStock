const User = require('../model/User')

class UserService{
    async getUsers(){
        return await User.findAll({order: [["name", "ASC"]]})
    }
    async createUser(data){
        return await User.create(data)
    }
}

module.exports = new UserService()