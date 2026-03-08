const User = require("./User");
const Item = require("./Item");
const Request = require("./Request");

User.hasMany(Request, { foreignKey: "userId" });
Request.belongsTo(User, { foreignKey: "userId" });

Item.hasMany(Request, { foreignKey: "itemId" });
Request.belongsTo(Item, { foreignKey: "itemId" });
