'use strict';
 
const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=G:\\website\\inventory\\bsnl1.mdb;');
 
async function query() {
  try {
    const users = await connection.query('SELECT top 10 * FROM letterdata');
 
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error(error);
  }
}
 
query();