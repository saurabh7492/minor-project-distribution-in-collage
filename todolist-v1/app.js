const express = require('express');
const bodyparser = require('body-parser');
const app = express();
let items = ["Buy Food", "Cook Food", "Eat Food"];
let workitems = [];
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-us", options);
  res.render("list", {
    listtitle: day,
    newlistitems:items
  });
});
app.post("/", function(req, res) {
  //  console.log(req.body);
   let item = req.body.dolist;
  // items.push(item);
  // //console.log(req.body);
  // res.redirect("/");
  //     res.redirect("/");
  if (req.body.list == ' work List' ) {
    workitems.push(item);
    res.redirect("/work");
  } else {


    //let name=req.body.dolist;
    items.push(item);
    res.redirect("/");
  }
});
app.get("/work", function(req, res) {
  res.render("list", {
    listtitle: "work List",
    newlistitems: workitems
  });
})
// app.post("/work",function(req,res){
// let item =req.body.dolist;
// workitems.push(item);
// res.redirect("/work");
// })
app.get("/about",function(req,res){
  res.render("about");
});
app.listen(3000, function() {
  console.log("3000 server work properly")
});
