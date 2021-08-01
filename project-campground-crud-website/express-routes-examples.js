var express=require("express")
var exphbs=require("express-handlebars")
var app=express()
var path=require("path")
var mongoose=require("mongoose")
const session=require("express-session")
const bodyparser=require("body-parser")
var methodoverride=require("method-override")
const flash=require("connect-flash")
const users=require("./routes/users")
mongoose.connect("mongodb://localhost:27017/hbs")

app.use(bodyparser.urlencoded({
	
	extended:true
}))
app.use(methodoverride('_method'))
app.use(users)
var hbschema=mongoose.model("emphbs",
{
title:{
	type:String
},
name:{
	type:String
}
}
)
app.engine("handlebars",exphbs({defaultLayout:"main"}))
//const idea=mongoose.model("emphbs")
app.set("view engine","handlebars")
app.get("/edit/:id",function(req,res)
{

	hbschema.findOne({"_id":req.params.id})
	.then(data=>{
	res.render("edit",{
	id:data
	})
})
})

app.use(express.static(path.join(__dirname,"public")))

app.use(session({
	secret:"cat",
	resave:true,
	saveUnitializedd:true,
}))
app.use(flash())

app.use(function(req,res,next){
res.locals.success_msg=req.flash("success_msg")
res.locals.error_msg=req.flash("error_msg")
res.locals.error=req.flash("error")
next()
})

app.get("/ideas",function(req,res)
{
hbschema.find({})
.then(ideas=>{
	
	res.render("ideas",{
	ideas:ideas
		
	})
})

})
app.put("/ideas/:id",(req,res)=>{
	
	res.send("PUT")
	//console.log("put")
	hbschema.findOne({
		_id:req.params.id
	})
.then(data=>{
	
	data.title=req.body.title;
	data.name=req.body.name;
	
	data.save()
	.then(data=>{
		res.redirect("/ideas")
		
	})
})
})
app.delete("/ideas/:id",function(req,res)
{
	//res.send("delete")
	hbschema.remove({_id:req.params.id})
	.then(()=>{
		
		res.redirect("/ideas")
		res.flash("success_msg","video idea removed")
	})
	
	
})



app.post("/contact",function(req,res)
{
	let errors=[];
	
	if(!req.body.title)
	{
		errors.push({text:"please enter title"})
		
	}
	if(!req.body.name)
	{
		errors.push({text:"please enter name"})	
	}
	var newdata=new hbschema()
	newdata.title=req.body.title
	newdata.name=req.body.name
    if(errors.length>0)
	{
	res.render("add",{
		errors:errors,
		title:req.body.title,
		name:req.body.name	
	})
	}
	else
	{
	newdata.save(function(err,data)
	{
		res.redirect("/ideas")
	})
	}
})
app.get("/add",function(req,res)
{
res.render('add')
})
app.listen(4000,function(req,res)
{
console.log("connected")	
})