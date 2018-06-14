const {createGzip, createDeflate} = require('zlib');

module.exports = (req, res, rs) => {
    const ReqAcceptEncoding = req.headers['accept-encoding'];
    if (!ReqAcceptEncoding || !ReqAcceptEncoding.match(/\b(gzip|deflate)\b/)) {
      return rs;
    } else if (ReqAcceptEncoding.match(/\bgzip\b/)) {
      res.setHeader('Content-Encoding', 'gzip');
      return rs.pipe(createGzip());
    } else if (ReqAcceptEncoding.match(/\bdeflate\b/)) {
      res.setHeader('Content-Encoding', 'deflate');
      return rs.pipe(createDeflate());
    }
};
