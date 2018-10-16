var ffmpeg = require("fluent-ffmpeg");
var request = require("request");

class StreamCreator {
  constructor(inputs) {
    this.inputs = inputs;
  }

  // https://www.ffmpeg.org/ffmpeg-formats.html#hls-2

  callFfmpeg(address, name) {
    ffmpeg(address, { timeout: 432000 })
      .addOptions([
        "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
        "-level 3.0",
        "-s 720x576", // 720px width, 576px height output video dimensions
        "-start_number 0", // start the first .ts segment at index 0
        "-hls_time 2", // 2 second segment duration
        // '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments",
        "-f hls" // HLS format
      ])
      // .output("/Users/shadab/Desktop/hls-test/" + name + ".m3u8")
      // ]).output('/Users/shadab/Desktop/hls-test/out.m3u8').on('start',startCallback).on('end', endCallback).run()

      .output('d:/hls-test/' + name + '.m3u8')

      .on("start", function () {
        console.log(name + " is started with address: "+address+":)");
        request.post(
          global.serverAddress+"/streamServer/hasChanged",
          { json: { name, address,playState:0 } },
         
          (err, body, response)  =>{
            //////////
          }
        )
      })
      .on("progress", function (progress) {

        // console.log(name+ ': ... frames: ' + progress.frames);
      })
      // .on('stderr', function(stderrLine) {
      //   console.log('Stderr output: ' + stderrLine);
      // })
      .on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
      })
      .on("end", function () {
        console.log(name + " has stoped :(");
        request.post(
          global.serverAddress + "/streamServer/hasChanged",
          { json: { name, address,playState:0 } },
          (err, body, response) => {
            //////////
          }
        );
      })
      .run();
  }

  dShowFfmpeg(address, name) {
    ffmpeg(address, { timeout: 432000 })
      .addOptions([
        "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
        "-level 3.0",
        "-s 720x576", // 720px width, 576px height output video dimensions
        "-start_number 0", // start the first .ts segment at index 0
        "-hls_time 2", // 2 second segment duration
        // '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments",
        "-f dshow" // direct show format
      ])
      // .output("/Users/shadab/Desktop/hls-test/" + name + ".m3u8")
      // ]).output('/Users/shadab/Desktop/hls-test/out.m3u8').on('start',startCallback).on('end', endCallback).run()
      // ])
      .output('d:/hls-test/' + name + '.m3u8')

      .on("start", function () {
        console.log(name + " is started :)");
      })
      .on("progress", function (progress) {
        console.log(name + ': ... frames: ' + progress.frames);
      }).on('stderr', function (stderrLine) {
        console.log('Stderr output: ' + stderrLine);
      }).on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
      }).on("end", function () {
        console.log(name + " has stoped :(");
        request.post(
          global.serverAddress + "/streamServer/hasChanged",
          { json: { name, address } },
          (err, body, response) => {
            //////////
          }
        );
      })
      .run();
  }

  start() {


    console.log("inputs: ",this.inputs)
    this.inputs.forEach(async (i, index) => {
      if (i.dshow === 0)
        this.callFfmpeg(i.address, i.name);
      else this.dShowFfmpeg(i.address, i.name)
    });
  }

stop(){

  /*
  A simple solution would be to use a running command store and have a way to generate a unique ID for each command:

var runningCommands = {};
function generateID() {
  return someUniqueIdentifier;
}
Then when creating a command, generate an ID, store it, and remove it when it finishes:

var id = generateID();
runningCommands[id] = command;
command.on('end', function() {
  delete runningCommands[id];
});
command.on('error', function() {
  delete runningCommands[id];
});
And finally, add an action to kill a command by its ID:

kill: function(req, res) {
  var id = req.params('id'); // Retrieve ID from request
  if (!(id in runningCommands)) {
   // 404 for example
  }

  runningCommands[id].kill();
};
You may want to add a way for the client to retrieve the list of running jobs along with their ID.
  */

	stream.ffmpegProc.stdin.write('q');


}


}

module.exports = StreamCreator;
