const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

// ket noi database
const connection = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password:'',
  database: 'webtruyen'
});
//kiem tra ket noi
connection.connect(function(error){
  if(!!error){
    console.log(error);
  }
  else{
    console.log('Database connection successful!!!');
  }
})

//set views file (xet file (ejs) ở thư mục nào)
// app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//tạo link cho trang home
app.get('/',(rep,res) => {
  res.render('index',{
    //title: 'LIST OF REGISTERS',
    // users: rows
  });
}); 

//lấy dữ liệu trên db xuống file ejs
app.get('/register',(rep,res) => {
    //res.send('Insert, Update, Delete.');
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('userIndex',{
            title: 'LIST OF REGISTERS',
            users: rows
        });
    });
});

//
app.get('/register',(rep,res) => {
  res.render('userIndex',{
    title: 'Register'
  });
});

//đẩy dữ liệu trong form lên db
app.post('/register',(req, res) => { 
  let data = {fullname: req.body.fullname, email: req.body.email, phone: req.body.phone, address: req.body.address, password: req.body.password};
  let sql = "INSERT INTO users SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/register');
  });
});

//tạo link cho trang contact
app.get('/contact',(rep,res) => {
  res.render('contact',{
    //title: 'LIST OF REGISTERS',
    // users: rows
  });
});

const swaggerOptions={
  swaggerDefinition: {
      info: {
          title: 'My document',
          description: "Nguyễn Huỳnh Như Thảo",
          version: "1.0.0",
          contact: {
              name: "Nguyễn Huỳnh Như Thảo",
              email: "17521064@gm.edu.vn",
          },
          servers: ["localhost:9000"]
      }
  },
  apis: ["app.js"]
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));


/**
* @swagger
* /:
*  get:
*      summary: ...
*      description: ...
*      produces:
*          - application/json
*      responses:
*          '200': 
*              description: ....
*/

//server listening
app.listen(process.env.PORT ||9000, () =>{
    console.log('Sercer run!!!');
})