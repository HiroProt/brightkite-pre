function HomeAssistant() {}

HomeAssistant.prototype.setup = function() {
  /*this.controller.setupWidget('logout',
    {}, { buttonLabel: "Log out" }
  );
  
  this.controller.setupWidget('pick',
    {}, { buttonLabel: "Pick a place" }
  );
  
  this.controller.setupWidget('friends',
    {}, { buttonLabel: "Friends" }
  );
  
  this.controller.setupWidget('activity',
    {}, { buttonLabel: "What's happening" }
  );
  
  this.controller.setupWidget('location_loading',
    { spinnerSize: 'small' },
    { spinning: true }
  );
  
  Mojo.Event.listen($('logout'), Mojo.Event.tap, this.logout.bind(this));
  Mojo.Event.listen($('pick'), Mojo.Event.tap, this.pick.bind(this));
  Mojo.Event.listen($('friends'), Mojo.Event.tap, this.friends.bind(this));
  Mojo.Event.listen($('activity'), Mojo.Event.tap, this.activity.bind(this));*/
  
  /*this.controller.serviceRequest('palm://com.palm.location', {
    method: 'getCurrentPosition',
    parameters: {},
    onSuccess: function(response) {
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
      Mojo.Log.error("GPS failure");
    }
  });*/
};

HomeAssistant.prototype.logout = function() {
  var credentials = new Mojo.Model.Cookie('credentials');
  credentials.remove();
  Mojo.Controller.stageController.swapScene('main');
};

HomeAssistant.prototype.pick = function() {
  Mojo.Controller.stageController.pushScene({ name: 'pick', sceneTemplate: 'home/pick/pick-scene' });
};

HomeAssistant.prototype.friends = function() {
  Mojo.Controller.stageController.swapScene('friends');
};

HomeAssistant.prototype.activity = function() {
  Mojo.Controller.stageController.swapScene('activity');
};