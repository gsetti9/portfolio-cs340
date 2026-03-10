// This is the same compiler from class. Makes ejs templates into functions 
// in windows.templates that can generate template HTML on the clientside using 
// the commands found in package.json["scripts"].

var path = require("path")
var fs = require("fs")
var ejs = require("ejs")

var templatePath = process.argv[2]
var outputPath = process.argv[3]
if (!templatePath || !outputPath) {
  throw new Exception("Template path and output path must be specified")
}

var templateExt = path.extname(templatePath)
var templateName = path.basename(templatePath, templateExt)

var template = fs.readFileSync(templatePath, "utf-8")
var templateFn = ejs.compile(template, { client: true })

var output = "window.templates = window.templates || {}\n"
output += "window.templates[\"" + templateName + "\"] = " + templateFn
fs.writeFileSync(outputPath, output)
