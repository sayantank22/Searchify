const app = require('express')();
const cors = require('cors');
require('dotenv').config();

const hostname = 'localhost';
const port = process.env.PORT || 5000;

const routes = require('./routes');

app.use(cors());

app.use('/api/v1', routes);

app.listen(port, hostname, (res, err) => {
    console.log(`App is running on port ${port}`);
});
