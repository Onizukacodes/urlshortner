import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser());

const DB_PATH = "./db/db.json";

function writingFile(path, data) {
  data = JSON.stringify(data);
  fs.writeFile(path, data, (err) => console.log(err));
}
app.use(express.static("build"));

app.get("/*", (req, res) => {
  let urlId = req.originalUrl.split("/")[1];
  console.log("asdasdasd", urlId);
  fs.readFile(DB_PATH, (err, data) => {
    data = JSON.parse(data);
    let realUrl = data.filter((item) => item[urlId]);
    if (realUrl) res.redirect(realUrl[0][urlId]);
  });
});

app.post("/short-url", (req, res) => {
  let fullUrl = req.protocol + "://" + req.get("host");
  let randomString = Math.random().toString(36).substring(7);
  let urlObj = { [randomString]: req.body.url };
  fs.readFile(DB_PATH, (err, data) => {
    if (Object.keys(data).length <= 0) {
      writingFile(DB_PATH, [urlObj]);
    } else {
      data = JSON.parse(data);
      let newData = [...data, urlObj];
      writingFile(DB_PATH, newData);
    }
    res.status(200).json({ url: `${fullUrl}/${randomString}` });
  });
});

app.listen(5001, console.log("running on 5000"));
