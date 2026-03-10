var postTemplate = function anonymous(locals, escapeFn, include, rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<div class=\"post\" data-price=\"<%= price %>\" data-city=\"<%= city %>\" data-condition=\"<%= condition %>\">\n  <div class=\"post-contents\">\n    <div class=\"post-image-container\">\n      <img src=\"<%= photoUrl %>\" alt=\"<%= description %>\">\n    </div>\n    <div class=\"post-info-container\">\n      <a href=\"#\" class=\"post-title\"><%= description %></a> <span class=\"post-price\">$<%= price %></span> <span class=\"post-city\">(<%= city %>)</span>\n    </div>\n  </div>\n</div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<div class=\"post\" data-price=\"")
    ; __append(escapeFn( price ))
    ; __append("\" data-city=\"")
    ; __append(escapeFn( city ))
    ; __append("\" data-condition=\"")
    ; __append(escapeFn( condition ))
    ; __append("\">\n  <div class=\"post-contents\">\n    <div class=\"post-image-container\">\n      <img src=\"")
    ; __line = 4
    ; __append(escapeFn( photoUrl ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( description ))
    ; __append("\">\n    </div>\n    <div class=\"post-info-container\">\n      <a href=\"#\" class=\"post-title\">")
    ; __line = 7
    ; __append(escapeFn( description ))
    ; __append("</a> <span class=\"post-price\">$")
    ; __append(escapeFn( price ))
    ; __append("</span> <span class=\"post-city\">(")
    ; __append(escapeFn( city ))
    ; __append(")</span>\n    </div>\n  </div>\n</div>")
    ; __line = 10
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

};