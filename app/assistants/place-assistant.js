function PlaceAssistant() {}

PlaceAssistant.prototype = {
  setup: function() {
    if (bk.object.place.name == bk.object.place.display_location) {
      $j('.palm-page-header .title').text(bk.object.place.name);
      $j('.palm-page-header .subtitle').hide();
    }
    else {
      $j('.palm-page-header .title').text(bk.object.place.name);
      $j('.palm-page-header .subtitle').text(bk.object.place.display_location);
    }
    
    this.controller.setupWidget('placestream', {}, { buttonLabel: "Placestream" });
    this.controller.setupWidget('nearby', {}, { buttonLabel: "Nearby people" });
    this.controller.setupWidget('placemark', {}, { buttonLabel: "Add to placemarks" });
    this.controller.setupWidget('checkin', {}, { buttonLabel: "Check in here" });
    
    this.controller.listen('placestream', Mojo.Event.tap, this.placestream);
    this.controller.listen('nearby', Mojo.Event.tap, this.nearby);
  },
  placestream: function() {
    Mojo.Controller.stageController.pushScene('placestream');
  },
  nearby: function() {
    Mojo.Controller.stageController.pushScene('nearby');
  }
};