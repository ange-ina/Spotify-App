const express = require('express')//Schritt 1
const app = express()
const PORT = process.env.PORT || 5050//Schritt 2
const SpotifyWebApi = require('spotify-web-api-node')
require('dotenv').config()// umm die Info/Keys /email daten zu verstecken


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static("public"))

app.set("view engine", "ejs")//Schritt 1

 
const spotifyApi = new SpotifyWebApi({//variable
    clientId: process.env.CLIENT_ID,//
    clientSecret: process.env.CLIENT_SECRET//auch immer kopieren, wegen ID und API key, ein variable
});
  
  // Retrieve an access token/nutzt immer gleiche api key, ohne sie jedes mal zu refreshen
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
  

app.listen(PORT, () => {
    console.log('listening at 5050');
})
app.get('/', (req, res) => { 
    res.render('index')
})

 
app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.search)//user input / search(name of artist) im Form
        .then(data => {
            const artists= data.body.artists.items;
      console.log('The received data from the API: ', data.body.artists.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //res.render('index', {artistData})
            res.render('artist-search-results',{artists})//artists-egal welche name!!!!
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  
    
   
})
app.get('/albums/:id', (req, res,next) => {
    // spotifyApi
    //     .getArtistAlbums(req.params.id)
    //     .then(data => {
            
    //     })
    //     .catch(err => console.log('The error while searching artists occurred: ', err));
    
        spotifyApi.getArtistAlbums(req.params.id)
        .then(function(data) {
            console.log('Artist albums', data.body);
            const artistsAlbum = data.body.items;
            console.log("test",artistsAlbum);
            res.render('albums',{artistsAlbum})
        }, function(err) {
                console.error(err);
                next()
        });
})
app.get('/tracks/:idTrack', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.idTrack)
        .then(data => {
            const artistsTracks = data.body.items;
      console.log('The received data from the API: ', data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    
            res.render('tracks',{artistsTracks})
           
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  }) 
  

