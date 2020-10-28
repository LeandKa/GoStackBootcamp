const csvParse = require('csv-parser');
const fs = require('fs');
const path = require('path');


function loadCSV(filePath) {
    fs.createReadStream(filePath)
        .pipe(filePath)
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
        })
}

module.exports = loadCSV