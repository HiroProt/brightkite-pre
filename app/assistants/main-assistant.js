function MainAssistant() {}

MainAssistant.prototype = {
  setup: function() {
    this.username_model = { value: "" };
    this.password_model = { value: "" };

    this.controller.setupWidget('username',
      { hintText: 'Username' },
      this.username_model
    );
    
    this.controller.setupWidget('password',
      { hintText: 'Password' },
      this.password_model
    );

    this.controller.setupWidget('login',
      { type: Mojo.Widget.activityButton },
      { buttonLabel: "Log in" }
    );
    
    this.controller.setupWidget('signup', {}, { buttonLabel: "Sign up" });

    Mojo.Event.listen($('login'), Mojo.Event.tap, this.login.bind(this));
    Mojo.Event.listen($('signup'), Mojo.Event.tap, this.signup);
    
    var cookie = new Mojo.Model.Cookie('credentials');
    if (cookie && cookie.get() && cookie.get().username && cookie.get().password) {
      var username = cookie.get().username;
      var password = cookie.get().password;
      if (username != '' && password != '')
        bk.api.login(username, password);
    }
  },
  login: function() {
    if (this.username_model.value == "") {
      bk.error("Username can't be empty");
      $('login').mojo.deactivate();
    }
    else if (this.password_model.value == "") {
      bk.error("Password can't be empty");
      $('login').mojo.deactivate();
    }
    else
      bk.api.login(this.username_model.value, this.password_model.value);
  },
  signup: function() {
    bk.scene('signup');
  }
};