const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api-route'); // Imports routes for the apis
const app = express();

// middlewares
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', api);
app.use('/upload', express.static('./uploads'))

// serve app
let port = 1224;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});