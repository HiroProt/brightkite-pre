function PickAssistant() {}

PickAssistant.prototype = {

  template: {
    '.palm-row-wrapper': function(data, element) {
      element.attr({
        'id': data.id,
        'title': data.name,
        'rel': data.display_location
      });
    }
  },

  setup: function() {
    bk.place.id = '';
    this.query_model = { value: "" };
    this.controller.setupWidget('query',
      { hintText: 'Address or business name' },
      this.query_model
    );
    
    this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerLarge }, { spinning: true });
    this.controller.setupWidget('search', { type: Mojo.Widget.activityButton }, { buttonLabel: "Search" });
    this.controller.listen('search', Mojo.Event.tap, this.get_results.bind(this));
    
    this.get_results();
  },
  get_results: function() {
    var query = (this.query_model.value == '') ? '*' : this.query_model.value;
    var url = 'http://brightkite.com/places/search?q=' + query + '&clat=' + bk.location.latitude + '&clng=' + bk.location.longitude + '&cacc=' + bk.location.accuracy;
    $j.getJSON(url, function(json) {
      $j('#results')
        .items('replace', json)
        .chain(this.template);
      $j('#loading').hide();
      $$('#results .palm-row-wrapper').each(function(row) {
        Mojo.Event.listen($(row.id), Mojo.Event.tap, function() {
          this.pick(row.id)
        }.bind(this));
      }.bind(this));
      $('search').mojo.deactivate();
    }.bind(this));
  },
  pick: function(id) {
    element = $j('#' + id);
    bk.place.id = element.attr('id');
    bk.place.name = element.attr('title');
    bk.place.display_location = element.attr('rel');
    Mojo.Controller.stageController.popScene();
    //bk.scene('home');
  }

};

