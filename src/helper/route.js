const promisify = require('util').promisify;
const fs = require('fs');
const stat = promisify(fs.stat);
const readDir = promisify(fs.readdir);
module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        if (stats.isFile()){
            fs.createReadStream(filePath).pipe(res);
        }else if (stats.isDirectory()) {
            const files = await readDir(filePath);
            res.end(files.join(','));
        }
    } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not found`);
    }
}
