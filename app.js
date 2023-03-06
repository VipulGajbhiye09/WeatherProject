const express = require("express");
const https = require("https");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
  const query = req.body.cityName;  //Retrieving city name from client
  const appid =""; //insert API key here

  const url1 = "https://api.openweathermap.org/geo/1.0/direct?q=" + query + "&appid=" + appid;
  https.get(url1, function(response) {
    console.log(response.statusCode, "1st status");

    response.on("data", function(data) {
      const cityData = JSON.parse(data)
      const lat = cityData[0].lat;
      const lon = cityData[0].lon;

      const url2 = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=metric";
      https.get(url2, function(response) {
        console.log(response.statusCode, "2nd Status");

        response.on("data", function(data) {

          const weatherData = JSON.parse(data);
          const city = weatherData.name;
          const temp = weatherData.main.temp;
          const desc = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const img = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

          res.write("<html><h2> Weather is currently " + desc + "</h2></html>");
          res.write("<h1> Temperature of " + city + " is " + temp + " Degree Celcius. </h1>");
          res.write("<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png></img>");
          res.send();
        })

      });
    });
  });
});




app.listen(3000, function() {
  console.log("Server is running on port 3000")
});
