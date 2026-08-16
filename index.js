const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const config = require('./config.js');

const db = require('./utils/db.js');
const buyer = require('./src/Buyer.js');
const seller = require('./src/Seller.js');
const item = require('./src/Item.js');
const review = require('./src/Review.js');
const user = require('./src/User.js');
const render = require('./utils/render.js')

app.use(cors()); 
app.use(express.json());

app.use(express.static(__dirname+'/static/src/'));
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;
app.set("trust proxy", 1);
app.use(session(config.session));  

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache'); // For HTTP 1.0 backward compatibility
    res.set('Expires', '0');       // Proxies treat 0 as expired
    
    
    next();
});

app.get('/i', (req, res) => {
  res.sendFile(__dirname+"/views/i.html"); 
});
app.get('/rough', (req, res) => {
  res.sendFile(__dirname+"/views/rough.html"); 
});
app.get('/home', (req, res) => {
  if(!req.session.username){
    res.redirect('/');
  }
  else{
    res.sendFile(__dirname+"/views/app.html"); 
  }

});
app.get('/', (req, res) => {
  if(req.session.username){
    res.redirect('/home');
  }
  else{
    res.sendFile(__dirname+"/views/index.html"); 
  }
});
app.get('/register', (req, res) => {
  if(req.session.username){
    res.redirect('/home');
  }
  else{
     var result = render(__dirname+"/views/register.html",{message:" "});
     res.send(result);
  }
});

app.get('/signin', (req, res) => {
  if(req.session.username){
    res.redirect('/home');
  }
  else{
    var result = render(__dirname+"/views/signin.html",{message:" "});
    res.send(result);
   // res.sendFile(__dirname+"/views/signin.html"); 
  }
});




app.post('/login', user.login);
app.post('/signup', user.signup);
app.get('/currentuser',user.getCurrentUser);
app.get('/username/:id',user.checkUsername);
app.get('/profile',user.profile);
app.get('/logout',user.logout);
app.get('/buyer',buyer.getBuyers);
app.post('/buyer',buyer.createBuyer);
app.get('/seller',seller.getSellers);
app.post('/seller',seller.createSeller);
app.get('/item',item.getItems);
app.post('/item',item.createItem);
app.get('/order/:id',item.getOrders);
app.get('/order/seller/:id',item.getSellerOrders);
app.post('/order',item.createOrder);
app.put('/order',item.editOrder);
app.get('/cart',item.getCart);
app.post('/cart',item.addToCart);
app.put('/item',item.editItem);
app.get('/review',review.getReviews);
app.get('/review/:id',review.getReviews);
app.post('/review',review.createReivew);

app.get('/orders', (req, res) => {
    if(!req.session.username){
    res.redirect('/');
  }
  else{
    res.sendFile(__dirname+"/views/app.html"); 
  }
});
app.get('/createitem', (req, res) => {
    if(!req.session.username){
    res.redirect('/');
  }
  else{
    res.sendFile(__dirname+"/views/app.html"); 
  }
});
app.get('/gotocart', (req, res) => {
    if(!req.session.username){
    res.redirect('/');
  }
  else{
    res.sendFile(__dirname+"/views/app.html"); 
  }
});


app.listen(PORT,'0.0.0.0', () => {
  
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});





  
