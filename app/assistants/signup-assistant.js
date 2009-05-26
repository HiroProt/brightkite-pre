function SignupAssistant() {}

SignupAssistant.prototype = {
  setup: function() {
    this.login_model = {};
    this.email_model = {};
    this.password_model = {};
    this.password_confirmation_model = {};
    
    this.controller.setupWidget('login', { hintText: "3-15 characters" }, this.login_model);
    this.controller.setupWidget('email', { hintText: "Must be valid" }, this.email_model);
    this.controller.setupWidget('password', { hintText: "3-40 characters" }, this.password_model);
    this.controller.setupWidget('password_confirmation', { hintText: "Password again" }, this.password_confirmation_model);
    this.controller.setupWidget('create',
      { type: Mojo.Widget.activityButton },
      { buttonLabel: "Create account" }
    );
    
    Mojo.Event.listen($('create'), Mojo.Event.tap, this.create.bind(this));
  },
  create: function() {
    bk.api.signup(this.login_model.value, this.email_model.value, this.password_model.value, this.password_confirmation_model.value);
  }
};