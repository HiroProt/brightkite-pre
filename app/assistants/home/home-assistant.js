function HomeAssistant() {}

HomeAssistant.prototype = {
  setup: function() {
    this.last_update = '';
    this.credentials = new Mojo.Model.Cookie('credentials');
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
      { items: [
        { items: [
          { label: "Home", command: 'scene-home', width: 160 },
          { label: "Activity", command: 'scene-nearby', width: 160 }
        ]} 
      ]}
    );
    
    this.controller.setupWidget('privacy', { trueLabel: "Private", falseLabel: "Public" }, { value: "ON" });
    this.controller.setupWidget('find', {}, { buttonLabel: "Find me", buttonClass: 'secondary' });
    this.controller.setupWidget('pick', {}, { buttonLabel: "Pick a place", buttonClass: 'secondary' });
    this.controller.setupWidget('logout', {}, { buttonLabel: "Log out", buttonClass: 'secondary' });
    
    this.controller.listen('find', Mojo.Event.tap, this.find.bind(this));
    this.controller.listen('pick', Mojo.Event.tap, this.pick);
    this.controller.listen('checkin', Mojo.Event.tap, this.checkin);
    this.controller.listen('note', Mojo.Event.tap, this.note);
    this.controller.listen('photo', Mojo.Event.tap, this.photo);
    this.controller.listen('logout', Mojo.Event.tap, this.logout.bind(this));
  
    if (bk.place.id == '') {
      this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerSmall }, { spinning: true });
      this.get_location();
    }
    else
      this.set_location();
  },
  activate: function() {
    if (bk.place.id == '') {
      this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerSmall }, { spinning: true });
      this.get_location();
    }
    else
      this.set_location();
  },
  get_location: function() {
    this.controller.serviceRequest('palm://com.palm.location', {
      method: 'getCurrentPosition',
      parameters: {},
      onSuccess: this.handle_location_response.bind(this)
    });
  },
  set_location: function() {
    $j('#location .title:first').hide();
    
    $j('#place div.name').text(bk.place.name);
    if (bk.place.display_location != bk.place.name)
      $j('#place em').text(bk.place.display_location).show();
      
    $j('#place').attr('rel', bk.place.id).show();
  },
  handle_location_response: function(location) {
    this.last_update = new Date().getTime();
    var accuracy = (location.horizAccuracy != -1 && location.vertAccuracy != -1) ? (location.horizAccuracy + location.vertAccuracy) / 2 : '';
    bk.location.accuracy = accuracy;
    bk.location.latitude = location.latitude;
    bk.location.longitude = location.longitude;
    $j.getJSON('http://brightkite.com/places/search.json?q=' + location.latitude + ',' + location.longitude + '&cacc=' + accuracy, function(place) {
      bk.place.id = place.id;
      bk.place.name = place.name;
      bk.place.display_location = place.display_location;
      $j('#place div.name').text(place.name).css('display', 'block');
      if (place.display_location != place.name)
        $j('#place em').text(place.display_location).show();
      else
        $j('#place em').hide();
      
      $j('#accuracy div.name').text(accuracy + " meters");
      
      $j('#location .title, #loading').hide();
      $j('#place, #details').attr('rel', place.id).show();
    });
  },
  find: function() {
    this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerSmall }, { spinning: true });
    $j('#place, #details').hide();
    $j('#location .title:first, #loading').show();
    this.get_location();
  },
  pick: function() {
    Mojo.Controller.stageController.pushScene({ name: 'pick', sceneTemplate: 'home/pick/pick-scene' });
  },
  checkin: function() {
    console.log("checkin");
    bk.api.checkin($j('#place').attr('rel'));
  },
  note: function() {
    Mojo.Controller.stageController.pushScene({ name: 'note', sceneTemplate: 'home/note/note-scene' });
  },
  photo: function() {
    console.log("photo");
    bk.api.photo();
  },
  logout: function() {
    this.credentials.remove();
    bk.scene('main');
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
    $j('#update strong').text(time);
  }
};