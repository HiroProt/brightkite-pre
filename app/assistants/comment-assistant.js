function CommentAssistant() {}

CommentAssistant.prototype = {
  setup: function() {
    this.comment_model = { value: "" };
    
    this.controller.setupWidget('comment', { multiline: true }, this.comment_model);
    this.controller.setupWidget('post', { type: Mojo.Widget.activityButton }, { buttonLabel: "Post" });
    
    this.controller.listen('post', Mojo.Event.tap, this.post.bind(this));
  },
  post: function() {
    bk.api.comment(bk.object.id, this.comment_model.value);
  }
}