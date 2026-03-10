const User = require("./User");
const Item = require("./Item");
const Request = require("./Request");


User.hasMany(Request, { foreignKey: "user_id", as: "requests" });
Request.belongsTo(User, { foreignKey: "user_id", as: "user" }); 

Item.hasMany(Request, { foreignKey: "item_id", as: "requests" });
Request.belongsTo(Item, { foreignKey: "item_id", as: "item" }); 

module.exports = { User, Item, Request };
