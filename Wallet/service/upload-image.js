const multer  = require('multer');
const path    = require('path')
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename   : function (req, file, cb) {
        const ext = path.extname(file.originalname);
	cb(null,path.basename(file.originalname, ext) + Date.now() + ext)
}
});
const upload = multer({ storage: storage })

exports.single = upload.single('img')
exports.multa  = upload.array('img')

exports.uploads = (req, res, next) => {
    // #swagger.tags = ['upload']
    try{
    res.status(200).send({
        message: '변환성공',
        value:  req.file
    })}catch(err){
        console.error(err)
    }
}

exports.multi_uploads = (req, res, next) => {
    // #swagger.tags = ['upload']

    req.files.map((data) => {
        console.log(data);
    });
    
    res.status(200).send({
        message: "변환 성공",
        value: req.files
    })
}