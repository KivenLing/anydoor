const promisify = require('util').promisify;
const fs = require('fs');
const stat = promisify(fs.stat);
const readDir = promisify(fs.readdir);
const path = require('path');
const Handlebars = require('handlebars');
const conf = require('../config/defaultConfig');
const compress = require('./compress');
//除require外，尽量用绝对路径，因为许多相对路径指执行命令的路径
const tplPath = path.join(__dirname, '../template/dir.tpl');
//这里用同步，原因返回的模板在node启动时加载
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const mime = require('./mime');
module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        res.statusCode = 200;
        if (stats.isFile()){
            const contentType = mime(filePath);
            res.setHeader('Content-Type', contentType);
            let rs = fs.createReadStream(filePath);
            if (filePath.match(conf.compress)) {
                //压缩
                rs = compress(req, res, rs);
            }
            rs.pipe(res);
        }else if (stats.isDirectory()) {
            res.setHeader('Content-Type', 'text/html');
            const files = await readDir(filePath);
            const dir = path.relative(conf.root, filePath);
            const data = {
                title: path.basename(filePath),
                files: files,
                dir: dir ?  `/${dir}` : ''
            }
            res.end(template(data));
        }
    } catch (error) {
        res.statusCode = 404;
        res.end(`${filePath} is not found  ${error}`);
    }
};
