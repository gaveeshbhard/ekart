const db = require('../utils/db.js');
const mapObj = require("../utils/mapObject.js");
class Review {
    id;
    itemId;
    buyerId;
    comment;
}
const getReviews = (req,res)=>{
    try{
     db.selectAll('review').then(x=>{
      for (let i = 0; i < x.length; i++) {
            var element = x[i];
            x[i] = mapObj.mapObject(new Review(),x[i]);
        }   
    
    res.send(JSON.stringify(x));
    })
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};
const createReview= (req,res)=>{
  try{
  var review = req.body;
    db.insertIntoTable(review,"REVIEW").then(x=> {
        const resp = mapObj.mapObject(new Review(),x);
        res.send(JSON.stringify(resp));
    } );
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};

module.exports = {
    getReviews: getReviews,
    createReivew:createReview
}