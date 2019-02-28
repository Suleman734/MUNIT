var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var spawn = require('child_process').spawn;

app.use(bodyParser.json())

app.post('/edge2Shoe', function (req, res) {
    console.log(req.body.img.length);
    fs.writeFile("inputs/edge.jpg", req.body.img, 'base64', function(err) {
        if(err) console.log(err);

        console.log('write success');

        // python test.py --config configs/edges2shoes_folder.yaml --input inputs/edge.jpg --output_folder outputs --checkpoint models/edges2shoes.pt --a2b 1
        const pyProg = spawn('python', ['test.py', '--config', 'configs/edges2shoes_folder.yaml', '--input', 'inputs/edge.jpg', '--output_folder', 'outputs', '--checkpoint', 'models/edges2shoes.pt', '--a2b', '1']);

        pyProg.stdout.on('data', function(data) {

            console.log(data.toString());
            
            fs.readFile('outputs/output000.jpg', function read(err, data) {
                if (err) console.log(err);

                var resultImg = new Buffer(data).toString('base64');

                response = {
                    result: resultImg
                };

                res.json(response);
            });

        });

        
    });
})

var server = app.listen(8890, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("listening at http://%s:%s", host, port)
})