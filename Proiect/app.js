const express = require('express')
const app = express()

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

app.listen(4040,(err) => {
    if(err)
        throw err;
});


app.get('/home',(req,res) => {
    res.render('home.ejs');
});