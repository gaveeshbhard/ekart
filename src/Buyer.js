const db = require('../utils/db.js');
const mapObj = require("../utils/mapObject.js");
const Seller = require('./Seller.js');
class Buyer {
    id;
    name;
    email;
    address;
    purchaseHistory; // Array of Item IDs
    cart; // Array of Item IDs
    username;
}

const getBuyers = (req,res)=>{
    try{
    db.selectAll('buyer').then(x=>{
    
     for (let i = 0; i < x.length; i++) {
        var element = x[i];
        x[i] = mapObj.mapObject(new Buyer(),x[i]);
    }   

    res.send(JSON.stringify(x));
    })
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};
const createBuyer= (req,res)=>{
    try{
    var buyer = req.body;
    db.insertIntoTable(buyer,"BUYER").then(x=> {
        const resp = mapObj.mapObject(new Buyer(),x);
        res.send(JSON.stringify(resp));
    } );
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};



module.exports = {
    getBuyers: getBuyers,
    createBuyer:createBuyer
}

