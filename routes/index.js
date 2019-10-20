const express = require('express');
const { upload, getGFS } = require('../config/configureStorage');

const router = new express.Router()

router.get('/', (req, res) => {
    res.render('index');
});

// Use the input type name you used in the form instead of 'file'
router.post('/upload', upload.single('file'), (req, res) => {
    res.json({ 
        message: "To view your file go to https://mongo-uploads-el.herokuapp.com/view/" + req.file.filename,
        file: req.file
    });
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