const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, username, password, level } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      level,
    });

    return res.status(201).json({ message: "Usuário criado!", id: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, level: user.level },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

module.exports = { login, register };
