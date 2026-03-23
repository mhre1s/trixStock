const User = require('../model/User')
const bcrypt = require("bcrypt");

class UserService {
  async getUsers() {
    return await User.findAll({ order: [["name", "ASC"]] });
  }
  async createUser(userData) {
    // ESSA LINHA É O QUE FALTA:
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword, // Salva a senha protegida
    });
    return user
  }
  
}

module.exports = new UserService()