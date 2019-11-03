var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();
app.set ('view engine', 'ejs');
app.use (bodyParser.urlencoded({ extended: true }));
//var city = "New York"
var units = "Metric"


app.post('/email',function(req,res){
  console.log(req.body.email);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fencepaintergrandcornell@gmail.com',
      pass: 'werete3296'
    }
  });

  var mailOptions = {
  from: 'fencepaintergrandcornell@gmail.com',
  to: req.body.email,
  subject: 'Weather Forecast',
  html: `<h1>Current Weather</h1><p>City: ${req.body.city}</p><p>${req.body.des}</p><p>Temperature: ${req.body.temp}</p>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

var weather_total;
  weather_total = {
      weather: {
      city : "",
      des  : "",
      temp : "",
      icon : ""
    }
  }

  res.render('index.ejs',weather_total);


});




app.get('/5-day',function(req,res){


  res.render('5-day.ejs',{
    total:[
      {weather:{
      city : "",
      time : "",
      des  : "",
      temp : "",
      icon : ""
  }
    }
  ]
});


});

app.post('/5-day',function(req,res){

    var api_end = `http://api.openweathermap.org/data/2.5/forecast?q=${req.body.city_name}&units=Metric&appid=ad4dd8d6ace7bd55801a1da7d878515c`;
    var five_day_weather_total = [];

    request(api_end, function(err,resp,body){

      json_weather = JSON.parse(body);


      if(resp.code == 404){
        weather_total = {
            weather: {
            city : "No Data",
            des  : "No Data",
            temp : "No Data",
            icon : "No Data"
          }
      }
    }else{

      for(var i = 0; i < json_weather.list.length; i++){
        cur_weather_total = {

            weather: {

              city : json_weather.city.name,
              time : json_weather.list[i].dt_txt,
              des  : json_weather.list[i].weather[0].description,
              temp : Math.round(json_weather.list[i].main.temp),
              icon : json_weather.list[i].weather[0].icon

          }
        }
      five_day_weather_total.push(cur_weather_total);
      }

      weather_total = {
        total : five_day_weather_total
      }

    }
console.log(weather_total);
    //return view with view model
      res.render('5-day.ejs',weather_total);
    });

});








app.get('/',function(req,res){
var weather_total;
  weather_total = {
      weather: {
      city : "",
      des  : "",
      temp : "",
      icon : ""
    }
  }

  res.render('index.ejs',weather_total);
});



app.post('/',function(req,res){
  console.log("hi");
  console.log(req.body.city_name);
  //res.redirect(`/city`);

    var api_end = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.city_name}&units=Metric&appid=ad4dd8d6ace7bd55801a1da7d878515c`;

    request(api_end, function(err,resp,body){

      json_weather = JSON.parse(body);
      var weather_total;

      if(resp.code == 404){
        weather_total = {
            weather: {
            city : "No Data",
            des  : "No Data",
            temp : "No Data",
            icon : "No Data"
          }
      }
    }else{
      var weather_total = {

          weather: {
          city : json_weather.name,
          des  : json_weather.weather[0].description,
          temp : Math.round(json_weather.main.temp),
          icon : json_weather.weather[0].icon
        }
      }
    }
    console.log(weather_total.weather.city);
    //return view with view model
      res.render('index.ejs',weather_total);
    });

    //TODO Do something with response
});






app.listen(8080);

//try to get the form input post request and then change the api end point and send it out for a get request change the api endpoint
//Get request from url
//Post from own html
