
var express =require('express')
var path=require('path')
var helmet=require('helmet')
var router=express()
var methodoverride=require('method-override')
const cookieParser=require('cookie-parser')
const request=require('request')
router.use(cookieParser())
router.use(methodoverride('_method'))
var ejs=require('ejs')
const { Body } = require('node-fetch')
router.use(express.static('public'))
router.use(express.static(__dirname + '/public'));
router.use(express.json())
router.use(express.urlencoded({extended:false}))
router.set('view engine','ejs')
router.set('views',path.join(__dirname,'views'))
router.use(helmet())
var nowPlayingUrl="http://www.omdbapi.com/?apikey=f637d5ba&s=%27titanic%27"
//http://www.omdbapi.com/?i=tt3896198&apikey=f637d5ba
var mongoose=require('mongoose')
//connect to the DB
mongoose.connect('mongodb://localhost:27017/campgroundDB')


var campgroundsschema=new mongoose.Schema({
   name: String,
   image:String,
   description:String
})
var campground=mongoose.model('campgrounds',campgroundsschema)
/*
campground.create({
name:'salmon creek',
image:"https://pixabay.com/get/g3002c894297bb99eb7bfbeae42894ecc6fdd1d5050b3c09d065458b95242f7c2f4b52a6aa7d7083a272dca62befdd360_340.png"
},function(err,campground)
{
   if(err)
   {
      console.log(err)
   }
   else{
      console.log('newly created campgrounds')
   }
}y

)
*/

router.put('/campgrounds/:id',function(req,res,next){


   campground.findByIdAndUpdate(req.params.id,{name:req.body.name},function(err,update){

if(err){
   res.redirect('/campgrounds')
}
else{
   console.log()
   res.redirect('/campground/'+req.params.id)
}

   })
  // res.send('put')
})


router.get('/',function(req,res,next){
 res.render('landing')
   
})
router.get('/campground/:id',function(req,res,next){

   campground.findById(req.params.id,function(err,foundcamp){
if(err)
{
   console.log(err)
}
else{
res.render('show',{campground:foundcamp})

}

   })
     
  })


router.post('/campgrounds/new',function(req,res,next){
       const name=req.body.name
       const image=req.body.image
       const desc=req.body.desc
       const names={name:name,image:image,desc:desc}

       campground.create(names,function(err,newlycreated)
       {
if(err)
{
   console.log(err)
}
else{
        res.redirect('/campgrounds')
}
       })
       
   
})

router.get('/campgrounds/new',function(req,res,next){
    
 res.render('form')
   
})


router.get('/campground/:id/edit',function(req,res,next){
   campground.findById(req.params.id,function(err,foundsite){
if(err)
{
   res.send(req.params.id)
}
else{
   res.render('edit',{campground:foundsite})
}


   }) 

   

  })
  





router.get('/campgrounds',function(req,res,next){
campground.find({},function(err,campground)
{
   if(err){
      console.log(err)
   }
   else{
      res.render('welcome',{
         	campgrounds:campground
      })
   }
}
)






})
router.listen(3000)