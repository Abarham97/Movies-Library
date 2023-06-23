"use strict";
let express = require("express");  //to require all express inside the variable Express

let app = express();// to make app access express functions 

let movieData =require ("./data.json");//requir JSON data to variable

function startingLogs(req, res) {

    console.log("Running");
}//startingLogs function


app.listen(3000, startingLogs);//to start our Server



function notFound(req,res){
res.send({
    code:404,
    message:"Sorry, something went wrong"
})
}//not found function

function handelAllMovie(req,res){


    let newArray=[];
    newArray.push(movieData.title)
    newArray.push(movieData.poster_path)
    newArray.push(movieData.overview)
    console.log("allmovieData");
    res.send(newArray);

}//Function HandelAllMovie

function favoritePage(req,res){

    res.send("Welcome to Favorite Page")
}//favoritePage function

//localhost:3000/home
app.get('/home', handelAllMovie)//Home Route

app.get("/favorite",favoritePage)

//localhost:3000/any
app.get('*',notFound);//no specific route
