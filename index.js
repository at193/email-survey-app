const express = require('express');
const mongoose = require('mongoose')
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('./models/User');
require('./models/Survey');
require('./services/passport');


    mongoose.connect(keys.mongoURI);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log("Connected to server correctly");
});

const app = express();

app.use(bodyParser.json());
app.use(
 cookieSession({
	 maxAge: 30 * 24 * 60 * 60 * 1000,
	 keys: [keys.cookieKey]
 })
);

app.use(passport.initialize());
app.use(passport.session());


require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production' ) {
  //express will serve up production assets
  //like main.js or main.css
  app.use(express.static('client/build'));

//Express will serve up index.html file
//if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'))
  })
}

 const PORT = process.env.PORT || 5000;
app.listen(PORT);
