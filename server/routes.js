const express = require('express');
const router = express.Router();

const { deleteIndex, searchIndex } = require('./utils/utils.js');
const fileIndexHandler = require('./handlers/fileIndexHandler');
const dbx = require('./config/config.js');

const redirectUri = `http://localhost:3000/login`;

router.get('/', async (req, res) => {
    try {
        const authUrl = await dbx.auth.getAuthenticationUrl(
            redirectUri,
            null,
            'code',
            'offline',
            null,
            'none',
            false
        );
        res.writeHead(302, { Location: authUrl });
        res.end();
    } catch (error) {
        console.log(error);
    }
});

router.get('/auth', async (req, res) => {
    try {
        const code = req.headers.code;
        const token = await dbx.auth.getAccessTokenFromCode(redirectUri, code);

        dbx.auth.setAccessToken(token.result.access_token);
        res.json({ access_token: token.result.access_token });
    } catch (error) {
        res.json({ error });
    }
});

router.post('/files', async (req, res) => {
    try {
        const response = await fileIndexHandler('');
        res.status(201).json({ msg: response });
    } catch (error) {
        res.json({ error: 'Something went wrong. Please try again!' });
    }
});

router.get('/files/search', async (req, res) => {
    try {
        const term = req.query.q;
        const index = 'files';
        const result = await searchIndex(index, term);
        res.status(200).json({ res: result });
    } catch (error) {
        res.json({ error: 'Something went wrong during file search!' });
    }
});

router.delete('/files', async (req, res) => {
    try {
        await deleteIndex('files');
        res.status(200).json({ msg: 'Index successfully deleted!' });
    } catch (error) {
        res.json({ error: 'Something went wrong while deleting file index!' });
    }
});

module.exports = router;
