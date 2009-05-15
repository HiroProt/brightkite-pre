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
  object: {},
  scene: function(target) {
    var scenes = Mojo.Controller.stageController.getScenes();
    if (scenes.length > 1) {
      $j(scenes).each(function(index, scene) {
        if (scene != Mojo.Controller.stageController.activeScene())
          scene.popScene();
      });
    }
    Mojo.Controller.stageController.swapScene(target);
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
          request.setRequestHeader('Authorization', "Basic " + Base64.encode(bk.credentials.username + ':' + bk.credentials.password));
        },
        success: success_callback,
        error: function() {
          console.log("Error: ajax request failed");
          if (typeof(error_callback) != 'undefined')
            error_callback();
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
          }, function() {
            console.log("Invalid login");
            bk.credentials.username = '';
            bk.credentials.password = '';
            cookie.remove();
            $('login').mojo.deactivate();
        })
      });
    },
    load: function() {
      bk.api.call('/people/' + bk.credentials.username + '.json', 'get', {}, function(response) {
        bk.person = $j.evalJSON(response);
        bk.scene('home');
      });
    },
    checkin: function(id) {
      bk.api.call('/places/' + id + '/checkins.json', 'post', {}, function(response) {
        bk.scene('nearby');
      });
    },
    note: function(id, body) {
      bk.api.call('/places/' + id + '/notes.json', 'post', {
          'note[body]': body
        }, function() {
          bk.scene('nearby');
      });
    },
    photo: function() {
      Mojo.Controller.stageController.pushScene(
        { appId :'com.palm.app.camera', name: 'capture' },
        { sublaunch : true }
      );
      console.log("camera done");
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
    }
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