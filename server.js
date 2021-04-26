'use strict';

const express= require('express');
const server=express();
require('dotenv').config();
const cors=require('cors');
const superagent = require('superagent');


const PORT= process.env.PORT || 5000;
server.use(cors());

server.get('/', (req,res)=>{
  res.send('<h1> Welcome To Home Page </h1>');
});


server.get('/location', LocationHandler);
server.get('/weather', weatherHandler);
server.get('/parks' , parkHandler);
server.get('*' , notFound);

function LocationHandler (req,res){
  let cityName = req.query.city;

  let key = process.env.LOCATION_KEY;
  let locURL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;

  superagent.get(locURL)
    .then(geoData=>{

      let gData = geoData.body;
      let locationData = new Location(cityName,gData);
      res.send(locationData);

    })

    .catch(error=>{
      console.log(error);
      res.send(error);
    });
}

function Location(cityName,data){
  this.search_query=cityName;
  this.formatted_query=data[0].display_name;
  this.latitude=data[0].lat;
  this.longitude=data[0].lon;

}



function weatherHandler(req,res){
  let cityName=req.query.search_query;
  let key=process.env.WEATHER_key;
  let weatherURL= `http://api.weatherbit.io/v2.0/forecast/daily?key=${key}&city=${cityName}&days=5`;

  superagent.get(weatherURL)
    .then(aPIData=>{
      let weatherData= aPIData.body.data;
      let allWeather=weatherData.map((item)=>{
        return new Weather(item);
      });
      res.send(allWeather);
    });
}



function Weather(dataW){
  this.forecast=dataW.weather.description ;
  this.time =convertDate(dataW.datetime);

}

function convertDate(d){
  let date = new Date (d);
  date = date.toDateString();
  return date;
}

function parkHandler(req,res){

  let cityName=req.query.search_query;
  let key = process.env.PARK_KEY;
  let parkURL = `https://developer.nps.gov/api/v1/parks?q=${cityName}&api_key=${key}`;


  superagent.get(parkURL)
    .then(paData=>{

      let parkData=paData.body.data;


      let parkInfo = parkData.map((item)=>{

        return new Park(item);

      });

      res.send(parkInfo);

    })
    .catch(error=>{

      res.send(error);
    });


}
function Park(cityName){
  this.name=cityName.fullName;
  this.address=`${cityName.addresses[0].line1}, ${cityName.addresses[0].city}, ${cityName.addresses[0].stateCode} ${cityName.addresses[0].postalCode}`;
  this.fee='0.00';
  this.description=cityName.description;
  this.url=cityName.url;

}

function notFound(req,res){
  let objError = {
    status: 500,
    responseText: 'Sorry, something went wrong',
  };
  res.status(500).send(objError);
}


server.listen(PORT ,()=>{
  console.log(`Listening to port ${PORT}`);
});
