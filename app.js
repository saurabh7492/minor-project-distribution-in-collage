const  express =require("express");
const bodyParser = require("body-parser");
const _=require("lodash");
const mongoose = require('mongoose');
const ejs=require("ejs");
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
 secret:" our little secret",
 resave:false,
 saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/projectDB");
const faculityDB=mongoose.createConnection("mongodb://localhost:27017/faculityDB");
 const studentformDB=mongoose.createConnection("mongodb://localhost:27017/studentformDB");
 const faculitySchema =new mongoose.Schema({
   email:String,
   password:String
 });
faculitySchema.plugin(passportLocalMongoose);
const Faculitydetail=faculityDB.model("Faculitydetail",faculitySchema);
const projectSchema= new mongoose.Schema({
 faculitySchema:String,
 Degination:String,
 // faculitymobilenumber:String,
 ProjectTitle:String,
 briefDescription:String,
 objectiveProject:String,
 skillRequired:String,
 studentdetail:[
   {
     name1:String,
     name2:String,
     mobilenumber:String
   }
 ],
  facultyId: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculitydetail'},
})
// const faculitySchema =new mongoose.Schema({
//   email:String,
//   password:String,
//
// });
// const studentFormSchema =new mongoose.Schema({
// name1:String,
//  name2:String,
//  mobilenumber:String
//
// });
//faculitySchema.plugin(passportLocalMongoose);
//const Faculitydetail=faculityDB.model("Faculitydetail",faculitySchema);
const Projectdetail=mongoose.model("Projectdetail",projectSchema);
//const Faculitydetail=faculityDB.model("Faculitydetail",faculitySchema);
//const Studentformdetail=studentformDB.model("Studentformdetail",studentFormSchema);
passport.use(Faculitydetail.createStrategy());
passport.serializeUser(Faculitydetail.serializeUser());
passport.deserializeUser(Faculitydetail.deserializeUser());
app.get("/faculity",function(req,res){
 if(req.isAuthenticated()){
   console.log(req.user);
 Faculitydetail.find({},function(err,email){

   res.render("faculity")
 })

 }
 else{
   res.redirect("/login")
 }
})
app.get("/student",function(req,res){
  console.log("user " ,req.user)
 Projectdetail.find({},function(err,posts){
   res.render("student",{
     posts:posts
   });
 });

})
app.get("/register",function(req,res){
res.render("register")
})
app.get("/login",function(req,res){
 res.render("login");
})
app.get("/dashbord",function(req,res){
  console.log("User", req.user);
Projectdetail.find({facultyId:req.user._id},function(err,posts){
  //console.log(req.user._id)
    console.log(posts);
    res.render("dashbord",{
     posts:posts
    });
  });
})
app.get("/admin",function(req,res){
  console.log(req.user);
  Projectdetail.find({},function(err,posts){
    res.render("admin",{
      posts:posts
    });
  })
})
app.post("/",function(req,res){
 const project= new  Projectdetail(
   {
 faculitySchema:req.body.faculitySchema,
 Degination:req.body.deg,
 ProjectTitle:req.body.ptitle,
 briefDescription:req.body.bd,
 objectiveProject:req.body.OProject,
 skillRequired:req.body.skillRequired,
 faculitymobilenumber:req.body.tel,
  facultyId :req.user._id
 }
)
project.save()
})
// app.post("/register",function(req,res){
//   const faculity =new Faculitydetail({
//     email:req.body.email,
//     password:req.body.password,
//     mobilenumber:req.body.mnumber
//   }
// )
//   faculity.save(function(err){
//     if(!err){
//       res.redirect("/")
//     }
//     else{
//       console.log(err);
//     }
//   })
// })
// app.post("/register",function(req,res){
//   Faculitydetail.register({email:req.body.email},req.body.password,function(err,user){
//     if(err){
//       console.log(err);
//       res.redirect("/register")
//     }else{
//     passport.authenticate("local")(req,res,function(){
//       res.redirect("/faculity");
//     });
//   }
// });
// });
app.post("/register",function(req,res){
 Faculitydetail.register({username:req.body.username},req.body.password,function(err,user){
   if(err){
     console.log(err);
     res.redirect("/register");
   }
   else{
     passport.authenticate("local")(req,res,function(){
       res.redirect("/faculity");
     })
   }
 })
})
// app.post("/login",function(req,res){
//
//   const username=req.body.username,
//   const password=req.body.password
//
//
// Faculitydetail.findOne(
//   {email:username},
//   function(err,foundUser){
//     if(err){
//       console.log(err)
//     }
//     else{
//       if(foundUser){
//         if(foundUser.password===password){
//           res.render("faculity")
//            }
//       }
//     }
//   }
// )
// })



