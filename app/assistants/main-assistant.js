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

    var credentials = new Mojo.Model.Cookie('credentials');
    if (credentials && credentials.get() && credentials.get().login)
      this.load_home(credentials.get().login);
  },
  login: function() {
    var username = this.username_model.value;
    var password = this.password_model.value;
    if (username != '' && password != '') {
      $j.ajax({
        url: 'http://brightkite.com/account/logout',
        success: function() {
          $j.ajax({
            url: 'http://brightkite.com/people/' + username + '/friendstream.json',
            beforeSend: function(request) {
              request.setRequestHeader('Authorization', "Basic " + Base64.encode(username + ':' + password));
            },
            success: function(response) {
              this.load_home(username);
            }.bind(this),
            error: function(response) {
              var credentials = new Mojo.Model.Cookie('credentials');
              credentials.remove();
              Mojo.Log.error("Invalid login (" + username + ", " + password + ")");
            },
            complete: function() {
              $('login').mojo.deactivate();
            }
          });
        }.bind(this)
      });
    }
  },
  load_home: function(username) {
    var credentials = new Mojo.Model.Cookie('credentials');
    $j.getJSON('http://brightkite.com/people/' + username + '.json', function(person) {
      console.log("got person json, loading home");
      credentials.put(person);
      Mojo.Controller.stageController.swapScene('home');
    });
  }
};