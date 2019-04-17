var mysql = require('mysql');
var http = require('http');
var url = require('url');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true);
  var path= "." + q.pathname;
  var qdata = q.query;
  var txt = qdata.user + " " + qdata.pass;
  if(qdata.user && qdata.pass)
    insert_data(path,qdata.user,qdata.pass);
  else
    res.write("something wrong");
    res.end(txt);
}).listen(8080);

function insert_data(file,user,pass) {
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  console.log(file);
  if(file=='./login.html')
  var sql = "INSERT INTO login(user_name, password) VALUES("+"'"+user+"'"+","+"'"+pass+"'"+")";
  else if(file=='./register.html')
  var sql = "INSERT INTO register(user_name, password) VALUES("+"'"+user+"'"+","+"'"+pass+"'"+")";
  else
  print("Invalid table");
   //var values = [[user],[pass]];
   console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
}