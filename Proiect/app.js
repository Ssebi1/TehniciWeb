const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');
const session = require('express-session');
const { parse } = require('path/posix');


app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: "secret",resave: false,saveUninitialized:true}))


app.listen(4040,(err) => {
    if(err)
        throw err;
});

// For using session variables in ejs
app.use(function (req, res, next) {
    if(req.session.username !== undefined){
        res.locals.username = req.session.username;
    } else{
        res.locals.username = '';
    }
    next()
})

// Read json file function
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
    if(req.session.username!=undefined && req.session.username!='')
        {
            const users = readFile('users.json')['users']
            users.forEach(el => {
                if(el.username == req.session.username)
                    {
                        res.render('home.ejs',{data:{exercises:data['exercises'],favorites:el['favorites']}});
                        return;
                    }
            })
        }
    else
        res.render('home.ejs',{data:{exercises:data['exercises']}});
});

app.get('/login',(req,res) => {
    res.render('login.ejs',{error:0})
})

// Running when login button is clicked
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

// Running when register button is clicked
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
                    let new_user = {username:username,email:email,password:password,gender:gender,favorites:[]}
                    users.push(new_user)
                    fs.writeFileSync('./data/users.json',JSON.stringify({"users":users}))
                    res.status(200).send("<h1>Account created succesfully!</h1><br><a href='/login'>Go to login</a>")
                    return;
                }
        }
})


app.get('/register',(req,res) => {
    res.render('register.ejs',{error:0})
})

// Running when logout button is clicked
app.get('/logout',(req,res) => {
    req.session.username = '';
    res.redirect('/home');
})

// Email subscribe
app.post('/subscribe',(req,res) => {
    const email = req.body.email
    let newEmail = {'email':email,'active':true}
    let emails = readFile('emails.json')
    let ok=0
    emails['emails'].forEach(el => {
        if(el.email == email)
            {
                res.status(200).send("<h1>Subscription added!</h1><br><a href='/home'>Go back</a>");
                ok=1
                return;
            }
    })
    if(ok==0)
    {
        emails['emails'].push(newEmail);
        fs.writeFileSync('./data/emails.json',JSON.stringify(emails))
        res.status(200).send("<h1>Subscription added!</h1><br><a href='/home'>Go back</a>");
    }
    
})

// Adding exercise to favorites
app.get('/home/save-exercise/:id',(req,res) => {
    if(req.session.username != undefined && req.session.username!='')
    {
        let users = require('./data/users.json')['users']
        users.forEach(el => {
            if(el.username == req.session.username)
            {
                el.favorites.push(parseInt(req.params['id'].slice(3)))
                fs.writeFileSync('./data/users.json',JSON.stringify({"users":users}))
                res.status(200).send("<h1>Exercise added to favorites!</h1><br><a href='/home'>Go back</a>")
                return
            }
        });
    }
    else{
        res.redirect('/home');
    }

})

app.get('/home/unsave-exercise/:id',(req,res) => {
    if(req.session.username != undefined && req.session.username!='')
    {
        let users = require('./data/users.json')['users']
        let id = parseInt(req.params['id'].slice(3))
        users.forEach(el => {
            if(el.username == req.session.username)
            {
                let index = el.favorites.indexOf(id)
                if(index>-1)
                    el.favorites.splice(index,1)
                fs.writeFileSync('./data/users.json',JSON.stringify({"users":users}))
                res.status(200).send("<h1>Exercise removed from favorites!</h1><br><a href='/home'>Go back</a>")
                return
            }
        });
    }
    else{
        res.redirect('/home');
    }

})

// Favorites page
app.get('/favorites',(req,res) => {
    if(req.session.username != undefined && req.session.username!='')
    {
        const exercises = readFile('exercises.json')['exercises']
        let filteredExercises = []

        const users = readFile('users.json')['users']
        users.forEach(el => {
            if(el.username == req.session.username)
            {
                const favorites = el.favorites
                exercises.forEach(el => {
                    if(favorites.includes(el.id))
                        filteredExercises.push(el)
                })
                res.render('favorites.ejs',{exercises:filteredExercises});
                return
            }
        })
    }
    else
    {
        res.redirect('/')
    }
    
})

// 404 error page
app.get('*', function(req, res){
    res.status(404).render('404page.ejs');
});