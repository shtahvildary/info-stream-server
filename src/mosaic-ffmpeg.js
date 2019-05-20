// Based on http://pythonhackers.com/p/fluent-ffmpeg/node-fluent-ffmpeg
// and https://trac.ffmpeg.org/wiki/Create%20a%20mosaic%20out%20of%20several%20input%20videos

// Usage:
//   node ffmpeg-mosaic.js file1.mp2 file2.mp4 file3.mp4 file4.mp4
//   Generates out.mp4
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
var request = require("request");
var os = require('os');


class Mosaic {
    constructor(inputs) {
        this.inputs = inputs;
        this.runningCommands = {};

    }

    start(inputs) {
        var path;
        console.log("os type: ", os.type)
        if (os.type == "Darwin") path = "/Users/shadabtahvildary/Desktop/hlsFiles/";
        else if (os.type == "Linux") path = "/fanavari/hlsFiles/";
        else path = "d:/fanavari/hlsFiles/";

        // console.log("inputs:::::::",inputs)
        ffmpeg.setFfmpegPath(ffmpegPath);
        // console.log("ffmpeg path:",ffmpegPath,ffmpeg.path, ffmpeg.version);
        var command = ffmpeg()
        // Change this to the desired output resolution  
        var x = 720, y = 576;

        // var videoInfo = [];
        // var videoInfo=this.inputs
        var { id, name, address } = inputs
        var videoInfo = inputs.mosaicInputs
        // console.log("videoInfo: ",inputs)
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
        var address
        var { mosaicDimensions } = inputs

        var index = 0;
        for (var j = 0; j <= y - y / mosaicDimensions.y; j += y / mosaicDimensions.y)
            for (var i = 0; i <= x - x / mosaicDimensions.x; i += x / mosaicDimensions.x) {

                ///////////////////////////////////////////////////////////////////////////

                // address=path+videoInfo[index].name+".m3u8"
                // address="D:/fanavari/hlsFiles/"+videoInfo[index].name+".m3u8"
                // address="/fanavari/hlsFiles/"+videoInfo[index].name+".m3u8"

                //to read from *.m3u8 files:
                address = "http://" + videoInfo[index].streamServer + ":8000/" + videoInfo[index].name + ".m3u8"
                videoInfo[index].command = command.addInput(address)

                //to read from videoInfo[index].address :
                // videoInfo[index].command=command.addInput(videoInfo[index].address)
                //////////////////////////////////////////////////////////////////////////
                
                videoInfo[index].coord = { x: i, y: j }
                index++
            }


        var complexFilter = [];
        complexFilter.push('nullsrc=size=' + x + 'x' + y + ' [base0]');
        // Scale each video
        videoInfo.forEach(function (val, index, array) {
            complexFilter.push({
                filter: 'setpts=PTS-STARTPTS, scale', options: [x / mosaicDimensions.x, y / mosaicDimensions.y],
                inputs: index + ':v', outputs: 'block' + index
            });
        });
        // Build Mosaic, block by block
        videoInfo.forEach(function (val, index, array) {

            complexFilter.push({
                filter: 'overlay', options: { shortest: 0, x: val.coord.x, y: val.coord.y },
                inputs: ['base' + index, 'block' + index], outputs: 'base' + (index + 1)
            });


        });

        // var outFile = '/Users/shadabtahvildary/desktop/hlsFiles/'+name+'.m3u8';
        // var outFile = 'D:/fanavari/hlsFiles/' + name + '.m3u8'; 
        // var outFile = '/fanavari/hlsFiles/' + name + '.m3u8';
        var outFile = path + name + '.m3u8';

        command
            .addOptions([
                "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
                "-level 3.0",
                "-s 720x576", // 720px width, 576px height output video dimensions
                "-start_number 0", // start the first .ts segment at index 0
                "-hls_time 2", // 2 second segment duration
                // '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
                "-hls_flags delete_segments",
                "-f hls", // HLS format,
                "-loop 1",
                "-tune zerolatency",
                "-aspect 16:9",
                "-r 25",
                "-b:v 3000k",
                "-minrate 3000k",
                "-maxrate 3000k",
                "-bufsize 15000k",
                // "-preset: v ultrafast", //to reduce cpu usage

                //"-hwaccel"
            ])
            // .complexFilter(complexFilter, 'base4')
            .complexFilter(complexFilter, 'base' + (videoInfo.length))
            // .complexFilter(complexFilter, 'base16')
            .output(outFile)
        this.runningCommands[id] = command;

        command.on('start', () => {
            console.log('started processing ' + name);
            request.post(
                global.serverAddress + "/streamServer/hasChanged",
                { json: { name, address, id, playState: 1 } },

                (err, body, response) => {
                    //////////
                }
            )
        })
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
                console.log("id: ", id)
                console.log("this.runningCommands: ", this.runningCommands)
                delete this.runningCommands[id];
                console.log(name + " has stoped :(" + Date.now().toString());
                request.post(
                    global.serverAddress + "/streamServer/hasChanged",
                    { json: { id, playState: 0 } },
                    (err, body, response) => {
                        //////////
                        console.log('Cannot process video: ' + err);
                        //   console.log('Cannot process video: ' + err.message);
                    }
                )
            })
            .on('progress', (progress) => {
                // console.log('... frames: ' + progress.frames);
            })
            .on('end', () => {
                console.log('Finished processing');
                delete this.runningCommands[id];

                console.log(name + " has stoped :(" + Date.now().toString());
                request.post(
                    global.serverAddress + "/streamServer/hasChanged",
                    { json: { id, playState: 0 } },
                    (err, body, response) => {
                        //////////
                    })
            }).run();
    }

    stop(id) {
        if (!this.runningCommands[id]) {
            request.post(
                global.serverAddress + "/streamServer/hasChanged",
                { json: { id, playState: 0 } },
                (err, body, response) => {
                }
            );
            return false;
        }
        this.runningCommands[id].kill();
        // stream.ffmpegProc.stdin.write('q');
        return true;
    }
}


module.exports = Mosaic
