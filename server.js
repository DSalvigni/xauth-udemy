//All the required libs...
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const moment = require('moment');
const path = require('path');
const os = require('os');
const {ObjectID} = require('mongodb');
const _ = require('lodash');


//External config libs
var {mongoose} = require('./db-conf/mongoose.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');


//we create express app and middleware to parse the html body
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');

//We create the port for Heroku and a TS
var ts = moment().format('YYYY-MM-DD_HH:mm:ss_Z');
var connected = 0;
const PORT = process.env.PORT||5000;

 //we setup a get route for the home printing out 
app.get('/',(req,res)=>{
    res.render('home.hbs',{ts});
    console.log('Connected to HOME '+ts);

}); 


//Add by POST  a new user
app.post('/users',(req,res)=>{
    //This is done to permit user to update only these 2 fields in the db
    var body = _.pick(req.body,['name','email','password']);
    var user = new User(body);
        
    user.save().then(()=>{
        //console.log(JSON.stringify(user,undefined,2));
        //res.send(user);
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
       // console.log(JSON.stringify(user,undefined,2));
    }).catch((e) =>{
        res.status(400).send(e);
    });
});


app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

//delete a user per id
app.get('/users/delete/:id',(req,res)=>{
    var del_id = req.params.id;
    if(!ObjectID.isValid(del_id)){
        res.status(404);// Uncommet this line and comment next line to pass the test..send();
        res.render('404.hbs');
    } else {
        User.findByIdAndRemove(del_id).then((doc)=>{
            if(doc){
                //console.log('Removed ->'+JSON.stringify(doc,undefined,2));
                res.render('deleted.hbs',{del_id});
            } else {
                res.status(404);// Uncommet this line and comment next line to pass the test. .send();
                res.render('404.hbs');
            }
            }
        ).catch((e)=> 
        {
          //console.log(e);
          res.status(400).send();
        });
    }
}); 



app.get('/cesso',(req,res)=>{
    res.render('cesso.hbs');
}); 






 //If nothing respons...404
 app.get('/*',(req,res)=>{
    res.render('404.hbs');
}); 




//Start the server and log info in console
app.listen(PORT,() => {
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
        }

        if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log('Server listening on: '+ifname + ':' + alias, iface.address+' - Port:'+PORT);
        } else {
        // this interface has only one ipv4 adress
        console.log('Server listening on: '+ifname, iface.address+' - Port:'+PORT);
        }
        ++alias;
    });
    });
});

module.exports = {app};