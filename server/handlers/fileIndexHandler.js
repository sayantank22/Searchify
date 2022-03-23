const dbx = require('../config/config');

const textExtract = require('./textExtractHandler');

async function fileIndexHandler(path = '') {
    const fileList = await dbx.filesListFolder({ path });

    const filesDownloadPromises = [];
    const ids = [];
    const fileNames = [];

    for (const file of fileList.result.entries) {
        if (file['.tag'] === 'folder') {
            return await fileIndexHandler(file.path_display);
        }
        ids.push(file.id);
        fileNames.push(file.name);

        filesDownloadPromises.push(
            dbx.filesDownload({ path: file.path_display })
        );
    }

    const downloadResults = await Promise.all(filesDownloadPromises);

    const sharedLinkPromises = [];
    const blobs = [];

    downloadResults.forEach((fileInfo, i) => {
        blobs.push(fileInfo.result.fileBinary);

        sharedLinkPromises.push(
            dbx.sharingCreateSharedLinkWithSettings({
                path: fileList.result.entries[i].id,
            })
        );
    });

    let createSharedFileLinkPromises = [];
    let getSharedFileLinksPromises = [];

    let sharedLinkStatus = await Promise.allSettled(sharedLinkPromises);

    sharedLinkStatus.map((promise, i) => {
        if (promise.status === 'fulfilled') {
            createSharedFileLinkPromises.push(promise);
        } else {
            getSharedFileLinksPromises.push(
                dbx.sharingListSharedLinks({
                    path: fileList.result.entries[i].id,
                    direct_only: true,
                })
            );
        }
    });

    const createSharedFileLinks = await Promise.all(
        createSharedFileLinkPromises
    );

    const getSharedFileLinks = await Promise.all(getSharedFileLinksPromises);

    for (let i = 0; i < getSharedFileLinks.length; i++) {
        const url = getSharedFileLinks[i].result.links[0].url;
        textExtract(ids[i], 'files', blobs[i], url, fileNames[i]);
    }

    for (let i = 0; i < createSharedFileLinks.length; i++) {
        const url = createSharedFileLinks[i].result.links[0].url;
        textExtract(ids[i], 'files', blobs[i], url, fileNames[i]);
    }

    return 'Files indexed successfully!';
}

module.exports = fileIndexHandler;
