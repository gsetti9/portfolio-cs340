const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// read the template file
const templatePath = path.join(__dirname, 'views', 'postTemplate.ejs');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// compile the template to a JavaScript function
const compiledTemplate = ejs.compile(templateContent, { client: true });

// create output file content
const outputContent = `var postTemplate = ${compiledTemplate.toString()};`;

// write to the static directory
const outputPath = path.join(__dirname, 'static', 'postTemplate.js');
fs.writeFileSync(outputPath, outputContent);

console.log('Template compiled successfully to static/postTemplate.js');