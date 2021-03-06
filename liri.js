var request = require('request');
var fs = require('fs');
var twitterKeys = require('./keys.js');
var Twitter = require('twitter');

var argv = process.argv;
var myCommand = process.argv[2];
var myInput = "";

for (var i=3; i< argv.length; i++) {
    myInput = myInput.concat(argv[i]+ " ");
}

switch (myCommand) {
  case "my-tweets":
      twitter();
      break;
  case "spotify-this-song":
      spotify(myInput);
      break;
  case "movie-this":
      movie(myInput);
      break;
  case "do-what-it-says":
      doIt();
      break;
}

function twitter() {
      var tweetsNumber = 0;
      var client = new Twitter(twitterKeys.twitterKeys);

      var params = {screen_name: 'mia_greens'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          tweets.forEach(function(i) {
              tweetsNumber++;
              console.log('========== TWEET # '+tweetsNumber + '==========');
              console.log(`Tweet # ${tweetsNumber}: ` + i.text);
              console.log('Created at: '+ tweets[0].user.created_at);
              console.log("Re-tweet count: "+ tweets[0].retweet_count);
            })
        }
      });
}



function spotify(songInput) {
      var spotify = require('spotify');
      songInput = myInput || "The Sign by Ace of Base";

      spotify.search({ type: 'track', query:songInput}, function(err, data) {
          if ( err ) {
              console.log('Error occurred: ' + err);
              return;
          }

          var results = data.tracks.items;
          var songNumber = 0;

          results.forEach(function(i) {
              songNumber++;
              console.log(" ============= MATCHED song #"+ songNumber+ " ================");
              console.log("Type : " + i.type);
              console.log("Artist Name : " + i.album.artists[0].name);
              console.log("Popularity: " + i.popularity);
              console.log("Listen here: " + i.external_urls.spotify);
              console.log("Available markets: " + i.album.available_markets);
              console.log(" =============================================");
          });
      });
};

function movie(movie) {
        movie = myInput || "Mr. Nobody";
    
        request("http://www.omdbapi.com/?t="+ movie+ "&y=&plot=short&r=json", function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var obj = JSON.parse(body);
            // console.log(obj);
            console.log(" ===============MOVIE SEARCH RESULT======================");
            console.log("Title: " + obj.Title);
            console.log("Year the movie came out: " + obj.Year);
            console.log("Rated: " + obj.imdbRating);
            console.log("Country where the movie was produced: " + obj.Country);
            console.log("Language: " + obj.Language);
            console.log("Plot: " + obj.Plot);
            console.log("Actors: " + obj.Actors);
            console.log("The movie's rating is: " + obj.imdbRating);
            console.log("Rotten Tomatoes Rating: " + obj.Rated);
            console.log("Rotten Tomatoes Url: https://www.rottentomatoes.com/m/" + obj.Title.split(" ").join("_"));
            console.log(" ======================================================");
          }
        });
}


function doIt () {
    fs.readFile("random.txt", "utf8", function(err,data) {
        data = data.split(",");
        var commandLiri = data[0];
        var content = data[1];

        if (commandLiri == "my-tweets") {
            tweet();
        } else if ( commandLiri == "spotify-this-song") {
            myInput = data[1];
            spotify(myInput);
        } else if ( commandLiri == 'movie-this') {
            movie();
        }
    })
}



