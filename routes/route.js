require("dotenv").config();

const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const path = require("path");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");
//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
const oneDay = 1000 * 60 * 5;

const ADODB = require("node-adodb");
const { log } = require("console");

const connMDB = ADODB.open(
  `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${process.env.DB_PATH};`
);

const users = require("../jsonDB/db.json").users;

// a variable to save a session
var session;

router.use(fileUpload({createParentPath: true }));
router.use(cookieParser());
router.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

router.use(function (req, res, next) {
  
  req.session.userid ?  res.locals.user = req.session.userid : res.locals.user = null;
  next();

 
})

router.get("/", (req, res) => {

  let sql = `select top 200 letterNo,  upload_date,subject,letterlink, uploadSection,  to_seccode from letterdata
          where  uploadType <> 'page' and delStatus=0  order by letterNo desc  `;
  connMDB
    .query(sql)
    .then((data) => {
      res.render("index", {
        title: "Latest Letters ",
        rows: data,
      });
    })
    .catch((error) => {
      res.json({ error: error });
    });
});

router.get("/delete", Auth, (req, res) => {
  let sql = `select top 200 letterNo, upload_date,subject,letterlink, uploadSection, to_seccode from letterdata
        where  uploadType <> 'page'  and delStatus=0 order by letterNo desc  `;

  connMDB
    .query(sql)
    .then((data) => {
      res.render("Delete", {
        title: "Delete Letters ",
        rows: data,
      });
    })
    .catch((error) => {});
});

router.get("/delete/:letterNo", Auth, (req, res) => {
  let letterNo = req.params.letterNo;

  let sql = `update letterdata set delStatus = 1, reply='${req.ip}'  where  letterNo = ${letterNo}  `;

  connMDB
    .execute(sql)
    .then((data) => {
      res.redirect("/");
    })
    .catch((error) => {
      res.send({ error: error });
    });
});

router.get("/clicked/:letterNo", (req, res) => {
  let letterNo = req.params.letterNo;
  let sql = `update letterdata set to_seccode = to_seccode +1   where  letterNo = ${letterNo}  `;

  connMDB
    .execute(sql)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.send({ error: error });
    });
});

router.get("/section/", SectionLetters);
router.get("/section/:section", SectionLetters);

function SectionLetters(req, res) {
  let section = req.params.section || "Admin";

  console.log(section);

  // let sql = `select  upload_date,subject,letterlink, unit from letterdata
  //   where uploadSection ='${req.params.section}' and  uploadType <> 'letter'
  // order by letterNo desc  `

  let sql = `select  upload_date,subject,letterlink, unit from letterdata   
    where uploadSection ='${section}'  and delStatus=0     
  order by letterNo desc  `;

  connMDB
    .query(sql)
    .then((data) => {
      res.render("index", {
        title: "Section : " + section,
        page: true,
        rows: data,
      });
    })
    .catch((error) => {});
}

router.get("/fileupload", Auth, (req, res) => {
  res.render("fileupload", { title: "Letter Upload" });
});

router.post("/fileupload", Auth, (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  let body = req.body;
  const file = req.files.customFile;

  //const path = __dirname + "/files/" + file.name;
  //const path = "D:/files/" + file.name;
  //const file = Math.floor(Date.now() / 1000) + "_" + req.files.customFile ;
  //

  const path = __dirname + "/files/" + file.name;

  const path_part = `${body.section}/${Math.floor(Date.now() / 1000)}_${
    file.name
  }`;
  // let path = `D:/files/${path_part}`;
  let fpath = `E:/website/vm_web/${path_part}`;
  let letterlink = `http://10.34.130.254/vm_web/${path_part}`;

  // console.log('file', file);
  // console.log('letterlink', letterlink);
  // console.log('fpath', fpath);

  file.mv(fpath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    let letterdate = body.letterNo + "  " + body.letterDt;

    //reply='${req.ip}'

    let sql = `insert into letterdata(upload_date,subject,letterlink, uploadSection, uploadType,letterdate, forward_comments ) 
                    values('${body.letterDt}','${body.subject}','${letterlink}','${body.section}','${body.uploadType}','${letterdate}', '${req.ip}')                              
          `;

    connMDB
      .execute(sql)
      .then((data) => {
        //return res.send({ status: "success", path: path, body:body, letterDate: letterdate, link:letterlink,  sql:sql, data:data});
        console.log(data);
        return res.redirect("/");
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

router.post("/login", (req, res) => {
  let user = users.find(
    (x) => x.user === req.body.userid && x.password === req.body.pwd
  );
  console.log(user);

  // if (req.body.userid === myusername && req.body.pwd === mypassword) {
  if (user) {
    session = req.session;
    session.userid = req.body.userid;
  }
  res.redirect(`${req.body.url}`);
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//#region Users
router.get("/users", Auth, async (req, res) => {
  try {
    if (req.session.userid === "sdeit") {
      let hosturl = req.get("host").split(":")[0];
      let url = `http://${hosturl}:3000/users`;
      const response = await fetch(url);
      const data = await response.json();

      res.render("users", { title: "Users", users: data });
    } else {
      res.send("you are not allowed to access this page");
    }
  } catch (error) {
    console.error(error.message);
    console.log("start json-server jsonDBdb.json in another cmd prmpt");
    res.status(500).send(`Server error ${error.message}`);
  }
});

router.post("/users", Auth, async (req, res) => {

  try {
    
  let hosturl = req.get("host").split(":")[0];
  let url =""
  let method = "PUT"

  const data = req.body
  
  if(data.id){
    url = `http://${hosturl}:3000/users/${data.id}`;
    method = "PUT"
  } else {
    url = `http://${hosturl}:3000/users/`; 
    method = "POST"
  }
  const response = await fetch(url,{
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(response.json());
  res.redirect("/users");
    
  } catch (error) {
    console.error(error.message);
    console.log("start json-server jsonDBdb.json in another cmd prmpt");
    res.status(500).send(`Server error ${error.message}`);
  }

}

);
//#endregion Users


router.get("*", (req, res) => {
  res.render("page404", { title: req.originalUrl });
});


function Auth(req, res, next) {
  if (req.session.userid) {
    next();
  } else {
    res.render("login", { title: "Login", url: req.originalUrl });
  }
}

module.exports = router;
