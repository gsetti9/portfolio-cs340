window.templates = window.templates || {}
window.templates["textQuestion"] = function anonymous(locals, escapeFn, include, rethrow
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
  , __lines = "<div class=\"question text-question\" \r\n     data-type=\"Text\" \r\n     data-question-number=\"<%= questionNumber %>\">\r\n\r\n  <label>Question:</label>\r\n  <textarea class=\"question-text\" placeholder=\"Enter your question here\"></textarea>\r\n\r\n  <label>Answer:</label>\r\n  <textarea class=\"question-answer\" placeholder=\"Enter the correct answer here\"></textarea>\r\n\r\n  <button type=\"button\" class=\"remove-question-btn\">Remove Question</button>\r\n</div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<div class=\"question text-question\" \r\n     data-type=\"Text\" \r\n     data-question-number=\"")
    ; __line = 3
    ; __append(escapeFn( questionNumber ))
    ; __append("\">\r\n\r\n  <label>Question:</label>\r\n  <textarea class=\"question-text\" placeholder=\"Enter your question here\"></textarea>\r\n\r\n  <label>Answer:</label>\r\n  <textarea class=\"question-answer\" placeholder=\"Enter the correct answer here\"></textarea>\r\n\r\n  <button type=\"button\" class=\"remove-question-btn\">Remove Question</button>\r\n</div>")
    ; __line = 12
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}