const express = require('express');

const app = express();
const cookieParser = require('cooke-parser');
// Built in middleware
app.use(express.json());
app.use(cookieParser());
// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.get('/middle', (req, res, next) => {
  next();
});
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.unsubscribe((req, res, next) => {
  next();
});
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
