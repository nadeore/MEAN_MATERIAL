var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cors        = require('cors');
var mysql       =require('mysql');
// var formData    = require('form-data');
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Authorization, Content-Type, Accept');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'realsapp'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected with mysql database...')
});

app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3000, "localhost", function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});
// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(express.static(__dirname+"/dist"));
app.use(express.static('dist'));

app.post('/employee', function (req, res) {
    // const sql = "SELECT count(*) as total FROM demo";
    // let discounter;
        connection.query('SELECT count(*) as total FROM demo', function(err, result) {
        let discounter = result[0].total;
        console.log(discounter);
        // const params = req.body;
        const f_id = req.body.firstName;
        const fid = f_id.charAt(0);
        const l_id = req.body.lastName;
        const lid = l_id.charAt(0);
        const numCount = discounter+1;
        const params = {
            uniqueID : fid+lid+'00'+numCount,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: req.body.mobile,
            emailId : req.body.emailId
        }
        // console.log(fid+lid+'00'+numCount);
        connection.query('INSERT INTO demo SET ?', params, function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    });
});

app.get('/getList', function (req, res) {
    connection.query('select * from demo where status=0', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
app.get('/searchName/:term', function (req, res) {
    // console.log(req.params.term);
    connection.query('SELECT * FROM demo WHERE firstName LIKE "%'+[req.params.term]+'%" ORDER BY firstName', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//rest api to get a single customer data
app.get('/update/:id', function (req, res) {
    connection.query('select * from demo where Id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to update record into mysql database
app.put('/empUpdate/:id', function (req, res) {
    // console.log(req.body);
    // console.log(req.params.id);
    connection.query('select uniqueID from demo where Id=?', [req.params.id], function(err, result) {
        let uid = result[0].uniqueID;
        let uxd = uid.substring(2);
        const f_id = req.body.firstName;
        const fid = f_id.charAt(0);
        const l_id = req.body.lastName;
        const lid = l_id.charAt(0);
        const unid = fid+lid+uxd;
        // console.log(fid+lid+uxd);
        connection.query('UPDATE `demo` SET `uniqueID`=?,`firstName`=?,`lastName`=?,`mobile`=?,`emailId`=? where `id`=?', [unid, req.body.firstName,req.body.lastName, req.body.mobile, req.body.emailId, req.params.id], function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    });
});

//rest api to delete record from mysql database
app.delete('/delete/:id', function (req, res) {
    // console.log(req.body);
    const stvar = '1';
    connection.query('UPDATE `demo` SET `status`=? where `id`=?', [stvar, req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    })
    // connection.query('DELETE FROM `demo` WHERE `id`=?', [req.params.id], function (error, results, fields) {
    //     if (error) throw error;
    //     res.end('Record has been deleted!');
    // });
});
console.log('Backend is running');
