require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const massive = require('massive');
const PORT = 4000;

const authCtrl = require('../controllers/authController');
const treasureCtrl = require('../controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const {CONNECTION_STRING, SESSION_SECRET} = process.env;

app.use(express.json());


massive(CONNECTION_STRING).then( db =>{
    app.set('db', db);
    console.log('Connected DB be');
})

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

app.listen(PORT, ()=> console.log(`${PORT} Server on`));
