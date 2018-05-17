var map = [];
var fs = require('fs');

for(x = 0; x < 60; x++){
    var row = [];
    for(y = 0; y < 30; y++){
        if(x == 0 || x == 59 || y == 0 || y == 29 || Math.random() > 0.7){
            row.push(0);
        }else{
            row.push(1);
        }
    }
    map.push(row);
}

var file = fs.createWriteStream('./map.txt');
file.on('error', function(err) { /* error handling */
    console.log(err);
});
map.forEach(function(v) { file.write(JSON.stringify(v) + ',\n'); });
file.end();
