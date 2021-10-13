const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");

const port = 8000;
const responsedelay = 50; // miliseconds

// static folders
app.use(express.static("public"));
app.use(express.static("userfiles"));
app.use(express.static("view"));

// home page
app.get("/", function (req, res) {
  res.sendFile("index.html");
});

// upload handler
var uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./userfiles/${req.query.type}`); ///${req.folder}`);
  },
  filename: function (req, file, cb) {
    //let fileName = checkFileExistense(req.query.folder ,file.originalname);
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: uploadStorage });

app.post("/", upload.single("file"), function (req, res) {
  console.log(req.file);
  console.log("file upload...");
});

// all type of files except images will explored here
app.post("/files-list", function (req, res) {
  let folder = req.query.folder;
  let contents = "";

  let readingdirectory = `./userfiles/${folder}`;

  fs.readdir(readingdirectory, function (err, files) {
    if (err) {
      console.log(err);
    } else if (files.length > 0) {
      files.forEach(function (value, index, array) {
        fs.stat(`${readingdirectory}/${value}`, function (err, stats) {
          let filesize = ConvertSize(stats.size);
          contents +=
            '<tr><td><a href="/' +
            folder +
            "/" +
            encodeURI(value) +
            '">' +
            value +
            "</a></td><td>" +
            filesize +
            "</td><td>/" +
            folder +
            "/" +
            value +
            "</td></tr>" +
            "\n";

          if (index == array.length - 1) {
            setTimeout(function () {
              res.send(contents);
            }, responsedelay);
          }
        });
      });
    } else {
      setTimeout(function () {
        res.send(contents);
      }, responsedelay);
    }
  });
});

/**
 * it gives a number as byte and convert it to KB, MB and GB (depends on file size) and return the result as string.
 * @param number file size in Byte
 */
function ConvertSize(number) {
  if (number <= 1024) {
    return `${number} Byte`;
  } else if (number > 1024 && number <= 1048576) {
    return (number / 1024).toPrecision(3) + " KB";
  } else if (number > 1048576 && number <= 1073741824) {
    return (number / 1048576).toPrecision(3) + " MB";
  } else if (number > 1073741824 && number <= 1099511627776) {
    return (number / 1073741824).toPrecision(3) + " GB";
  }
}

// start server
app.listen(port, function () {
  console.log(`Server is started on port: ${port}`);
});
