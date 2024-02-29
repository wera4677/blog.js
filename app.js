const path = require('path');

const express = require('express');

const blogRoutes = require('./routes/blog');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // 수신 요청 본문이 구문분석됨 
app.use(express.static('public')); // 정적파일 제공 

app.use(blogRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});

app.listen(3000);
