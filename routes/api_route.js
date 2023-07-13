const express = require('express')
const router = express.Router()

const ping = require('ping')

// ---api_router/
router.get('/',(req,res)=>{
  ping.sys.probe(req.query.ip,function(isAlive){
    res.json({isAlive:isAlive})
  })
})

module.exports = router;