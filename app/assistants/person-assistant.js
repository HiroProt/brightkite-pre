function PersonAssistant() {}

PersonAssistant.prototype = {
  setup: function() {
    $j('#person').text(bk.object.creator.login);
  }
};