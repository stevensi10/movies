const express = require('express');
const path = require('path');
var passwordHash = require('password-hash');

const app = express();

var mysql = require('mysql');

var db_config = {
    host : 'us-cdbr-iron-east-02.cleardb.net',
    port: 3306,
    user : 'b6733d71133f61',
    password : 'aa2f63c8',
    database : 'heroku_65b6bfb2048a755'
  };

var conn = mysql.createConnection(db_config);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/genres', function(request, response){
    conn.query('select ID,GENRE from genres', function(error, results)
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
            console.log(results);
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
    conn.query('SELECT l.*,(SELECT TMDB_ID FROM lists_content WHERE LIST_ID=l.ID ORDER BY RAND() LIMIT 1) AS FIRST_ID FROM lists l WHERE l.GENRE_ID='+request.query.id+' ORDER BY CREATION_DATE DESC', function(error, results)
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
    conn.query("SELECT RATING FROM seen WHERE USER_ID="+request.query.userID+" AND IMDB_ID='"+request.query.imdbID+"'", function(error, results)
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

app.get('/api/create-user', function(request, response){
    var hashedPassword = passwordHash.generate(request.query.password);
    var creationDate = getCurrentDate();
    var name = request.query.firstName + ' ' + request.query.lastName;
    conn.query("INSERT INTO users(FIRST_NAME,LAST_NAME,NAME,EMAIL,PASSWORD,CREATION_DATE) VALUES('"+request.query.firstName+"','"+request.query.lastName+"','"+name+"','"+request.query.email+"','"+hashedPassword+"','"+creationDate+"')", function(error, results)
    {
        console.log(results);
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/login', function(request, response){
    conn.query("SELECT * FROM USERS WHERE EMAIL='"+request.query.email+"'", function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else 
        {
            if(passwordHash.verify(request.query.password,results[0].PASSWORD))
            {
                response.json(results[0]);
            }
            else
                response.status(400).send('false');
        }
    });
});

app.get('/api/movie-rating-set', function(request, response){
    var lastUpdate = getCurrentDate();
    conn.query("INSERT INTO seen(USER_ID,IMDB_ID,RATING,LAST_UPDATE) VALUES("+request.query.userID+",'"+request.query.imdbID+"',"+request.query.rating+",'"+lastUpdate+"') ON DUPLICATE KEY UPDATE RATING=VALUES(RATING),LAST_UPDATE=VALUES(LAST_UPDATE)", function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
            console.log(results);
        }
    });
});

app.get('/api/movie-watchlist-add', function(request, response){
    var lastUpdate = getCurrentDate();
    conn.query("INSERT INTO watchlist(USER_ID,TMDB_ID,LAST_UPDATE) VALUES("+request.query.userID+",'"+request.query.tmdbID+"','"+lastUpdate+"')", function(error, results)
    {
        console.log(results);
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/movie-watchlist-delete', function(request, response){
    var lastUpdate = getCurrentDate();
    conn.query("DELETE FROM watchlist WHERE USER_ID="+request.query.userID+" AND TMDB_ID='"+request.query.tmdbID+"'", function(error, results)
    {
        console.log(results);
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/movie-list-add', function(request, response){
    var lastUpdate = getCurrentDate();
    var query = conn.query("INSERT INTO lists_content(LIST_ID,TMDB_ID,TITLE,RELEASE_DATE,DATE_ADDED) VALUES("+request.query.listID+",'"+request.query.tmdbID+"','"+request.query.title+"','"+request.query.release_date+"','"+lastUpdate+"')", function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

app.get('/api/list-create', function(request, response){
    var lastUpdate = getCurrentDate();
    var query = conn.query("INSERT INTO lists(USER_ID,GENRE_ID,NAME,CREATION_DATE,LAST_UPDATE) VALUES("+request.query.userID+",'"+request.query.genreID+"','"+request.query.name+"','"+lastUpdate+"','"+lastUpdate+"')", function(error, results)
    {
        if ( error ){
            response.status(400).send('Error in database operation' + error);
        } else {
            response.json(results);
        }
    });
});

function getCurrentDate()
{
    var d = new Date();
    d = new Date(d.getTime() - 3000000);
    var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
    return date_format_str;
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

function handleDisconnect() {
    conn = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    conn.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
                                            conn.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
handleDisconnect();

console.log(`Server listening on ${port}`);