app.post("/login",function(req,res){
 const user =new Faculitydetail({
   username:req.body.username,
   password:req.body.password
 })
 req.login(user,function(err){
   if(err){
     console.log(err);
   }
   else{
     passport.authenticate("local")(req,res,function(){
      //window.localStorage.setItem("_id",Faculitydetail._id)
       res.redirect("/faculity")
     })
   }
 })
})
// app.post("/studentpost",function(req,res){
//     const checkeditemid=  req.body.checkbox;
//    // const studentname1=req.body.name1;
//    // const studentname2=req.body.name2;
//    // const mobilenumber=req.body.mobilenumber
//    console.log(checkeditemid);
//  Faculitydetail.findOneAndUpdate( {_id:checkeditemid},
//
//     { $push:{
//         studentdetail:{
//     name1:req.body.name1,
//     name2:req.body.name2,
//     mobilenumber:req.body.mobilenumber
//    }
//  }
// },
// {safe:true},
// function (err, response) {
//          if (err) throw err;
//          res.json(response);
//      })
// })
app.post("/studentpost", async function(req,res){
try{
    const checkeditemid=  req.body.checkbox;
   // const studentname1=req.body.name1;
   // const studentname2=req.body.name2;
   // const mobilenumber=req.body.mobilenumber
   console.log(checkeditemid);
const faculty  = await  Projectdetail.findOne( { _id: checkeditemid });
console.log(faculty)
faculty.studentdetail.push({
name1:req.body.name1,
    name2:req.body.name2,
    mobilenumber:req.body.mobilenumber
})
await faculty.save()
res.send({message:'success'})
}
catch(err)
{
res.json(err)
}
})
 app.post("/faculitysubmit",function(req,res){
   const projectrejectid=req.body.rejected;
   const projectacceptid=req.body.accept;
   //const name =req.body.name;
   //console.log(projectrejectid);
   console.log(projectacceptid);
   console.log(req.body.rejected);
   //console.log(req.body.hasOwnProperty("accept")==true);
   if(req.body.hasOwnProperty("accept")==true){
     try{

     const faculty  =  Projectdetail.findOne( { _id: projectrejectid });
     console.log(faculty)
     faculty.push({
     value:true
     })
      faculty.save()

     }
     catch(err)
     {
     res.json(err)
     }
 }
   else{

    Projectdetail.update(
      {_id:projectrejectid},
      {
        $set:
          { studentdetail: {name1:"jaai"} }


      }
    )


   }

  })

app.post("/adminsubmit",  function(req,res){
      const projectvalue=  req.body.button;
  Projectdetail.update(
    {
      "_id"  : projectvalue,

    },
    {
       "$set":
      {

        studentdetail: [{
          name1:req.body.name1,
          name2:req.body.name2,
          mobilenumber:req.body.mobilenumber
        }]
        // 'studentdetail.$.[0].name1':req.body.name1,
        // 'studentdetail.$.[0].name2':req.body.name2,
        // 'studentdetail.$.[0].mobilenumber':req.body.mobilenumber

      }
    }, (err)=>{
      if(err){
        console.log(err);
      }else{console.log("SUccessful");}
    }

 )
  // Projectdetail.update({_id:{$eq:projectvalue}},
  //   {
  //   $set:
  //       {
  //         "studentdetail.$.name1":req.body.name1,
  //         "studentdetail.$.name2":req.body.name2,
  //         "studentdetail.$.mobilenumber":req.body.mobilenumber
  //
  //       }
  //     }
  //
  // )
});
app.listen(3000,function(){
 console.log("server run successfully 3000");
})
