function HomeAssistant() {}

HomeAssistant.prototype = {
  setup: function() {
    this.last_update = '';
    this.credentials = new Mojo.Model.Cookie('credentials');
    
    /*var place = this.credentials.get().person.place
    if (place) {
      console.log("got place: " + place.name);
    }*/
    
    this.controller.setupWidget('privacy', { trueLabel: "Private", falseLabel: "Public" }, { value: "ON" });
    this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerSmall }, { spinning: true });
    this.controller.setupWidget('find', {}, { buttonLabel: "Find me", buttonClass: 'secondary' });
    this.controller.setupWidget('pick', {}, { buttonLabel: "Pick a place", buttonClass: 'secondary' });
    this.controller.setupWidget('logout', {}, { buttonLabel: "Log out" });
    
    this.controller.listen('find', Mojo.Event.tap, this.find.bind(this));
    this.controller.listen('pick', Mojo.Event.tap, this.pick);
    this.controller.listen('checkin', Mojo.Event.tap, this.checkin);
    this.controller.listen('note', Mojo.Event.tap, this.note);
    this.controller.listen('photo', Mojo.Event.tap, this.photo);
    this.controller.listen('logout', Mojo.Event.tap, this.logout.bind(this));
    
    this.get_location();
  },
  get_location: function() {
    this.controller.serviceRequest('palm://com.palm.location', {
      method: 'getCurrentPosition',
      parameters: {},
      onSuccess: this.handle_location_response.bind(this)
    });
  },
  handle_location_response: function(location) {
    var accuracy = (location.horizAccuracy != -1 && location.vertAccuracy != -1) ? (location.horizAccuracy + location.vertAccuracy) / 2 : '';
    $j.getJSON('http://brightkite.com/places/search.json?q=' + location.latitude + ',' + location.longitude + '&cacc=' + accuracy, function(place) {
      $j('#place strong').text(place.name);
      if (place.display_location != place.name)
        $j('#place em').text(place.display_location).show();
      
      $j('#accuracy strong').text(accuracy + " meters");
      //$j('#update > strong').everyTime('5s', this.update_time.bind(this))
      
      $j('#location .title, #loading').hide();
      $j('#place, #details').show();
    });
  },
  find: function() {
    $j('#place, #details').hide();
    $j('#location .title:first, #loading').show();
    this.get_location();
  },
  pick: function() {
    Mojo.Controller.stageController.pushScene({ name: 'pick', sceneTemplate: 'home/pick/pick-scene' });
  },
  checkin: function() {
    console.log("checkin");
  },
  note: function() {
    console.log("note");
  },
  photo: function() {
    console.log("photo");
  },
  logout: function() {
    this.credentials.remove();
    Mojo.Controller.stageController.swapScene('main');
  },
  update_time: function() {
    var offset = Math.round((new Date().getTime() - this.last_update) / 1000);
    var time = '';
    if (offset < 10) { time = '< 10 seconds ago'; }
    else if (offset < 20) { time = '< 20 seconds ago'; }
    else if (offset < 30) { time = '< 30 seconds ago'; }
    else if (offset < 60) { time = '< 1 minute ago'; }
    else if (offset < 120) { time = '< 2 minutes ago'; }
    else if (offset < 3600) { time = '~ ' + Math.round(offset / 60) + ' minutes ago'; }
    else { time = '~ ' + Math.round((offset / 60) / 60) + ' hours ago'; }
    $j('#update > strong').text(time);
  }
};

/*function HomeAssistant() {}

HomeAssistant.prototype.setup = function() {
  $$('.row > a').each(function(link) {
    Mojo.Event.listen(link, Mojo.Event.tap, function() {
      Mojo.Controller.stageController.swapScene(link.readAttribute('href').gsub('#', ''));
    });
  });
  
  Mojo.Event.listen($('find_button'), Mojo.Event.tap, this.force_find.bind(this));
  
  this.update_location();
};

HomeAssistant.prototype.update_location = function() {
  var credentials = new Mojo.Model.Cookie('credentials');
  $j.getJSON('http://brightkite.com/people/' + credentials.get().username, function(person) {
    if (typeof(person.place) != 'undefined') {
      
    }
    $j('fieldset .row > a').removeClass('disabled');
  });
  this.controller.serviceRequest('palm://com.palm.location', {
    method: 'getCurrentPosition',
    parameters: {},
    onSuccess: function(location) {
      window.last_update = new Date().getTime();
      var accuracy = '';
      if (location.horizAccuracy != -1 && location.vertAccuracy != -1)
        accuracy = (location.horizAccuracy + location.vertAccuracy) / 2;
      var url = 'http://brightkite.com/places/search.json?q=' + location.latitude + ',' + location.longitude + '&cacc=' + accuracy;
      $j.getJSON(url, function(response) {
        $j('#snap').css('background', 'none');
        if (response.display_location == response.name) {
          $j('#snap h3').text(response.name).show();
          $j('#snap p').hide();
        }
        else {
          $j('#snap h3').text(response.name).show();
          $j('#snap p').text(response.display_location).show();
        }
        if (accuracy != '')
          $j('#accuracy > strong').text(accuracy + ' meters');
        $j('#details').show();
        $j('#update > strong').text('just now');
        $j('#details').everyTime('5s', this.update_time.bind(this));
      }.bind(this));
    }.bind(this),
    onFailure: function(response) {
      Mojo.Log.error("GPS failure");
    }
  });
};

HomeAssistant.prototype.update_location

HomeAssistant.prototype.force_find = function() {
  $j('#details').stopTime();
  $j('#snap')
    .css('background', "url('/var/usr/palm/applications/com.brightkite.app/images/spinner.gif') center center no-repeat")
    .children('*').hide();
  $j('#details').hide();
  this.update_location();
};

HomeAssistant.prototype.update_time = function() {
  var offset = Math.round((new Date().getTime() - window.last_update) / 1000);
  var time = '';
  if (offset < 10) { time = '< 10 seconds ago'; }
  else if (offset < 20) { time = '< 20 seconds ago'; }
  else if (offset < 30) { time = '< 30 seconds ago'; }
  else if (offset < 60) { time = '< 1 minute ago'; }
  else if (offset < 120) { time = '< 2 minutes ago'; }
  else if (offset < 3600) { time = '~ ' + Math.round(offset / 60) + ' minutes ago'; }
  else { time = '~ ' + Math.round((offset / 60) / 60) + ' hours ago'; }
  $j('#update > strong').text(time);
}

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
};*/