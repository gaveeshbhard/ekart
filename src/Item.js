const db = require('../utils/db.js');
const mapObj = require("../utils/mapObject.js");
const upload = require('../utils/upload');

class Item {
    id;
    name;
    price;
    available;
    sellerId;
    rating;
    reviews;
    deliveryTime; // in days
    picture;
    category;
    unit;
    stock;
}

class Cart{
    id;
    itemId;
    quantity;
    buyerId;
}

class OrderItem {
    id;
    quantity;
    amount;
    orderId;
    delivered;
    itemId;
}


const getItems = (req,res)=>{
try{
  db.selectAll('item').then(x=>{
     for (let i = 0; i < x.length; i++) {
           var element = x[i];

           x[i] = mapObj.mapObject(new Item(),x[i]);
       }   
   
       res.send(JSON.stringify(x));
    })
}
catch(e){
    res.status(500).send("Some error Occured!!");
}
};


const getOrders = (req,res)=>{
try{
    db.joinTables("ORDERS","ORDERHISTORY","INNER JOIN","id","orderid","buyerid",req.params.id).then(x=>{
     for (let i = 0; i < x.length; i++) {
           var element = x[i];
           x[i] = mapObj.mapObject(new OrderItem(),x[i]);
       }   
   
       res.send(JSON.stringify(x));
    })
}
catch(e){
    res.status(500).send("Some error Occured!!");
}
};


const getSellerOrders = (req,res)=>{
try{
    db.joinTables("ITEM","ORDERHISTORY","INNER JOIN","id","itemid","sellerid",req.params.id).then(x=>{
     for (let i = 0; i < x.length; i++) {
           var element = x[i];
           x[i] = mapObj.mapObject(new OrderItem(),x[i]);
       }   
   
       res.send(JSON.stringify(x));
    })
}
catch(e){
    res.status(500).send("Some error Occured!!");
}
};


const createItem= (req,res)=>{
try{    upload.single('picture')(req, res, function (err) {
        if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unknown Error', message: err.message });
        }
        var item = req.body;
        item.available=true;
        item.rating=0;
        item.reviews=[];
        
        item.picture = req.file.filename;
        db.insertIntoTable(item,"ITEM").then(x=> {
        const resp = mapObj.mapObject(new Item(),x);
        res.send(JSON.stringify(resp));
    });
    });
    }
catch(e){
    res.status(500).send("Some error Occured!!");
}
};




const createOrder= (req,res)=>{
try{        
        const order = req.body.order;
        const buyerid = req.body.buyerId;
        db.insertIntoTable({buyerid:buyerid},"ORDERS").then(x=> {
            var orderId =0;
            if(x.length==1){
                orderId = x[0].id;
                addItemsToOrder(orderId,order,x[0].buyerid).then(x=>{
                    if(x.status==200){
                           res.send(true);
                       
                        
                    }
                    else{
                       return res.status(500).send(false);

                    }
                });
            }
            else{
                return res.status(500).send(false);
            }
        });
}
catch(e){
    res.status(500).send("Some error Occured!!");
}    
        
        
    
};


async function addItemsToOrder(orderId,order,buyerid) {
    return new Promise(async (resolve,reject)=>{
        order.forEach(async (x,index,array)=>{
            try{
            x.orderId=orderId;

            var rows = await db.insertIntoTable(x,"ORDERHISTORY");
            if(index=== array.length-1){
                console.log("BID"+buyerid)
                 db.deleteFromTable({buyerid:buyerid},"CART",'buyerid').then(x=> {
                        
                    resolve({status:200})
                });
            }
            }
            catch(e){
                reject({status:500, error: 'Unknown Error', message: "Cant add Item!!" })
            }
       
        });
    });
}




const addToCart= (req,res)=>{
 try{       
        var cart = req.body;
        if(cart.quantity==0){
            db.deleteFromTable(cart,"CART",'buyerId','itemId').then(x=> {
            res.send(JSON.stringify(cart));
            });
        }
        
        else{
            if(cart.id!==undefined){
                db.updateTable(cart,"CART",'id').then(x=> {
                const resp = mapObj.mapObject(new Cart(),x);
                res.send(JSON.stringify(resp));
            });
            }
            else{
                db.insertIntoTable(cart,"CART").then(x=> {
                const resp = mapObj.mapObject(new Cart(),x);
                res.send(JSON.stringify(resp));
                });

            }
            
        }
}
catch(e){
    res.status(500).send("Some error Occured!!");
}
};


const getCart = (req,res)=>{
try{
      db.selectAll('cart').then(x=>{
     for (let i = 0; i < x.length; i++) {
           var element = x[i];
           x[i] = mapObj.mapObject(new Cart(),x[i]);
       }   
   
       res.send(JSON.stringify(x));
    })
}
catch(e){
    res.status(500).send("Some error Occured!!");
}
};


const editItem= (req,res)=>{
try{
    var item = req.body;
        db.updateTable(item,"ITEM","id").then(x=> {
        const resp = mapObj.mapObject(new Item(),x);
        res.send(JSON.stringify(resp));
    });
}
catch(e){
    res.status(500).send("Some error Occured!!");
}
};



const editOrder= (req,res)=>{
try{
        var order = req.body;
       db.updateTable(order,"ORDERHISTORY","id").then(x=> {
        const resp = mapObj.mapObject(new OrderItem(),x);
        res.send(JSON.stringify(resp));
    });
    
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
};


module.exports = {
    getItems: getItems,
    createItem:createItem,
    editItem:editItem,
    addToCart:addToCart,
    getCart:getCart,
    createOrder:createOrder,
    getOrders:getOrders,
    editOrder:editOrder,
    getSellerOrders:getSellerOrders

}