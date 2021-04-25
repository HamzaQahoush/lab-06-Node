'use strict';

const express= require('express');
const server=express();
require('dotenv').config();
const cors=require('cors');


const PORT= process.env.PORT || 5000;
server.use(cors());


server.get('/test', (req,res)=>{
  res.send('This is test page ');
});

server.get('/location', (req,res)=>{
  let locationData= require('./data/location.json');

  let locationRes= new Location(locationData);
  console.log(locationRes);
  res.send(locationRes);

});

function Location(data){
  this.search_query='Lynnwood';
  this.formatted_query=data[0].display_name;
  this.latitude=data[0].lat;
  this.longitude=data[0].lon;

}


server.get('/weather', (req,res)=>{
  let weatherData= require('./data/weather.json').data;
  let allWeather=[];
  weatherData.forEach((item) => {
    let weatherRes= new Weather(item);
    allWeather.push(weatherRes);
  });

  res.send(allWeather);
});

function Weather(dataW){
  this.forecast=dataW.weather.description ;
  this.time =convertDate(dataW.datetime);

}

function convertDate(d){
  let date = new Date (d);

  date = date.toDateString();


  return date;

}


server.get('*' , (req, res)=>{
  let objError = {
    status: 500,
    responseText: 'Sorry, something went wrong',
  };
  res.status(500).send(objError);
});

server.listen(PORT ,()=>{
  console.log(`Listening to port ${PORT}`);
});
