function HomeAssistant() {}

HomeAssistant.prototype.setup = function() {
  this.controller.setupWidget('logout',
    {}, { buttonLabel: "Log out" }
  );
  
  this.controller.setupWidget('location_loading',
    { spinnerSize: 'small' },
    { spinning: true }
  );
  
  Mojo.Event.listen($('logout'), Mojo.Event.tap, this.logout.bind(this));
  
  this.controller.serviceRequest('palm://com.palm.location', {
    method: 'getCurrentPosition',
    parameters: {},
    onSuccess: function(response) {
      Mojo.Log.error("gps success");
      var accuracy = '';
      if (response.horizAccuracy != -1 && response.vertAccuracy != -1)
        accuracy = (response.horizAccuracy + response.vertAccuracy) / 2;
      var url = 'http://brightkite.com/places/search.json?q=' + response.latitude + ',' + response.longitude + '&cacc=' + accuracy;
      $j.getJSON(url, function(response) {
        if (response.display_location == response.name)
          $('location').update(new Element('p').update(response.name));
        else {
          $('location').insert(new Element('p').update(response.name));
          $('location').insert(new Element('p').update(response.display_location));
        }
        if (accuracy != '')
          $('accuracy').update(accuracy);
        $('details').show();
      });
    },
    onFailure: function(response) {
      Mojo.Log.error("gps failure");
    }
  });
};

HomeAssistant.prototype.logout = function() {
  var credentials = new Mojo.Model.Cookie('credentials');
  credentials.remove();
  Mojo.Controller.stageController.swapScene('main');
};