const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: '157.245.59.56',
  user: 'u6403608',
  password: '6403608',
  database: 'u6403608_shop',
  port: 3366
})

var app = express()
app.use(cors())
app.use(express.json())

app.get('/', function(req, res) {
  res.json({
    "status": "ok",
    "message": "Hello World"
  })
})

app.get('/customers', function(req, res) {
  connection.query(
    'SELECT * FROM a1_customers',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

app.get('/orders', function(req, res) {
  connection.query(
    'SELECT * FROM a1_orders',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

app.get('/products', function(req, res) {
  connection.query(
    'SELECT * FROM a1_products',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get("/top_customer", function (req, res) {
  connection.query(
    `SELECT 
    C.firstname, 
    SUM(O.qtt*P.price) AS price_sum 
  FROM a1_customers AS C 
    INNER JOIN a1_orders AS O ON C.Cid = O.Cid 
    INNER JOIN a1_products AS P ON O.Pid = P.Pid 
  GROUP BY 
    C.Cid
  ORDER BY 
    price_sum DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get('/top_products', function(req, res){
  connection.query(
    `SELECT O.id, P.Pname, O.qtt, SUM(O.qtt*P.price) as Total_QTY FROM a1_orders as O INNER JOIN a1_products as P ON O.Pid = P.Pid GROUP BY O.id, P.Pname, O.qtt, P.price ORDER BY Total_QTY DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});


app.post("/createusers", function (req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const city = req.body.city;
  const tel = req.body.tel;
  connection.query(
    `INSERT INTO a1_customers (firstname, lastname, email, city,  tel) VALUES (?, ?, ?, ?, ? ,? ,?)`,
    [firstname, lastname, email, city, tel],
    function (err, results) {
      if (err) {
        res.json(err);
      }
      res.json(results);
    }
  );
});

app.post('/orders', function(req, res) {
  const values = req.body
  console.log(values)
  connection.query(
    'INSERT INTO a1_orders (Oid, Cid, qtt, Cid) VALUES ?', [values],
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})


app.listen(5000, () => {
  console.log('Server is started.')
})