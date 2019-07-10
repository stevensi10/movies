const express = require('express');
const path = require('path');

const app = express();

var mysql = require('mysql');

var conn = mysql.createConnection({
    host : '127.0.0.1',
    port: 3306,
    user : 'user',
    password : 'Steven123!!',
    database : 'website'
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', function(request, response){
    conn.connect();
    conn.query('select GENRE from genres', function(error, results)
    {
        console.log(results);
        if ( error ){
            response.status(400).send('Error in database operation');
        } else {
            response.json(results);
        }
    });
    conn.end();
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);