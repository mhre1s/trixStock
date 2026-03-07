const User = require("./User");
const Item = require("./Item");
const Request = require("./Request");

User.hasMany(Request);
Request.belongsTo(User);

Item.hasMany(Request);
Request.belongsTo(Item);
