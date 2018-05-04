/**
 * Created by Jason Gonzales on 5/3/18.
 */

const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
});

module.exports = app => {

    app.get('/api/upload', requireLogin ,(req, res) => {

        const key = `${req.user.id}/${uuid()}.jpg`;

        s3.getSignedUrl('putObject',{
          Bucket: 'jason-blog-bucket-123',
          ContentType: 'image/jpeg',
          Key: key

        }, (err, url) => {
            console.log(err);
            res.send({ key, url });
        })
    });

}