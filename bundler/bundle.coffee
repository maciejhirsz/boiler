
fs = require('fs')
UglifyJS = require("uglify-js2")

console.log("")
console.log("  > Reading and uglifying all js files")

files = {}

#
# Read all files
#
readFolder = (path) ->
  for item in fs.readdirSync(path)
    item = path+'/'+item
    stats = fs.statSync(item)

    if stats.isFile()
      console.log("  --- "+item)
      files[item] = UglifyJS.minify(item).code

    if stats.isDirectory()
      readFolder(item)

readFolder('./compiled')

#
# Bundle all files into javascript hash
#
bundle = []

console.log("")
console.log("  > Bundling")

for path, data of files
  path = path.replace(new RegExp('^\.\/compiled\/'), '').replace(new RegExp('\.js$'), '')

  bundle.push("  files[#{JSON.stringify(path)}] = #{JSON.stringify(data)}")

#
# Load template and inject the bundle into it
#
data = fs.readFileSync('./template.js').toString().replace('//#!files', bundle.join("\n"))

#
# Save the bundle
#
fs.writeFileSync('../package/public/js/main.js', data)

console.log("")
console.log("  > Uglify the bundle")

#
# Yes, really, read and save to same file
#
fs.writeFileSync('../package/public/js/main.js', UglifyJS.minify('../package/public/js/main.js').code)

console.log("")
console.log("  > All done!")
console.log("")
