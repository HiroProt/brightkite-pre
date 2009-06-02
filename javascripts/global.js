var $j = jQuery.noConflict();

var bk = {
  credentials: {
    username: '',
    password: ''
  },
  person: {},
  location: {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    place: {}
  },
  place: {
    name: '',
    display_location: '',
    id: ''
  },
  view_place: {},
  view_person: {},
  object: {},
  scene: function(target, only) {
    if (only == true)
      Mojo.Controller.stageController.popScenesTo(target);
    Mojo.Controller.stageController.swapScene(target);
    /*if (scenes.length > 1) {
      $j(scenes).each(function(index, scene) {
        if (scene != Mojo.Controller.stageController.activeScene())
          scene.popScene();
      });
    }*/
  },
  api: {
    call: function(path, type, data, success_callback, error_callback) {
      console.log("API call: " + path + " (" + type + ")");
      data.dummy = true; // workaround for webos turning empty post requests into gets
      /*console.log("API call: " + 'http://brightkite.com' + path);*/
      $j.ajax({
        url: 'http://brightkite.com' + path,
        type: type,
        data: data,
        beforeSend: function(request) {
          //if (bk.credentials.username && bk.credentials.password)
            request.setRequestHeader('Authorization', "Basic " + Base64.encode(bk.credentials.username + ':' + bk.credentials.password));
        },
        success: function(response) {
          if (typeof(success_callback) != 'undefined')
            success_callback(response);
        },
        error: function(response) {
          console.log("Error: ajax request failed");
          if (typeof(error_callback) != 'undefined')
            error_callback(response);
        }
      });
    },
    login: function(username, password) {
      var cookie = new Mojo.Model.Cookie('credentials');
      bk.credentials.username = username;
      bk.credentials.password = password;
      bk.api.call('/account/logout', 'get', {}, function() {
        bk.api.call('/people/' + bk.credentials.username + '/friendstream.json', 'get', {}, function() {
            cookie.put({
              username: bk.credentials.username,
              password: bk.credentials.password
            });
            bk.api.load();
          }, function(response) {
            console.log("Invalid login");
            bk.credentials.username = '';
            bk.credentials.password = '';
            cookie.remove();
            $('login').mojo.deactivate();
            bk.error(response.responseText)
        })
      });
    },
    load: function() {
      bk.api.call('/people/' + bk.credentials.username + '.json', 'get', {}, function(response) {
        bk.person = $j.evalJSON(response);
        bk.api.call('/people/' + bk.credentials.username + '/config.json', 'get', {}, function(config_response) {
          bk.person.config = $j.evalJSON(config_response);
          bk.scene('home', true);
        });
      });
    },
    checkin: function(id) {
      bk.api.call('/places/' + id + '/checkins.json', 'post', {}, function(response) {
        bk.scene('nearbystream');
      });
    },
    note: function(id, body) {
      bk.api.call('/places/' + id + '/notes.json', 'post', {
          'note[body]': body
        }, function() {
          bk.scene('nearbystream');
      });
    },
    photo: function() {
      Mojo.Controller.stageController.pushScene(
        { appId :'com.palm.app.camera', name: 'capture' },
        { sublaunch : true }
      );
    },
    stream: function(path, callback) {
      bk.api.call(path, 'get', {}, callback);
    },
    comments: function(id, callback) {
      bk.api.call('/objects/' + id + '/comments.json', 'get', {}, callback);
    },
    comment: function(id, comment) {
      bk.api.call('/objects/' + id + '/comments.json', 'post', {
          'comment[comment]': comment
        }, function() {
          Mojo.Controller.stageController.popScene(true);
        }
      );
    },
    privacy: function(mode, callback) {
      bk.api.call('/people/' + bk.credentials.username + '/config.json', 'post', {
        '_method': 'put',
        'person[privacy_mode]': mode
      }, callback);
    },
    signup: function(login, email, password, password_confirmation) {
      var data = {
        'user[login]': login,
        'user[email]': email,
        'user[password]': password,
        'user[password_confirmation]': password_confirmation
      };
      bk.api.call('/account/signup', 'post', data, function(response) {
          console.log("signup success: " + response);
          bk.api.login(login, password);
        }, function(response) {
          console.log("signup error: " + response);
      });
    }
  },
  error: function(message) {
    $j('#error')
      .show()
      .find('.error-message').text(message);
  },
  app_menu: { items: [
    { label: "Something", command: 'do-something' },
    { label: "Somewhere", command: 'do-somewhere' }
  ]}
}

function replace_emoji(text) {
  $j.each(emoji_replacements, function() {
    var character = eval('"\\u' + this + '"');
    if ($j.string(text).include(character))
      text = text.replace(character, '<img src="/images/emoji/emoji-' + this + '.png" class="emoji" />');
  });
  return text;
}