const express = require('express');
const { upload, getGFS } = require('../config/configureStorage');

const router = new express.Router()

router.get('/', (req, res) => {
    getGFS().files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
        res.render('index', { files: false });
        } else {
        files.map(file => {
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                file.isImage = true;
            } else {
                file.isImage = false;
            }
        });
        res.render('index', { files: files });
        }
    });
});

// Use the input type name you used in the form instead of 'file'
router.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/')
});

router.get('/files', (req, res) => {
    getGFS().files.find().toArray((err, files) => {
        if(!files || files.length === 0) {
            return res.status(404).json({
                error: 'No files exist'
            });
        }
        return res.json(files);
    })
});

router.get('/files/:filename', (req, res) => {
    getGFS().files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file) {
            return res.status(404).json({
                error: 'No file exists'
            });
        }
        return res.json(file);
    })
});

router.get('/view/:filename', (req, res) => {
    getGFS().files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                error: 'No file exists'
            });
        }
        const readstream = getGFS().createReadStream(file.filename);
        readstream.pipe(res);
    });
});

router.delete('/files/:id', (req, res) => {
    getGFS().remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ error: err });
        }
        res.redirect('/');
      });
});

module.exports = router