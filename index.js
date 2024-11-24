const express = require('express')
const fs = require('fs');
const path = require('path');

const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => res.sendfile('public/main_eng.html'))

function isImage(filename) {
    return filename.match(/\.(jpg|jpeg|png|gif)$/i);
}

function isVideo(filename) {
    return filename.match(/\.(mp4|avi|mkv|mov|webm|flv|wmv|mpeg|mpg)$/i);
}

app.get('/view_image', (req, res) => {
    console.log(req.query);
    const filename = req.query.filename;
    const filePath = path.join(__dirname, 'public/members', filename);
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    if (isImage(filename)) {
        return res.redirect(307, `https://www.google.com/search?q=${filename}&udm=2`);
    }
    if (isVideo(filename)) {
        return res.redirect(307, `https://www.youtube.com/results?search_query=${filename}`);
    }
    return res.sendfile('public/404.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
