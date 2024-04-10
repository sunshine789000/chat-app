
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const http = require("http");
const { errorServer } = require('./utilities/response');
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger.json"); 

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require("./models/v1");
db.sequelize
  .sync({alter:true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
{alter:true}


const port = (process.env.PORT || '5000');
const app = express();
swaggerOptions['host']=process.env.SERVER_HOSTNAME
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
const cors = require('cors');
app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Timezone");
    next();
});
app.use('/api/v1/chats',require('./routes/v1/chats'))

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (err.name === 'UnauthorizedError') {
        errorServer(err, res, 401)
    } else {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        errorServer(err, res, err.status || 500);
    }
});


app.use(clientErrorHandler)
app.use(errorHandler)

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler(err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}

app.set('port', port);

let server = http.createServer(app);

const io = require('socket.io')(server);
require('./socket')(io);
server.listen(port, async function () {
    console.log("Server is running on " + port);
});

module.exports = app;
