const fileSystem = require('fs');

const deleteFile = (filePath) => {
    fileSystem.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
};

exports.deleteFile = deleteFile;