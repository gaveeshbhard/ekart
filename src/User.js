const db = require('../utils/db.js');
const mapObj = require("../utils/mapObject.js");
const render = require('../utils/render.js')

class User {
    id;
    username;
    password;
    role;
}


const login = (req, res) => {
    try{
     db.Selectwhere('users','username',req.body.username).then((x)=>{
        console.log(x);
        if(x[0]!==undefined){
            if(x[0].password==req.body.password && x[0].role==req.body.role){
                req.session.username = req.body.username;
                req.session.role = req.body.role;
                
                res.redirect("/home");

            }
            else{
            var result = render(__dirname+"/../views/signin.html",{message:" Invalid Credentials!! Try Again "});
            res.send(result);
            //res.send("");
            }
        }
        else{
            res.send("User Not Found !<a href='../'>Try Again</a>");
        }
     });
    }
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
    
}
const usernameAvailability = (req, res) => {
    var username = req.params.id; 
   try{
    db.Selectwhere('users','username',username).then((x)=>{
        if(x[0]!==undefined){
            res.send({available:false});

        }
        else{
            res.send({available:true});
        }
        
     });
    }
    catch(e){
        res.send({available:false});

    }
    
}

const signup = (req, res) => {
    try{
     var user = req.body;
     if(user.password!=user.password2){
        var result = render(__dirname+"/../views/register.html",{message:"Passwords do not match!!"});
        res.send(result);
     }
     else{

        delete user.password2;
        db.Selectwhere('users','username',req.body.username).then((x)=>{
            if(x[0]!==undefined){
                var result = render(__dirname+"/../views/register.html",{message:"Username not available"});
                res.send(result);

            }
            else{
                db.insertIntoTable(user,"USERS").then(x=> {
                const resp = mapObj.mapObject(new User(),x);
                req.session.username = req.body.username;
                req.session.role = req.body.role;
                res.redirect("/home");
            });
            
            }
            
        });
    }

         
    }
    catch(e){
        console.log(e);
        res.status(500).send("Some error Occured!!");
    }
    
}

const getCurrentUser = (req, res) => {

if(req.session.username){
    res.send({username:req.session.username,role:req.session.role});   
}
else{
    res.send({username:'',role:''});   
}
     
}

const logout = (req,res)=>{
try{
    req.session.destroy((err)=>{
        if(err){
            res.send("Error Logging out..")
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    })
}
    catch(e){
        res.status(500).send("Some error Occured!!");
    }
}

const profile = (req, res) => {
if(req.session.username){
 var result = render(__dirname+"/../views/profile.html",{username:req.session.username});
 res.send(result);
}
else{
    res.redirect('/');
}
}

module.exports={
    login: login,
    signup:signup,
    logout:logout,
    profile:profile,
    getCurrentUser:getCurrentUser,
    checkUsername:usernameAvailability
}

