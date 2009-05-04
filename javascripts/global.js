var $j = jQuery.noConflict();

var bk= {
  username: '',
  password: ''
}

function replace_emoji(text) {
  $j.each(emoji_replacements, function() {
    var character = eval('"\\u' + this + '"');
    if ($j.string(text).include(character))
      text = text.replace(character, '<img src="/images/emoji/emoji-' + this + '.png" class="emoji" />');
  });
  return text;
}