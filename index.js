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


app.use(logger);

const router = require('./routes/route')
app.use('/', router);

const api_router = require('./routes/api_route')
app.use('/api_router', api_router);

const api_file = require('./routes/api_file_route')
app.use('/api_file', api_file);



function logger(req, res, next) {
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");

  console.log(`${formattedDate} => ${req.ip} => ${req.originalUrl}`);
  next();
}


const port = 3003;
app.listen(port, ()=>{
    console.log(`Express api is running from  http://localhost:${port}`)
})