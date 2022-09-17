const fs = require('fs');
const path = require('path')

const deleteFile = (file) =>{
    const filePath =  path.join(file)
    fs.unlink(filePath, err =>{
       if(err){
        throw err;
       }
    })
}

module.exports = deleteFile;