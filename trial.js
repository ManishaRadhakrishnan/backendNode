var mysql = require('mysql');
var http = require('http');
var url = require('url');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
//http://localhost:8080/login?user=value&pass=value || http://localhost:8080/login?user=value&pass=value
http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  var q = url.parse(req.url, true);
  var path = "." + q.pathname;
  var qdata = q.query;

  if (path == './register') {
    if (qdata.user && qdata.pass) {
      insert_data(qdata.user, qdata.pass, function(insert_id, message) {
        let display_message = '{"message" : "' + message +
          '", "status" : ' + insert_id +
          '}';
        res.end(display_message.toString());
      });
    } 
  } else if (path == './login') {
    select_data(qdata.user, qdata.pass, function(status, message) {
        let display_message = '{"message" : "' + message + '", "status" : "' + status + '"}';
        res.end(display_message.toString());
      });
  } else {
   let display_message = return_query_status("0", "Invalid api call");
   res.end(display_message); 
  }
}).listen(8080);

function return_query_status(status, message) {
  var output_message = '{"message" : "' + message + '", "status" : ' + status +
    '}';
    
  return output_message;
}

function insert_data(user, pass, callback) {
  var sql = "INSERT INTO login(user_name, password) VALUES(?, ?)";
  let data = [user, pass];
  console.log(sql);
  con.query(sql, data, function(err, result) {
    if (err) {
      callback(0, "Something went wrong");
    } else {
      callback(result.insertId.toString(), "Registration Success");
    }
  });
}

function select_data(user, pass,callback) {
  var sql = "SELECT user_id FROM login WHERE user_name = ? AND password = ?";
 // console.log(sql);
  let data = [user, pass];
  con.query(sql, data,
    function(err, result, fields) {
      if (err) {
      callback(0, "Something went wrong");
    } else if(result.length == '1') {
      console.log(result[0].user_id.toString());
      callback("1", "Login Success");
    }
    else{
      callback("0", "Login failed");
    }
  });
      /*if (err) throw err;
      if (result.length == '1')
        console.log("Successful login!!");
      else
        console.log("Register");
    });*/
}
