const dbx = require('../config/config');

const textExtract = require('./textExtractHandler');

const indexFiles = async function (fileList) {
    const filesDownloadPromises = [];
    const ids = [];
    const fileNames = [];

    for (const file of fileList.result.entries) {
        if (file['.tag'] === 'file') {
            ids.push(file.id);
            fileNames.push(file.name);

            filesDownloadPromises.push(
                dbx.filesDownload({ path: file.path_display })
            );
        }
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

    const createSharedFileLinkPromises = [];
    const getSharedFileLinksPromises = [];

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
        const url = getSharedFileLinks[i].result?.links[0].url;
        await textExtract(ids[i], 'files', blobs[i], url, fileNames[i]);
    }

    for (let i = 0; i < createSharedFileLinks.length; i++) {
        const url = createSharedFileLinks[i].result?.links[0].url;
        await textExtract(ids[i], 'files', blobs[i], url, fileNames[i]);
    }
};

const getMoreFiles = async function (cursor, cb) {
    const res = await dbx.filesListFolderContinue({ cursor });

    if (cb) {
        await cb(res);
    }

    if (res.result.has_more) {
        await getMoreFiles(res.result.cursor, cb);
    }
};

async function fileIndexHandler(path = '') {
    const fileList = await dbx.filesListFolder({
        path,
        recursive: true,
        limit: 10,
    });

    await indexFiles(fileList);

    if (fileList.result.has_more) {
        await getMoreFiles(fileList.result.cursor, indexFiles);
        return 'Files indexed successfully!';
    }
}

module.exports = fileIndexHandler;
