const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');

const app = express()

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

//set Static Path
app.use(express.static(path.join(__dirname,'public')))

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const router = require('./routes/route')
app.use('/', router);

const ADODB = require('node-adodb');
const connMDB = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=bsnl1.mdb;');
app.get('/api',(req,res)=>{
    connMDB.query('select top 10 * from letterdata')
            .then(data => res.json(data))
            .catch(error => {})
})



console.log(path.join(__dirname,'public'));

const port = 3003;
app.listen(port, ()=>{
    console.log(`Express api is running from ${port}`)
})