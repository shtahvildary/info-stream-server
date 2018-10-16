// Based on http://pythonhackers.com/p/fluent-ffmpeg/node-fluent-ffmpeg
// and https://trac.ffmpeg.org/wiki/Create%20a%20mosaic%20out%20of%20several%20input%20videos

// Usage:
//   node ffmpeg-mosaic.js file1.mp2 file2.mp4 file3.mp4 file4.mp4
//   Generates out.mp4
var ffmpeg = require('fluent-ffmpeg');
class Mosaic {
    constructor(inputs) {
        this.inputs = inputs
    }

    start() {
    var command = ffmpeg()
    // Change this to the desired output resolution  
    var x = 720, y = 576;

    // var videoInfo = [];
    var videoInfo=this.inputs

    // Parse arguments
    // var args = process.argv.slice(2);
    // // var args = process.argv.slice(2);
    // console.log('args: ',args)
    // args.forEach(function (val, index, array) {
    //     var filename = val;
    //     console.log(index + ': Input File ... ' + filename);

    //     videoInfo.push({
    //         filename: filename
    //     });
    //     command = command.addInput(filename);
    // });

    videoInfo.map((i,index)=>{
        i.command=command.addInput(i.address)
    })
    
        videoInfo[0].coord = { x: 0, y: 0 };
        videoInfo[1].coord = { x: x / 4, y: 0 };
        videoInfo[2].coord = { x: x / 2, y: 0 };
        videoInfo[3].coord = { x: 3 * x / 4, y: 0 };

        videoInfo[4].coord = { x: 0, y: y / 4 };
        videoInfo[5].coord = { x: x / 4, y: y / 4 };
        videoInfo[6].coord = { x: x / 2, y: y / 4 };
        videoInfo[7].coord = { x: 3 * x / 4, y: y / 4 };

        videoInfo[8].coord = { x: 0, y: y / 2 };
        videoInfo[9].coord = { x: x / 4, y: y / 2 };
        videoInfo[10].coord = { x: x / 2, y: y / 2 };
        videoInfo[11].coord = { x: 3 * x / 4, y: y / 2 };

        videoInfo[12].coord = { x: 0, y: 3 * y / 4 };
        videoInfo[13].coord = { x: x / 4, y: 3 * y / 4 };
        videoInfo[14].coord = { x: x / 2, y: 3 * y / 4 };
        videoInfo[15].coord = { x: 3 * x / 4, y: 3 * y / 4 };

        // videoInfo[0].coord = { x: 0, y: 0 };
        // videoInfo[1].coord = { x: x/2, y: 0 };
        // videoInfo[2].coord = { x: 0, y: y/2 };
        // videoInfo[3].coord = { x: x/2, y: y/2 };

        var complexFilter = [];
        complexFilter.push('nullsrc=size=' + x + 'x' + y + ' [base0]');
        // Scale each video
        videoInfo.forEach(function (val, index, array) {
            complexFilter.push({
                filter: 'setpts=PTS-STARTPTS, scale', options: [x / 4, y / 4],
                // filter: 'setpts=PTS-STARTPTS, scale', options: [x/2, y/2],
                inputs: index + ':v', outputs: 'block' + index
            });
        });
        // Build Mosaic, block by block
        videoInfo.forEach(function (val, index, array) {
            console.log('val: ',val)
            complexFilter.push({
                filter: 'overlay', options: { shortest: 0, x: val.coord.x, y: val.coord.y },
                inputs: ['base' + index, 'block' + index], outputs: 'base' + (index + 1)
            });
        });

        var outFile = 'd:/hls-test/mosaic.m3u8';
        // var outFile = 'mosaic.mp4';

        command
            .complexFilter(complexFilter, 'base16')
            .save(outFile)
            .on('start',function(){
                console.log('started processing');
            })
            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('progress', function (progress) {
                console.log('... frames: ' + progress.frames);
            })
            .on('end', function () {
                console.log('Finished processing');
            });
    }
}


module.exports = Mosaic
