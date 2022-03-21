const axios = require('axios');

const { createIndex } = require('../utils/utils.js');

async function textExtract(id, index, stream, url, fileName) {
    try {
        const response = await axios({
            method: 'PUT',
            url: 'http://localhost:9998/tika/text',
            data: stream,
            responseType: 'text/plain',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        const document = {
            id,
            fileName,
            url,
            textContent: response.data['X-TIKA:content'].trim(),
        };

        createIndex(index, document);
    } catch (error) {
        console.log(error);
    }
}

module.exports = textExtract;
