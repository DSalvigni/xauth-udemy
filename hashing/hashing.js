const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 4
};


var secret = '123abc';
var token = jwt.sign(data,secret);
console.log(token);
var decoded = jwt.verify(token,secret);
console.log(decoded);


/*
var message ='Test of hashing...';
var hash = SHA256(message).toString();

console.log('Message hashed -> '+message);
console.log('hash: '+hash);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data)+'SomSecret').toString()
};

var resultHash = SHA256(JSON.stringify(token.data)+'SomSecret').toString();

if(resultHash === token.hash){
    console.log('Data was not changed');
    console.log('Orig. token -> '+token.hash);
    console.log('Result hash -> '+resultHash);
}else{
    console.log('Data was changed: DO NOT TRUST!!!');
    console.log('Orig. token -> '+token.hash);
    console.log('Result hash -> '+resultHash);

}
*/

