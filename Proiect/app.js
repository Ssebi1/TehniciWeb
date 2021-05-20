const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');
const session = require('express-session')


app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: "secret",resave: false,saveUninitialized:true}))


app.listen(4040,(err) => {
    if(err)
        throw err;
});

app.use(function (req, res, next) {
    if(req.session.username !== undefined){
        res.locals.username = req.session.username;
    } else{
        res.locals.username = '';
    }
    next()
})

const readFile = file => {
    const rawData = fs.readFileSync('./data/'+file)
    return JSON.parse(rawData)
}

// Routes
app.get('/',(req,res) => {
    res.redirect('/home');
})

app.get('/home',(req,res) => {
    const data = readFile('exercises.json')
    res.render('home.ejs',{exercises:data['exercises']});
});

app.get('/login',(req,res) => {
    res.render('login.ejs',{error:0})
})

app.post('/loginauth',(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username.length<4)
        {
            res.render('login.ejs',{error:1})
            return;
        }
    else if(password.length<4)
        {
            res.render('login.ejs',{error:2})
            return;
        }
    else
        {
            let users = require('./data/users.json')['users']
            let check = false
            users.forEach(el => {
                if(el.username == username && el.password == password)
                {
                    req.session.username = username;
                    res.locals.username = username;
                    res.redirect('/home');
                    check = true
                }
            });
            if(!check)
                res.render('login.ejs',{error:3})
            return;
        }
})

app.post('/registerauth',(req,res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender;
    if(username.length<4)
        {
            res.render('register.ejs',{error:1})
            return;
        }
    else if(password.length<4)
        {
            res.render('register.ejs',{error:2})
            return;
        }
    else
        {
            let users = require('./data/users.json')['users']
            let check = false
            users.forEach(el => {
                if(el.username == username)
                {
                    res.render('register.ejs',{error:3})
                    check = true
                    return
                }
            });
            if(!check)
                {
                    if(!email)
                        email='none';
                    if(!gender)
                        gender='none';
                    let new_user = {username:username,email:email,password:password,gender:gender}
                    users.push(new_user)
                    fs.writeFileSync('./data/users.json',JSON.stringify({"users":users}))
                    res.redirect('/login');
                    return;
                }
        }
})


app.get('/register',(req,res) => {
    res.render('register.ejs',{error:0})
})

app.get('/logout',(req,res) => {
    req.session.username = '';
    res.redirect('/home');
})


app.get('*', function(req, res){
    res.status(404).render('404page.ejs');
});