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
  api: {
    call: function(path, type, data, success_callback, error_callback) {
      console.log("API call: " + 'http://brightkite.com' + path);
      $j.ajax({
        url: 'http://brightkite.com' + path,
        type: type,
        data: data,
        beforeSend: function(request) {
          request.setRequestHeader('Authorization', "Basic " + Base64.encode(bk.credentials.username + ':' + bk.credentials.password));
        },
        success: success_callback,
        error: function(response, text, error) {
          console.log("Ajax request failed");
          console.log("headers: " + response.getAllResponseHeaders());
          console.log("readyState: " + response.readyState);
          console.log("responseText: " + response.responseText);
          console.log("status: " + response.status);
          console.log("statusText: " + response.statusText);
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
        Mojo.Controller.stageController.swapScene('home');
      });
    },
    checkin: function(id) {
      bk.api.call('/places/' + id + '/checkins.json', 'post', {}, function(response) {
        Mojo.Controller.stageController.swapScene('friends');
      });
    },
    note: function(id, body) {
      bk.api.call('/places/' + id + '/notes.json', 'post', {
          'note[body]': body
        }, function(response) {
          Mojo.Controller.stageController.swapScene('friends');
      });
    },
    photo: function() {
      
    },
    stream: function(path, callback) {
      bk.api.call(path, 'get', {}, callback);
    }
  }
}

function replace_emoji(text) {
  $j.each(emoji_replacements, function() {
    var character = eval('"\\u' + this + '"');
    if ($j.string(text).include(character))
      text = text.replace(character, '<img src="/images/emoji/emoji-' + this + '.png" class="emoji" />');
  });
  return text;
}