const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('./config/configureStorage');
const router = require('./routes');

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use('/', router)
app.set('view engine', 'ejs');

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));