const User = require("./User");
const Item = require("./Item");
const Request = require("./Request");
const Category = require("./Category");


User.hasMany(Request, { foreignKey: "user_id", as: "requests" });
Request.belongsTo(User, { foreignKey: "user_id", as: "user" }); 

Item.hasMany(Request, { foreignKey: "item_id", as: "requests" });
Request.belongsTo(Item, { foreignKey: "item_id", as: "item" }); 

Item.belongsTo(Category, {
  foreignKey: "category_id",
});

Category.hasMany(Item, {
  foreignKey: "category_id",
});

module.exports = { User, Item, Request, Category };
