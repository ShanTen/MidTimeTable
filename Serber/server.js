/*Simple Server Side with only a JSON serve*/

const express = require('express');
const cors = require("cors");
const app = express();
const fs = require('fs');

/*FS Methods:*/

function readJSONandReturnObject(filename){
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data)
    } catch (err) {
        console.error(err);
    }
}

/*Handle CORS (I want to KMS)*/

var pathToTimeTable = './timeTable.json';
var corsOptions= { 
    origin:["http://127.0.0.1:3000/*", "http://localhost:5000/"]//serve ip+port
}

app.use(cors(corsOptions));

/*RESTful Part*/

app.get('/', (req, res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var returnObj = readJSONandReturnObject(pathToTimeTable);
    console.log(`Got a request`)
    res.json(returnObj)
})

/*Host/Run it*/

const port = process.env.PORT || 5050;
app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`); 
});