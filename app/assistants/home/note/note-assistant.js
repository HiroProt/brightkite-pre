function NoteAssistant() {}

NoteAssistant.prototype = {
  setup: function() {
    this.body_model = { value: "" };
    
    this.controller.setupWidget('privacy', { trueLabel: "Private", falseLabel: "Public" }, { value: "ON" });
    this.controller.setupWidget('body', { multiline: true }, this.body_model);
    this.controller.setupWidget('post', { type: Mojo.Widget.activityButton }, { buttonLabel: "Post" });
    
    this.controller.listen('post', Mojo.Event.tap, this.post.bind(this));
    
    $j('p span').text(bk.place.name);
  },
  post: function() {
    var url = 'http://brightkite.com/places/' + bk.place.id + '/notes.json';
    $j.ajax({
      url: url,
      type: 'POST',
      data: { 'note[body]': this.body_model.value },
      beforeSend: function(request) {
        request.setRequestHeader('Authorization', "Basic " + Base64.encode(bk.username + ':' + bk.password));
      },
      success: function(response) {
        console.log("success: " + response);
        Mojo.Controller.stageController.swapScene('friends');
      },
      error: function(response) {
        console.log("error: " + response);
      }
    });
  }
};