const User = require("./models/user.model");
const Store = require("./models/store.model");
const { where } = require("sequelize");

checkStoreAdmin =  async (req, res, next) => {
  await User.findOne(
    {
        where:{
            id: req.user.id,
        }
    }
  ) .then(
   (user)=>{
    if(!user){
        res
        .status(400)
        .send({message:"Fail Role user store"});
        return;
    }
    Store.findOne({
        where:{
            adminId: user.id
        }
    }).then((store)=>{
        if(store){
            res.status(403).send({ message: "Access Denied! , Only Store Admin is allowed" });
            return;
        }
        next();
    })
   }
  )
}
const verifyStoreAdmin = {
    checkStoreAdmin,
};

module.exports = verifyStoreAdmin;
