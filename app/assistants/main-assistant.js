function MainAssistant() {}

MainAssistant.prototype.setup = function() {
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
  if (credentials && credentials.get() && credentials.get().username != '')
    Mojo.Controller.stageController.swapScene('home');
};

MainAssistant.prototype.login = function() {
  var username = this.username_model.value;
  var password = this.password_model.value;
  var credentials = new Mojo.Model.Cookie('credentials');
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
            credentials.put({
              username: username,
              password: password
            });
            Mojo.Controller.stageController.swapScene('home');
          },
          error: function(response) {
            credentials.remove();
            Mojo.Log.error("Invalid login");
          },
          complete: function() {
            $('login').mojo.deactivate();
          }
        });
      }
    });
  }
};