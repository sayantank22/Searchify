const dbx = require('../config/config');

const textExtract = require('./textExtractHandler');

async function fileIndexHandler(path = '') {
    return await dbx
        .filesListFolder({ path })
        .then((fileList) => {
            fileList.result.entries.forEach((file) => {
                if (file['.tag'] === 'folder') {
                    return fileIndexHandler(file.path_display);
                }

                dbx.filesDownload({ path: file.path_display })
                    .then((fileInfo) => {
                        const blob = fileInfo.result.fileBinary;
                        const index = 'files';
                        const id = file.id;
                        const fileName = file.name;

                        dbx.sharingCreateSharedLinkWithSettings({
                            path: id,
                        })
                            .then((createdSharedFileLink) => {
                                const url =
                                    createdSharedFileLink.result.links[0].url;
                                textExtract(id, index, blob, url, fileName);
                            })
                            .catch((err) => {
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
