require("dotenv").config();
const express = require('express')
const router = express.Router()
const fileUpload = require("express-fileupload");
const path = require("path");

const ADODB = require('node-adodb');
const { log } = require('console');
// const connMDB = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source="./bsnl1.mdb";');
const connMDB =  ADODB.open(`Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${process.env.DB_PATH};`);
// const connMDB =  ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=G:\\bsnl1.mdb;');

console.log('loading router');

router.use(fileUpload({
    createParentPath: true,
  }));

let selectcmd = " select top 200 letterNo, upload_date,subject,letterlink, uploadSection from letterdata "

router.get('/',(req,res)=>{

    let sql = ` ${selectcmd} where  uploadType <> 'page' order by letterNo desc  `

    connMDB.query(sql)
            .then(data => {
                res.json({rows:data})
            })
            .catch(error => {})
})

router.get('/section/:section',(req,res)=>{
  let param = req.params.section
  let sql = ` ${selectcmd}  where uploadSection ='${req.params.section}' and  uploadType <> 'letter'  order by letterNo desc  `

    connMDB.query(sql)
            .then(data => {
                res.json({rows:data})
            })
            .catch(error => {})
})

router.get('/fileupload', (req,res)=>{
    res.render('fileupload',{title:"Letter Upload"})
})

router.post('/fileupload',(req,res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
      }
      let body =  req.body
      const file = req.files.customFile;
    
    const path = __dirname + "/files/" + file.name;

      const path_part = `${body.section}/${Math.floor(Date.now() / 1000)}_${file.name}`;
      // let path = `D:/files/${path_part}`;
      let fpath = `E:/website/vm_web/${path_part}`;
      let letterlink = `http://10.34.130.254/vm_web/${path_part}`

      console.log('file', file);
      console.log('letterlink', letterlink);

      file.mv(fpath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        
        let letterdate = body.letterNo + '  ' + body.letterDt;

        let sql = `insert into letterdata(upload_date,subject,letterlink, uploadSection, uploadType,letterdate) 
                    values('${body.letterDt}','${body.subject}','${letterlink}','${body.section}','${body.uploadType}','${letterdate}')                              
          `;
          
          connMDB.execute(sql).then(data => {
              //return res.send({ status: "success", path: path, body:body, letterDate: letterdate, link:letterlink,  sql:sql, data:data});
              console.log(data);
              return res.redirect('/');
          }).catch(error => {
            console.error(error);

          });        
      });
    
})

module.exports = router;