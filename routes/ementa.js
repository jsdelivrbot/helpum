var express = require('express');
var request = require('request');
var http = require('http');
var download = require('download-pdf');
var fs = require('fs');
var router = express.Router();
var pdfUtil = require('pdf-util');
var Number = require("../models/numbers");

/* GET home page. */
router.get('/', function(req, res, next) {
  var url="http://www.sas.uminho.pt/uploads/EmentaTC_Fev18.pdf"
  var options = {
    directory: "./",
    filename: "pdf.pdf"
  }
  
  var pdfDir = options.directory + options.filename

	pdfUtil.pdfToText(pdfDir, function(err, data) {
  if (err) throw(err);
  else{
    var dias = data.split("Dia")
    var ementa = []
    var today = new Date();
    today = today.getDate()
    dias.forEach(x => {
      var splited = x.split(/\s[–-]\s/);
      if(splited.length>2){
        var obj = {};
        obj.dia = splited[0].split("Almoço")[0];
        if(parseInt(obj.dia.match(/[0-9]+/g)[0]) >= today ){
          obj.almoco = splited[1].split("Jantar")[0];

          obj.jantar=splited[2];
          ementa.push(obj)
        }
      }
    } )
    res.render("ementa", {ementa:ementa})
  }
});
	
});

router.post('/', function(req, res, next) {
  var number = req.body.number;
  Number.find({number:number}).exec(function(err,docs){
    if(!err){
      if(docs.length===0){
        new Number({number:number}).save((err,resultado) => {
          if(!err){
            res.render("ementa",{status:"Número registado com sucesso"});
          }
          else{
            res.render("ementa",{status:"Número não registado"});
          }
        })
      }
      else{
        res.render("ementa",{status:"Este número já foi registado"});
      }
    }
    else{
      res.render("ementa",{status:"Número não registado"});
    }
  })
  
})

module.exports = router;

