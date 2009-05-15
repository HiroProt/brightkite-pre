function NearbyAssistant() {}

NearbyAssistant.prototype = {
  page: 1,
  template: {
    '.palm-row-wrapper': function(data, element) {
      element.addClass(data.object_type + '_object');
      element.attr('id', data.id);
    },
    '.palm-row-wrapper > img.avatar': function(data, element) {
      element
        .attr({
          'src': (data.object_type == 'checkin') ? data.creator.tiny_avatar_url : data.creator.small_avatar_url,
          'alt': data.creator.login + "'s avatar",
        })
        .closest('a').attr('href', '/people/' + data.creator.login);
    },
    '.content': function(data, element) {
      if (data.body && data.body != '')
        element
          .text(data.body)
          .prepend($j.create('strong', {}, data.creator.login + ": "));
      if (data.photo)
        element.prepend($j.create('img', { 'src': data.photo.replace(/(.[A-Za-z]*)$/, "-small$1") } ));
    },
    '.palm-row-wrapper .details > span': function(data, element) {
      if (!data.body || data.body == '') {
        element.text(data.creator.login);
        if (data.object_type == 'checkin')
          element.append(" checked in @");
        else
          element.append(" @");
      }
      else
        return '@';
    },
    '.place': function(data, element) {
      element.text(data.place.name);
    },
    '.time': function(data, element) {
      element.text(data.created_at_as_words + " ago");
    },
    '.comments': function(data, element) {
      if (data.comments_count > 0)
        element.after($j.create('span', {
          'class': 'count'
        }, "(" + data.comments_count + ")"));
    },
    '.privacy': function(data, element) {
      if (data.public)
        element.css('background-image', element.css('background-image').replace('private', 'public'));
    }
  },
  setup: function() {
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
      { items: [
        { items: [
          { label: "Home", command: 'scene-home', width: 160 },
          { label: "Activity", command: 'scene-friends', width: 160 }
        ]} 
      ]}
    );
    
    this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerLarge }, { spinning: true });
    this.controller.setupWidget('more', { type: Mojo.Widget.activityButton }, { buttonLabel: "More", buttonClass: 'secondary' });
    this.controller.listen('more', Mojo.Event.tap, this.more.bind(this));
    
    bk.api.stream('/people/' + bk.credentials.username + '/nearbystream.json?radius=2000', function(response) {
      var response_object = $j.evalJSON(response);
      $j('#stream')
        .items(response_object)
        .chain(this.template)
        .show();
      $j(response_object).each(function(index, object) {
        this.controller.listen(object.id, Mojo.Event.tap, function() {
          bk.object = object;
          Mojo.Controller.stageController.pushScene('object');
        });
      }.bind(this));
      $j('#loading').hide();
      $j('#more').show();
    }.bind(this));
  },
  more: function() {
    this.page++;
    bk.api.stream('/people/' + bk.credentials.username + '/nearbystream.json?radius=2000&page=' + this.page, function(response) {
      var response_object = $j.evalJSON(response)
      $j('#stream')
        .items('merge', response_object)
        .chain(this.template)
      $j(response_object).each(function(index, object) {
        this.controller.listen(object.id, Mojo.Event.tap, function() {
          bk.object = object;
          Mojo.Controller.stageController.pushScene('object');
        });
      }.bind(this));
      $('more').mojo.deactivate();
    }.bind(this));
    /*$j.getJSON('http://brightkite.com/people/' + bk.credentials.username + '/nearbystream.json?radius=2000&page=' + this.page, function(json) {
      $j('#stream')
        .items('merge', json)
        .chain(this.template)
      $('more').mojo.deactivate();
    }.bind(this));*/
  }
};