var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var ementa = require('./routes/ementa');
var professores = require('./routes/professores');
var schedule = require('node-schedule')
var Number = require('./models/numbers')
var Nexmo = require('nexmo')
var app = express();
var pdfUtil = require('pdf-util');


//Conexão à BD
var mongoose = require('mongoose')
mongoose.connect('mongodb://XXXX:XXXXX@XXXXX')
mongoose.Promise = global.Promise

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/ementa', ementa);
app.use('/professores', professores);
app.use('/users', users);

var nexmo = new Nexmo({
  apiKey: 'XXXXXXX',
  apiSecret: 'XXXXXXXXXXXXX'
});

var j = schedule.scheduleJob('0 10 * * * *', function(){
  console.log("entrou no schedule")
  Number.find({}).exec(function(err,docs){
    if(!err){
      var pdfDir = "./pdf.pdf"
      pdfUtil.pdfToText(pdfDir, function(err1, data) {
        if (err1) throw(err);
        else{
          var dias = data.split("Dia")
          var ementa
          var today = new Date();
          today = today.getDate()
          for(var x in dias){
            var splited = dias[x].split(/\s[–-]\s/);
            if(splited.length>2){
              var obj = {};
              obj.dia = splited[0].split("Almoço")[0];
              if(parseInt(obj.dia.match(/[0-9]+/g)[0]) === (today + 1) ){
                obj.almoco = splited[1].split("Jantar")[0];
                obj.jantar=splited[2];
                ementa = obj;
                break;
              }
            }
          }

          for(var numero in docs){
            var telNumber = docs[numero].number
            var message = "Ementa da cantina para amanhã:\n\n"
            message+= "Almoço:\n"+ementa.almoco.replace(/;(\s)*/,"\n") + "\n"
            message+= "Jantar:\n"+ementa.jantar.replace(/;(\s)*/,"\n") 
            message+= "Bom apetite 🍴"

            nexmo.message.sendSms('HelpUM', '351'+telNumber, message, {type: 'unicode'}, (err1, responseData) => {
              if(err1){
                console.log("Ocorreu um erro ao enviar mensagem para o "+telNumber)
              }
            });

            
          }
         
       }
      })

      
    }
    else{
      console.log("Ocorreu um erro na consulta dos números de telemóvel")
    }
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
