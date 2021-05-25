const express = require('express')
const app = express()
const fs = require('fs')
let uniqid = require('uniqid');
let cors = require('cors')

app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(4040,(err) => {
    if(err)
        throw err;
});

app.post('/register/:firstname/:lastname/:email/:password',(req,res) => {
    const firstname = req.params.firstname;
    const lastname = req.params.lastname;
    const email = req.params.email;
    const password = req.params.password;
    
    let rawdata = fs.readFileSync('./data/users.json')
    let data = JSON.parse(rawdata)['users']
    
    let newUser = {'id':uniqid(),'firstname': firstname, 'lastname': lastname, 'email': email, 'password':password}
    data.push(newUser)
    fs.writeFileSync('./data/users.json',JSON.stringify({'users':data}))
    res.status(200).send();
})


app.get('/users',(req,res) => {
    let rawdata = fs.readFileSync('./data/users.json')
    let data = JSON.parse(rawdata)['users']
    res.status(200).send(data);
})

app.delete('/users/:id',(req,res) => {
    const id = req.params.id;
    let rawdata = fs.readFileSync('./data/users.json')
    let data = JSON.parse(rawdata)['users']
    const filteredData = data.filter( user => user.id != String(id))
    fs.writeFileSync('./data/users.json',JSON.stringify({'users':filteredData}))
    res.status(200).send();  
})

app.get('/edit/:id',(req,res) => {
    const id = req.params.id;
    let rawdata = fs.readFileSync('./data/users.json')
    let data = JSON.parse(rawdata)['users'].filter( user => user['id'] == id)
    res.status(200).send(data);  
})

app.put('/edit/:id/:firstname/:lastname/:email',(req,res) => {
    const id = req.params.id;
    const firstname = req.params.firstname;
    const lastname = req.params.lastname;
    const email = req.params.email;
    let password;
    let rawdata = fs.readFileSync('./data/users.json')
    let data = JSON.parse(rawdata)['users']
    
    data.forEach(el => {
        if(el['id']==id)
            password = el['password']
    });

    const filteredData = data.filter( user => user.id != String(id))
    const editedUser = {'id':id,'firstname':firstname,'lastname':lastname,'email':email,'password':password}
    filteredData.push(editedUser)

    fs.writeFileSync('./data/users.json',JSON.stringify({'users':filteredData}))
    res.status(200).send();  
})