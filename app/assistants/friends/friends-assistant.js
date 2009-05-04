function FriendsAssistant() {}

FriendsAssistant.prototype = {
  setup: function() {
    var user = new Mojo.Model.Cookie('credentials').get();
    
    this.controller.setupWidget(Mojo.Menu.viewMenu, undefined,
      { items: [
        { items: [
          { label: "Activity", command: 'list-activity', width: 160 },
          { label: "People", command: 'list-people', width: 160 }
        ]} 
      ]}
    );
    
    this.controller.setupWidget('more', {}, { buttonLabel: "More", buttonClass: 'secondary' });
    this.controller.listen('more', Mojo.Event.tap, this.more);
    
    $j.getJSON('http://brightkite.com/people/' + user.login + '/friendstream.json', function(json) {
      $j('#stream')
        .items(json)
        .chain({
          '.palm-row-wrapper': function(data, element) {
            element.addClass(data.object_type + '_object');
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
        })
        .show();
    }.bind(this));
  },
  more: function() {
    console.log("more");
  }
};