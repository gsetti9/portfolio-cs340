window.templates = window.templates || {}
window.templates["choice"] = function anonymous(locals, escapeFn, include, rethrow
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
  , __lines = "<div class=\"choice\">\r\n  <label>Choice <%= index + 1 %>:</label>\r\n  <input type=\"text\" class=\"choice-text\" placeholder=\"Enter answer text\">\r\n\r\n  <% if (type === \"Single-choice\") { %>\r\n    <label>Correct?</label>\r\n    <input type=\"radio\" \r\n           name=\"correct-choice-q<%= questionNumber %>\" \r\n           class=\"choice-correct-radio\">\r\n  <% } else if (type === \"Multi-choice\") { %>\r\n    <label>Correct?</label>\r\n    <input type=\"checkbox\" class=\"choice-correct-checkbox\">\r\n  <% } %>\r\n</div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<div class=\"choice\">\r\n  <label>Choice ")
    ; __line = 2
    ; __append(escapeFn( index + 1 ))
    ; __append(":</label>\r\n  <input type=\"text\" class=\"choice-text\" placeholder=\"Enter answer text\">\r\n\r\n  ")
    ; __line = 5
    ;  if (type === "Single-choice") { 
    ; __append("\r\n    <label>Correct?</label>\r\n    <input type=\"radio\" \r\n           name=\"correct-choice-q")
    ; __line = 8
    ; __append(escapeFn( questionNumber ))
    ; __append("\" \r\n           class=\"choice-correct-radio\">\r\n  ")
    ; __line = 10
    ;  } else if (type === "Multi-choice") { 
    ; __append("\r\n    <label>Correct?</label>\r\n    <input type=\"checkbox\" class=\"choice-correct-checkbox\">\r\n  ")
    ; __line = 13
    ;  } 
    ; __append("\r\n</div>")
    ; __line = 14
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}