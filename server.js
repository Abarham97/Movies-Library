"use strict";
let express = require("express");  //to require all express inside the variable Express

let axios = require("axios");//to require all axios inside the variable axios

let pg= require("pg");

let app = express();// to make app access express functions 

app.use(express.json());

let movieData =require ("./data.json");//requir JSON data to variable
require("dotenv").config();
const url=process.env.DATABASE_URL;
const port=process.env.PORT;
const {Client}=require('pg');
const client=new Client(url);

client.connect().then(() => {

    app.listen(port, () => {
        console.log(`Server is listening ${port}`);
    });
})

function startingLogs(req, res) {

    console.log("Running");
}//startingLogs function





// app.listen(3000, startingLogs);//to start our Server




function notFound(req,res){
res.send({
    code:404,
    message:"Sorry, something went wrong"
})
}//not found function

function  Movie(id,title,release_date,poster_path,overview){
this.id=id;
this.title=title;
this.release_date=release_date;
this.poster_path=poster_path;
this.overview=overview;

   
}//Constructor

app.post("/addMovie", (req, res) => {
   
    let Name = req.body.Name;
    let release_date = req.body.release_date;
    let overview = req.body.overview;
    let poster_path=req.body.poster_path;
    let sql = `insert into movie(Name,release_date,poster_path,overview) values($1,$2,$3,$4)`;
  client.query(sql, [ Name, release_date,poster_path, overview]).then(() => {
    res.status(201).send(`movie ${Name} added to database`);
  });

});



app.get("/getAllMovie", (req, res) => {
  
    let sql = `SELECT * From movie`;
    client.query(sql).then((movieData) => {
      res.status(200).send(movieData.rows);
    });
  });
  app.get("/getOneMovie/:id", (req, res) => {
    let id = req.query.id;
    let sql = `SELECT * From movie where id=${req.params.id}`;
    client.query(sql).then((movieData) => {
      res.status(200).send(movieData.rows);
    });
  });


  app.put("/updateMovie/:id", (req, res) => {
    let { newOverview } = req.body.overview;
    let sqlOne = `SELECT * FROM movie WHERE id=${req.params.id}`;
  
    client.query(sqlOne).then((movieData) => {
      const {Name,release_date,poster_path,overview} = movieData.rows[0];
      let sqlTwo = ` UPDATE movie SET overview=$1 WHERE id=${req.params.id}`;


      client.query(sqlTwo, [overview+newOverview]).then((data) => {
        res.status(200).send(`Updated`);
      });
    
    });
  });
//update

  app.delete("/deleteMovie/:id", async (req, res) => {
    try {
      let { id } = req.params;
      let sql = `DELETE FROM movie WHERE id =${req.params.id}`;
      let data = await client.query(sql);
      res.status(204).end();
    } catch (e) {
      next("deletemovie " + e);
    }
  });


  



function handelAllMovie(req,res){
    let movie= new Movie(movieData.overview,movieData.poster_path,movieData.overview);
    
    res.send(movie);


}//function handelAllMovie

async function handleAllTrending (req,res){

    let response = await axios({url:"https://api.themoviedb.org/3/trending/all/week?api_key=0f6a06711e855e209abf2719cd7eedb5&language=en-US"});
    // console.log(response);
   let resolved= response.data.results.map(data=>new Movie(data.id,data.title,data.release_date,data.poster_path,data.overview));
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.send(resolved);


    // console.log(response);



}//function handleAllTrending


async function searchMovie(req,res){
      
    
    let search = await axios({url:`https://api.themoviedb.org/3/search/movie?api_key=0f6a06711e855e209abf2719cd7eedb5&language=en-US&query=${req.query.name}&page=2`})
    let resolved= search.data.results.map(data=>new Movie(data.id,data.title,data.release_date,data.poster_path,data.overview));
    res.send(resolved);
    // console.log(req.query);


}

async function getMovieById(req,res){

  let movie= await axios({url:`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=0f6a06711e855e209abf2719cd7eedb5`})
  console.log(movie);
  let data=movie.data;
  let resolved= new Movie(data.id,data.title,data.release_date,data.poster_path,data.overview);
  res.send(resolved);
  
  
//   console.log(req.query);

}


app.use(cors());
    


function favoritePage(req,res){

    res.send("Welcome to Favorite Page")
}//favoritePage function



//localhost:3000/home
app.get('/home', handelAllMovie)//Home Route

app.get("/favorite",favoritePage)
//localhost:3000/trending
app.get("/trending",handleAllTrending)
//localhost:3000/search
app.get("/search",searchMovie)
//localhost:3000/movie/id
app.get("/movie/:id",getMovieById)



//localhost:3000/any
app.get('*',notFound);//no specific route


