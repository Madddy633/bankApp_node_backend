const req = require("express/lib/request");
const { status } = require("express/lib/response");
//import jsonwebtoken
const jwt=require('jsonwebtoken')
//import db
const db= require('./db')

//creating a data base
database = {
    1000: { acno: 1000, uname: "neer", password: 1000, balance: 5000 ,transaction:[]},
    1001: { acno: 1001, uname: "neel", password: 1001, balance: 50000,transaction:[] },
    1002: { acno: 1002, uname: "neev", password: 1002, balance: 500000,transaction:[] }

  }

  //register
  const register=(uname, acno, password)=> {
//asynchronous function
return db.User.findOne({acno})
.then(user=>{
  console.log(user)

  if (user){
    return {
      statusCode:400,
      status:false,
      message:"acount number already exists....."
      
    }

  }
  else{
    const newUser= new db.User({
      acno,
      uname,
      password,
      balance:0,
      transaction: []
    })
    newUser.save()

    return{
      statusCode:200,
      status:true,
      message:"Successfuly registered....please login"
    }


    
    }
})


  }


  //login phase
  const login=(acno,pwd)=> {

    //database compare
    return db.User.findOne({acno,password:pwd})
    .then(user=>{
if(user){
     currentuser=user.uname
        currentacno=acno
  //token generate
       const token=jwt.sign({
         "currentacno":acno,
         
        },"secretstar");
  
        
        return{
          statusCode:200,
          status:true,
          message:"Successfuly logined....",
          token:token,
          currentacno,
          currentuser
        }
        
      
      
    }

    else {
     
      return {
        statusCode:401,
        status:false,
        message:"invalid credentials ....."
      }
    }

    })
  }


   
      
   


//Deposit
const deposit=(acno,pwd,amount)=> {
  var amt = parseInt(amount);
  return db.User.findOne({acno,password:pwd})
.then(user=>{


  if (user) {
    
      user.balance+= amt
      user.transaction.push({
        type:"CREDIT",
        amount:amount
        
      })
    user.save()
      
      return {
        statusCode:200,
        status:true,
        message:amt + " amount successfully deposited....new balance is :" +user.balance
      }
    }


    else {
     
      return {
        statusCode:401,
        status:false,
        message:"invalid credentials"
      }
    }

  })
}
 


//withdraw

const withdraw=(req,acno,pwd,amount)=> {

  var amt = parseInt(amount);
  return db.User.findOne({acno,password:pwd})
  .then(user=>{
        
          if (user) {
            if (amt < user.balance) {
            
              user.balance-= amt
              user.transaction.push({
                type:"Debit",
                amount:amount
                
              })
            user.save()
              
              return {
                statusCode:200,
                status:true,
                message:amt + " amount successfully debited....new balance is :" +user.balance
              }
            }
        
        
            else {
             
              return {
                statusCode:401,
                status:false,
                message:"no balance"
              }
            }
          }
          else {
             
            return {
              statusCode:401,
              status:false,
              message:"invalid credentials"
            }
          }
        
          })




}



//transaction history
const transactions=(acno)=>{
  return db.User.findOne({acno})
  .then(user=>{
  if(acno){
  return{
    statusCode:200,
    status:true,
     transaction:user.transaction
    }
}
else{
  return{
    statusCode:422,
    status:false,
    message:"invalid account number"
  }
}
})
}

//delete account
const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){

return{
    statusCode:401,
    status:false,
    message:"operation failed!!!!!"
  }
    }
    else{
      return{
        statusCode:200,
        status:true,
         message:"Account number "+acno+" deleted successfully"
        }
    }
  })
}


 //EXPORT-to use the functions,database,etc in another pages which import this page
  module.exports={
      register,
      login,
      deposit,
      withdraw,
      transactions,
      deleteAcc
  }
