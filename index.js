// import the needed dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
// set up the express server
const app = express();
const port = 3000;
// set up express to serve the static files
app.use(express.static("html"));
app.use(express.static("css"));
app.use(express.static("imgs"));
// serve the main_eng.html file as defult
app.get("/", (req, res) => res.sendfile("html/main_eng.html"));
// function to check if the file is image
function isImage(filename) {
  return filename.match(/\.(jpg|jpeg|png|gif)$/i);
}
// function to check if the file is image
function isVideo(filename) {
  return filename.match(/\.(mp4|avi|mkv|mov|webm|flv|wmv|mpeg|mpg)$/i);
}
// handle the search request
app.get("/view_image", (req, res) => {
  const filename = req.query.filename;
  // send file if exist in file system
  const folders = ["html","imgs", "css"];
  for(let i=0; i<3;i++){
    const filePath = path.join(__dirname, folders[i], filename);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  
  if(filename.match(/\.(html|css)$/i)){
    return res.sendFile(filePath);
  }
  // if it is an image redirect with 307 status response to google with the searched file
  if (isImage(filename)) {
    return res.redirect(
      307,
      `https://www.google.com/search?q=${filename}&udm=2`
    );
  }
  // if it is an video redirect with 307 status response to youtube with the searched file
  if (isVideo(filename)) {
    return res.redirect(
      307,
      `https://www.youtube.com/results?search_query=${filename}`
    );
  }
  // replace client ip and port in the 404.html page
  const file404 = fs
    .readFileSync("html/404.html", { encoding: "utf8", flag: "r" })
    .replace("[CLIENT_IP]", req.ip)
    .replace("[CLIENT_PORT]", port);
  // send the response and end it
  return res.send(file404).end();
});
// listen to the port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
