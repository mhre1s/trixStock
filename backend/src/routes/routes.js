const { Router } = require("express");

const UserController = require("../controllers/UserController");
const ItemController = require("../controllers/ItemController");
const RequestController = require("../controllers/RequestController");
const CategoryController = require("../controllers/CategoryController")

const routes = new Router();

routes.post("/users", UserController.addUser);

routes.get("/items/by-category", ItemController.listByCategory);
routes.post("/items", ItemController.store);
routes.get("/items", ItemController.list);
routes.patch("/items/:id/quantity", ItemController.deleteQty);

routes.post("/requests", RequestController.store);
routes.get("/requests", RequestController.index);
routes.patch("/requests/:id/approve", RequestController.approve);
routes.patch("/requests/:id/reject", RequestController.reject);

routes.get("/categories", CategoryController.getCategories);
routes.post("/categories", CategoryController.createCategories)

module.exports = routes;
