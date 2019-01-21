// Based on http://pythonhackers.com/p/fluent-ffmpeg/node-fluent-ffmpeg
// and https://trac.ffmpeg.org/wiki/Create%20a%20mosaic%20out%20of%20several%20input%20videos

// Usage:
//   node ffmpeg-mosaic.js file1.mp2 file2.mp4 file3.mp4 file4.mp4
//   Generates out.mp4
var ffmpeg = require('fluent-ffmpeg');
var request = require("request");

class Mosaic {
    constructor(inputs) {
        this.inputs = inputs;
        this.runningCommands = {};

    }

    start(inputs) {
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

        videoInfo.map((i, index) => {
            // console.log("i: ",i)

            i.command = command.addInput(i.address)
        })
        console.log("sqrt(videoInfo.length): ", Math.floor(Math.sqrt(videoInfo.length)))

        // videoInfo[0].coord = { x: 0, y: 0 };
        // videoInfo[1].coord = { x: x / 4, y: 0 };
        // videoInfo[2].coord = { x: x / 2, y: 0 };
        // videoInfo[3].coord = { x: 3 * x / 4, y: 0 };

        // videoInfo[4].coord = { x: 0, y: y / 4 };
        // videoInfo[5].coord = { x: x / 4, y: y / 4 };
        // videoInfo[6].coord = { x: x / 2, y: y / 4 };
        // videoInfo[7].coord = { x: 3 * x / 4, y: y / 4 };

        // videoInfo[8].coord = { x: 0, y: y / 2 };
        // videoInfo[9].coord = { x: x / 4, y: y / 2 };
        // videoInfo[10].coord = { x: x / 2, y: y / 2 };
        // videoInfo[11].coord = { x: 3 * x / 4, y: y / 2 };

        // videoInfo[12].coord = { x: 0, y: 3 * y / 4 };
        // videoInfo[13].coord = { x: x / 4, y: 3 * y / 4 };
        // videoInfo[14].coord = { x: x / 2, y: 3 * y / 4 };
        // videoInfo[15].coord = { x: 3 * x / 4, y: 3 * y / 4 };

        videoInfo[0].coord = { x: 0, y: 0 };
videoInfo[1].coord = { x: x/2, y: 0 };
videoInfo[2].coord = { x: 0, y: y/2 };
videoInfo[3].coord = { x: x/2, y: y/2 };

        



        var complexFilter = [];
        complexFilter.push('nullsrc=size=' + x + 'x' + y + ' [base0]');
        // Scale each video
        videoInfo.forEach(function (val, index, array) {
            complexFilter.push({
                // filter: 'setpts=PTS-STARTPTS, scale', options: [x / 4, y / 4],
                filter: 'setpts=PTS-STARTPTS, scale', options: [x/2, y/2],
                inputs: index + ':v', outputs: 'block' + index
            });
        });
        // Build Mosaic, block by block
        videoInfo.forEach(function (val, index, array) {
            // console.log('val: ',val)

            complexFilter.push({
                filter: 'overlay', options: { shortest: 0, x: val.coord.x, y: val.coord.y },
                inputs: ['base' + index, 'block' + index], outputs: 'base' + (index + 1)
            });
        });

        // var outFile = '/Users/shadab/desktop/hls-test/'+name+'.m3u8';
        var outFile = 'd:/hls-test/' + name + '.m3u8';

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
                //"-hwaccel"
            ])
            .complexFilter(complexFilter, 'base4')
            // .complexFilter(complexFilter, 'base'+videoInfo.length+1)
            // .complexFilter(complexFilter, 'base16')
            .output(outFile)
        this.runningCommands[id] = command;

        console.log("hiiii")
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
                console.log(name + " has stoped :("+Date.now().toString());
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
                console.log('... frames: ' + progress.frames);
            })
            .on('end', () => {
                console.log('Finished processing');
                delete this.runningCommands[id];

                console.log(name + " has stoped :("+Date.now().toString());
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
