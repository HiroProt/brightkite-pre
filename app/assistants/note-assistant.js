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
    bk.api.note(bk.place.id, this.body_model.value);
  }
};