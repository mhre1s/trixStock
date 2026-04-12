const { Router } = require("express");

const authController = require("../controllers/authController");
const UserController = require("../controllers/UserController");
const ItemController = require("../controllers/ItemController");
const RequestController = require("../controllers/RequestController");
const CategoryController = require("../controllers/CategoryController")
const authMiddleware = require('../middlewares/auth')
const checkRole = require('../middlewares/role')
const routes = new Router();

routes.get("/healthcheck", (req, res) =>
  res.status(200).send("Servidor online!"),
);

routes.post("/users", UserController.addUser);

routes.get("/items/by-category", authMiddleware, checkRole(['almoxarifado', 'gestão', 'operacional']), ItemController.listByCategory);
routes.post("/items", authMiddleware, checkRole(['almoxarifado', 'gestão']), ItemController.store);
routes.get("/items", authMiddleware, checkRole(['almoxarifado', 'gestão', 'operacional']), ItemController.list);
routes.patch("/items/:id/quantity", authMiddleware, checkRole(['almoxarifado', 'gestão']), ItemController.deleteQty);

routes.post("/requests", authMiddleware, checkRole(['operacional', 'gestão']), RequestController.store);
routes.get("/requests", authMiddleware, RequestController.index); 
routes.patch(
  "/requests/:id/approve",
  authMiddleware,
  checkRole(['almoxarifado', 'gestão']),
  RequestController.approve,
); 
routes.patch("/requests/:id/reject", authMiddleware, checkRole(['almoxarifado', 'gestão']), RequestController.reject); 

routes.get("/categories", authMiddleware, CategoryController.getCategories);
routes.post("/categories", authMiddleware, checkRole(['almoxarifado', 'gestão']), CategoryController.createCategories);

routes.post("/login", authController.login);
routes.post("/register", authController.register);

module.exports = routes;
