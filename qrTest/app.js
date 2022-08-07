const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const qrCode = require('qrcode');
const userModel = require('./models/user');

const URL = "";
mongoose.connect(URL);

const app = express();
app.set("view engine", "ejs");
app.use(express.static('./static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    userModel.find((err,data)=>{    
        if (err) {    
            console.log(err);    
        } else {    
            if (data != ''){
                var latest =  data[data.length-1].name + " / " + data[data.length-1].tel;

                qrCode.toDataURL(latest, {
                    errorCorrectionLevel:'H'
                }, (err, url) => {
                    res.render('home', { data:url })    
                });
            }else{    
                res.render('home', { data:'' });    
            }    
        }    
     });    
});

app.post('/', (req,res) => {    
    var user = new userModel({    
        name: req.body.name,    
        tel: req.body.tel    
    });
    
    user.save((err,data) => {    
        if (err) {    
            console.log(err);    
        } else {    
            res.redirect('/');    
        }    
    });    
});

app.listen(3000);
