function ObjectAssistant() {}

ObjectAssistant.prototype = {
  object_template: {
    '.avatar': function(data, element) {
      element.attr({
        'src': data.creator.small_avatar_url,
        'alt': data.creator.login + "'s avatar"
      });
    },
    '.object_content': function(data, element) {
      if (data.object_type == 'checkin')
        element.hide();
    },
    '.username': "{creator.login}",
    '.place': "{place.name}",
    '.time': "{created_at_as_words} ago",
    '.photo': function(data, element) {
      if (data.photo)
        element.attr({
          'src': data.photo,
          'alt': data.creator.login + "'s photo"
        });
      else
        element.hide();
    },
    '.note': function(data, element) {
      if (data.body)
        element.text(data.body);
      else
        element.hide();
    }
  },
  comment_template: {
    '.avatar': function(data, element) {
      element.attr({
        'src': data.user.smaller_avatar_url,
        'alt': data.user.login + "'s avatar"
      });
    },
    '.username': "<strong>{user.login}</strong> says:",
    '.comment': "{comment}",
    '.time': "{created_at_as_words} ago"
  },
  setup: function() {
    $j('#object')
      .item(bk.object)
      .chain(this.object_template)
      .show();
    if (bk.object.comments_count > 0) {
      this.controller.setupWidget('loading', { spinnerSize: Mojo.Widget.spinnerLarge }, { spinning: true });
      bk.api.comments(bk.object.id, function(response) {
        $j('#comments')
          .items($j.evalJSON(response))
          .chain(this.comment_template)
          .show();
        $j('#loading').hide();
      }.bind(this));
    }
    this.controller.setupWidget('post', {}, { buttonLabel: "Post a comment" });
    this.controller.listen('post', Mojo.Event.tap, function() {
      Mojo.Controller.stageController.pushScene('comment');
    });
    this.controller.listen('details', Mojo.Event.tap, function() {
      bk.scene('place');
    });
    this.controller.listen('avatar', Mojo.Event.tap, function() {
      bk.scene('person')
    })
  },
  activate: function(new_comment) {
    if (new_comment) {
      $j('#comments').hide();
      $j('#loading').show();
      bk.api.comments(bk.object.id, function(response) {
        $j('#comments')
          .items('replace', $j.evalJSON(response))
          .chain(this.comment_template)
          .show();
        $j('#loading').hide();
      }.bind(this));
    }
  }
};