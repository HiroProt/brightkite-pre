function PlaceAssistant() {}

PlaceAssistant.prototype = {
  setup: function() {
    $j('#place').text(bk.object.place.name);
  }
};