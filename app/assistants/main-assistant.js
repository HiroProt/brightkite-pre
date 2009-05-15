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

    Mojo.Event.listen($('login'), Mojo.Event.tap, this.login.bind(this));
    
    var cookie = new Mojo.Model.Cookie('credentials');
    if (cookie && cookie.get() && cookie.get().username && cookie.get().password) {
      var username = cookie.get().username;
      var password = cookie.get().password;
      if (username != '' && password != '')
        bk.api.login(username, password);
    }
  },
  login: function() {
    bk.api.login(this.username_model.value, this.password_model.value);
  }
};