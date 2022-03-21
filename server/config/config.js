const fetch = require('node-fetch');

const config = {
    fetch,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
};

const { Dropbox } = require('dropbox');
const dbx = new Dropbox(config);

module.exports = dbx;
