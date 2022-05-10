//import express
require('express')
const express=require('express')
const res = require('express/lib/response')
const database=require('./services/dataservices')
//import jsonwebtoken
const jwt=require('jsonwebtoken')
const req = require('express/lib/request')

//import cors
const cors=require('cors')


//create a server
const app=express()
//to parse the json data
app.use(express.json())

//use cors

app.use(cors({
    origin:'http://localhost:4200'
}))

//resolving api calls
//GET-to read data
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})

//POST-to CREATE data
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})
const jwtmiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"]
        const data=jwt.verify(token,'secretstar')
        console.log(jwt.verify(token,'secretstar'));
        req.currentacno=data.currentacno
        next()

    }
    catch{
res.status(401).json({
    status:false,
    message:"please login" 
})
    }
}

//bank server

//register
app.post('/register',(req,res)=>{
    const result=database.register(req.body.uname,req.body.acno,req.body.password)
.then(result=>{ res.status(result.statusCode).json(result)})
})


//login
app.post('/login',(req,res)=>{
console.log(req.body.pwd,req.body.acno);
    const result=database.login(req.body.acno,req.body.pwd)
    .then(result=>{ res.status(result.statusCode).json(result)})
})


//deposit
app.post('/deposit',jwtmiddleware,(req,res)=>{
    const result=database.deposit(req.body.acno,req.body.pwd,req.body.amount)
    .then(result=>{ res.status(result.statusCode).json(result)})
})

//withdraw

app.post('/withdraw',jwtmiddleware,(req,res)=>{
    const result=database.withdraw(req,req.body.acno,req.body.pwd,req.body.amount)
    .then(result=>{ res.status(result.statusCode).json(result)})
})
//transaction history
app.post('/transactions',(req,res)=>{
    const result=database.transactions(req.body.acno)
    .then(result=>{ res.status(result.statusCode).json(result)})
})


//onDelete api
app.delete('/onDelete/:acno',jwtmiddleware,(req,res)=>{
    
    //if we share data with url parms is used
    database.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})


//PUT-toUPDATE/MODIFY data
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

//PATCH- to UPDATE/MODIFY partial data
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

//DELETE-to DELETE data
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})


//set port number
app.listen(3000,()=>{
    console.log("server started at 3000");
})