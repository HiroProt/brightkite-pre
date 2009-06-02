function PersonAssistant() {}

PersonAssistant.prototype = {
  setup: function() {
    $j('.palm-page-header .title').text(bk.object.creator.login);
    $j('.palm-page-header .subtitle').text("@ Some Place Name, 1234 Address St, Denver, CO - 11 minutes ago");
    $j('.palm-page-header .icon').css({
      'background': 'url(' + bk.object.creator.smaller_avatar_url + ') center center no-repeat'
    });
    
    this.controller.setupWidget('personstream', {}, { buttonLabel: bk.object.creator.login + "'s stream" });
    this.controller.setupWidget('friendship', {}, { buttonLabel: "Add to friends" });
    this.controller.setupWidget('message', {}, { buttonLabel: "Send message" });
    this.controller.setupWidget('join', {}, { buttonLabel: "Join" });
    this.controller.setupWidget('nudge', {}, { buttonLabel: "Nudge" });
    
    this.controller.listen('personstream', Mojo.Event.tap, this.personstream);
  },
  personstream: function() {
    Mojo.Controller.stageController.pushScene('personstream');
  }
};