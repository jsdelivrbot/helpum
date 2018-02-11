(function() {
  $(window).on('load', function() {
    $('#jsonSearch').keyup(function() {
      var count, myExp, output, searchField;
      count = void 0;
      myExp = void 0;
      output = "";
      searchField = void 0;
      searchField = $('#jsonSearch').val();
      myExp = new RegExp(searchField, 'i');
      count = 1;
      $.getJSON('data/docentes.json', function(data) {
        $.each(data, function(key, val) {
          var showName = true
          var showMail = true
          var showTelefone = true;
          var showDepartamento = true;
          searchField.split(" ").forEach(function(x) {
            showName = showName && (val.nome.search(new RegExp(x, 'i'))!=-1);
            showMail = showMail && (val.email.search(new RegExp(x, 'i'))!=-1);
            showTelefone = showTelefone && (val.telefone.search(new RegExp(x, 'i'))!=-1);
            showDepartamento = showDepartamento && (val.departamento.search(new RegExp(x, 'i'))!=-1);
          });
          if (showName || showMail || showTelefone || showDepartamento) {
            output += '<div class="col s12 result card-panel" style="background-color:#efefef;margin-bottom:10px; border-radius: 10px;"><div class="col s12"><li class="searchLi"><p><b>Nome:</b> ' + val.nome + '</p><p><b>Website:</b> <a href="' + val.url + '">'+val.url+'</a></p><p><b>Departamento:</b> ' + val.departamento + '</p><p><b>Telefone:</b> '+ val.telefone + '</p><p><b>Email:</b> ' + val.email +'</p></li></div></div>';
            
            count++;
          }
        });
        if(count-1==1){
          output="<p>"+(count-1)+" resultado</p>"+output;
        }
        else{
          output="<p>"+(count-1)+" resultados</p>"+output;
        }
        $('#jsonSearchresults').html(output);
      });
    });
  });

}).call(this);