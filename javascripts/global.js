var $j = jQuery.noConflict();

var bk = {
  username: '',
  password: '',
  place: {},
  latitude: 0,
  longitude: 0,
  accuracy: 0,
  place: {
    name: '',
    display_location: '',
    id: ''
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