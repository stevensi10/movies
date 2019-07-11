const express = require('express');
const path = require('path');

const app = express();

var mysql = require('mysql');

var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-02.cleardb.net',
    port: 3306,
    user : 'b6733d71133f61',
    password : 'aa2f63c8',
    database : 'heroku_65b6bfb2048a755'
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/genres', function(request, response){
    conn.query('select GENRE from genres', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/users', function(request, response){
    conn.query('SELECT * FROM users', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/users-lists', function(request, response){
    conn.query('SELECT ID,NAME FROM lists WHERE USER_ID='+request.query.id+' ORDER BY NAME', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/watchlist', function(request, response){
    conn.query('SELECT TMDB_ID FROM watchlist WHERE USER_ID=22 ORDER BY LAST_UPDATE DESC', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/seen', function(request, response){
    conn.query('SELECT IMDB_ID FROM seen WHERE USER_ID=' + request.query.id, function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/lists', function(request, response){
    conn.query('SELECT l.* FROM lists l WHERE l.GENRE_ID='+request.query.id+' ORDER BY CREATION_DATE DESC', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/lists-content', function(request, response){
    conn.query('SELECT * FROM lists_content WHERE LIST_ID='+request.query.id+' ORDER BY ID', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/lists-genres', function(request, response){
    conn.query('SELECT DISTINCT(g.ID),g.GENRE FROM lists l INNER JOIN genres g ON l.GENRE_ID=g.ID', function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/movie-rating', function(request, response){
    conn.query('SELECT RATING FROM seen WHERE USER_ID='+request.query.userID+ 'AND IMDB_ID='+request.query.imdbID, function(error, results)
    {
        console.log(results);
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/movie-watchlist', function(request, response){
    conn.query('SELECT COUNT(*) AS C FROM watchlist WHERE USER_ID='+request.query.userID+' AND TMDB_ID='+request.query.tmdbID, function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);