/*
 * Write your server-side JS code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Sai Sri Gauri Setti
 * Email: setts@oregonstate.edu
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8000;

// load post data
const postData = require('./postData.json');

// set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// serve static files
app.use(express.static('static'));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.get('/', (req, res) => {
  res.render('index', { 
    posts: postData,
    singlePost: false
  });
});


app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  
  if (isNaN(postId) || postId < 0 || postId >= postData.length) {
    res.status(404).render('404');
  } else {
    res.render('index', {
      posts: [postData[postId]],
      singlePost: true
    });
  }
});

app.use((req, res) => {
  res.status(404).render('404');
});


app.listen(port, '127.0.0.1', () => {
  console.log(`Server is listening on http://127.0.0.1:${port}`);
});
