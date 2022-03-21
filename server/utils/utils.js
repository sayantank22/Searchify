const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const mime = require('mime-types');

module.exports = {
    // Create index
    createIndex: async function (index, document) {
        try {
            await client.index({
                index,
                document,
            });
        } catch (error) {
            return error.message;
        }
    },
    deleteIndex: async function (index) {
        // Delete multiple indices with an array
        try {
            await client.indices.delete({
                index: index,
            });
        } catch (error) {
            console.trace(error.message);
            return error.message;
        }
    },
    searchIndex: async function (index, term) {
        try {
            // here we are forcing an index refresh, otherwise we will not
            // get any result in the consequent search
            await client.indices.refresh({ index: index });

            // Let's search!
            const result = await client.search({
                index: index,
                query: {
                    multi_match: {
                        query: term,
                        fields: ['url', 'textContent', 'filename'],
                    },
                },
            });

            return result.hits.hits;
        } catch (error) {
            return error.message;
        }
    },

    getFileMimeType: function (filename) {
        const mimeType = mime.lookup(filename);
        return mimeType;
    },
};
