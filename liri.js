require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var axios = require("axios");
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

var cli_command = process.argv[2].trim();
var searchTerm = process.argv.slice(3).join(" ");

runCommand(cli_command, searchTerm);

function runCommand(command, term) {
    switch (command) {
        case 'concert-this':
            findConcert(term);
            break;
        case 'spotify-this-song':
            // code block
            findSong(term);
            break;

        case 'movie-this':
            findMovie(term);
            break;

        case 'do-what-it-says':
            // code block
            runFromFile();
            break;

        default:
            console.log("That command is not supported");
    }
}

function findConcert(artist) {

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (response) {
            response.data.forEach(function (event) {
                console.log("Venue Name: " + event.venue.name);
                console.log("Location: " + event.venue.city + ', ' + event.venue.region);
                var date = new Date(event.datetime);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();
                console.log("Date: " + month + '/' + day + '/' + year + '\n');
            });
        });

}

function findSong(title) {
    if (title === '') {
        title = 'The Sign'
    }
    spotify.search({ type: 'track', query: title }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // Artist Name
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        // The album that the song is from
        console.log("Album: " + data.tracks.items[0].album.name);
        // The song's name
        console.log("Track: " + data.tracks.items[0].name);
        // A preview link of the song from Spotify
        console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);



    });

    //Spotify song

}

function findMovie(title) {
    if (title === '') {
        title = 'Mr. Nobody';
    }
    var key = "7e0ca3ac";
    var URL = "http://www.omdbapi.com/?apikey=" + key + "&t=" + title;

    axios.get(URL).then(
        function (response) {
            //   * Title of the movie.
            console.log(response.data.Title);
            //   * Year the movie came out.\
            console.log(response.data.Year);
            //   * IMDB Rating of the movie.
            console.log(response.data.imdbRating);
            //   * Rotten Tomatoes Rating of the movie.
            console.log(response.data.Ratings[1].Value);
            //   * Country where the movie was produced.
            console.log(response.data.Country);
            //   * Language of the movie.
            console.log(response.data.Language);
            //   * Plot of the movie.
            console.log(response.data.Plot);
            //   * Actors in the movie.
            console.log(response.data.Actors);

        }


    );

    //axios omdb


}

function runFromFile() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        var command = data.split(',')[0];
        var searchTerm = data.split(',')[1];

        runCommand(command, searchTerm);
        console.log(command);
        console.log(searchTerm);
    });
}