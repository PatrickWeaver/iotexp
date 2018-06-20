// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Button (id INT PRIMARY KEY NOT NULL, timestamp TEXT NOT NULL, status INT NOT NULL)');
    console.log('New table Button created!');
    
    // insert default dreams
    db.serialize(function() {
      db.run('INSERT INTO Button (id, timestamp, status) VALUES (0, "' + new Date() + '", 0)');
    });
  }
  else {
    console.log('Database "Button" ready to go!');
    db.each('SELECT * from Button', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  db.each('SELECT * from Button', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getDreams', function(request, response) {
  db.all('SELECT * from Button', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

async function toggleButton() {
  let status = -1;
  try {
    await db.get('select id, status from Button order by id desc limit 1', function(err, row) {
      console.log(row);
      status = row;
      return status.status;
    });
  } catch(error) {
    return -1; 
  }
}