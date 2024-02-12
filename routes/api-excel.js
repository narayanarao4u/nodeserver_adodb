const router = require("express").Router();
const xls = require("xlsx");

function xldata(filename) {
  let wb = xls.readFile(filename, { cellDates: true });
  let ws = wb.Sheets["Sheet1"];
  return xls.utils.sheet_to_json(ws);
}

//  /api-excel/
router.get("/", function (req, res) {
  res.json({ msg: 'api-excel'  });
});

//  /api-excel/telephone
router.get("/telephone",  function (req, res) {
  let data = xldata("ServiceDirectoryPhone.xlsx");
  let searchtext = req.query.searchtext;
  // let searchtext = "rao";
  //  console.log(data[1]['Name'].toLowerCase());
  if(searchtext) {
    searchtext = searchtext.toLowerCase();
    data = data.filter((d) => d["Name"].toLowerCase().includes(searchtext) || d["Phone"].toString().includes(searchtext) ||
    d["Mobile"].toString().includes(searchtext) ||
    d["Desgn"].toLowerCase().includes(searchtext) || null);

  }

  let output = data.map((d) => {
    return `
      <div class="row">
        <div class="col-4"> ${d["Name"]} </div>
        <div class="col"> ${d["Desgn"]} </div>
        <div class="col"> ${d["Phone"]} </div>
        <div class="col"> ${d["Mobile"]} </div>      
      </div> 
    ` 
    });

    res.send(output.join("") );
  // res.json({ tele: data });
});



module.exports = router;
