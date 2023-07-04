const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');


const S3Config = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
    region: process.env.S3_BUCKET_REGION
});

const s3Storage = multerS3({
    s3: S3Config,
    bucket: process.env.S3_BUCKET_NAME,
    key: (request, file, callback) => {
        //console.log("UPLOAD: ", request.file);
        const fileName = Date.now() + "_" + file.originalname;
        callback(null, fileName);
    }
});
const upload = multer({ storage: s3Storage });
module.exports = upload;



