var fs = require("fs");

var data = "Message in a file ";

fs.writeFile("tmp.txt", data, function(err) {
    if (err)
        console.log(err);
    else
        console.log("Write operation complete.");
});

var empty = "";

fs.readFile("tmp.txt", function(err, empty)
{
    if (err)
        console.log(err);
    else
        console.log(empty.toString());
})