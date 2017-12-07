
  var flickerAPI = "resources/date.json";
  $.getJSON( flickerAPI, {
    tags: "mount rainier",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      var currentDate = new Date();
      var expireDate = new Date(data.date);
      if((expireDate - currentDate) >= 0) {
        window.FF_OnAfterSave = function() {
          //  location = 'French-Download-File';
          var  folder = $('#download')[0];
          folder.href = data.filePath;
          folder.click();
        }
      } else {
        $('.form-fastform').remove();
        $("#expireInfo").toggleClass('hidden');
        var email = $("#email")[0];
        email.href = "mailto:" + data.email;
      }
    });
