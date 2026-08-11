const db = require('../utils/db.js');
const mapObj = require("../utils/mapObject.js");

class Seller {
    id;
    name;
    email;
    rating;
    totalSales;
    address;
    username;
}

const getSellers = (req,res)=>{
    try{
      db.selectAll('seller').then(x=>{
      for (let i = 0; i < x.length; i++) {
            var element = x[i];
            x[i] = mapObj.mapObject(new Seller(),x[i]);
        }   
    
        res.send(JSON.stringify(x));
    
    })
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};
const createSeller= (req,res)=>{
 try{
    var seller = req.body;
    db.insertIntoTable(seller,"SELLER").then(x=> {
       const resp = mapObj.mapObject(new Seller(),x);
       res.send(JSON.stringify(resp));
    } );
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};

module.exports = {
    getSellers: getSellers,
    createSeller:createSeller
}