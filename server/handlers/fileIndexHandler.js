const dbx = require('../config/config');

const textExtract = require('./textExtractHandler');

async function fileIndexHandler(path = '') {
    return await dbx
        .filesListFolder({ path })
        .then((fileList) => {
            fileList.result.entries.forEach((file) => {
                // If "folder",recursively call the funcion until it encounters a file
                if (file['.tag'] === 'folder') {
                    return fileIndexHandler(file.path_display);
                }

                // If tag equals file then donwload the neccessary file info as per requirement
                dbx.filesDownload({ path: file.path_display })
                    .then((fileInfo) => {
                        const blob = fileInfo.result.fileBinary;
                        const index = 'files';
                        const id = file.id;
                        const fileName = file.name;

                        // Create a shared link for each file if not created already
                        dbx.sharingCreateSharedLinkWithSettings({
                            path: id,
                        })
                            .then((createdSharedFileLink) => {
                                const url =
                                    createdSharedFileLink.result.links[0].url;
                                // extract text
                                textExtract(id, index, blob, url, fileName);
                            })
                            .catch((err) => {
                                // Check if shared link already exists, then simply fetch it
                                if (
                                    err.error.error['.tag'] ===
                                    'shared_link_already_exists'
                                ) {
                                    dbx.sharingListSharedLinks({
                                        path: id,
                                        direct_only: true,
                                    })
                                        .then((sharedFileLink) => {
                                            const url =
                                                sharedFileLink.result.links[0]
                                                    .url;
                                            // extract text
                                            textExtract(
                                                id,
                                                index,
                                                blob,
                                                url,
                                                fileName
                                            );
                                        })
                                        .catch((error) => console.log(error));
                                }
                            });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
            return 'Files indexed successfully';
        })
        .catch((error) => console.log(error));
}

module.exports = fileIndexHandler;
