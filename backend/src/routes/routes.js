const { Router } = require("express");

const authController = require("../controllers/authController");
const UserController = require("../controllers/UserController");
const ItemController = require("../controllers/ItemController");
const RequestController = require("../controllers/RequestController");
const CategoryController = require("../controllers/CategoryController")
const authMiddleware = require('../middlewares/auth')
const routes = new Router();

app.get("/", (req, res) => {
  res.status(200).send("Servidor está vivo!");
});

routes.post("/users", UserController.addUser);

routes.get("/items/by-category", authMiddleware, ItemController.listByCategory);
routes.post("/items", authMiddleware, ItemController.store);
routes.get("/items", authMiddleware, ItemController.list);
routes.patch("/items/:id/quantity", authMiddleware, ItemController.deleteQty);

routes.post("/requests", authMiddleware, RequestController.store);
routes.get("/requests", authMiddleware, RequestController.index); 
routes.patch(
  "/requests/:id/approve",
  authMiddleware,
  RequestController.approve,
); 
routes.patch("/requests/:id/reject", authMiddleware, RequestController.reject); 

routes.get("/categories", authMiddleware, CategoryController.getCategories);
routes.post("/categories", authMiddleware, CategoryController.createCategories);

routes.post("/login", authController.login);
routes.post("/register", authController.register);

module.exports = routes;
