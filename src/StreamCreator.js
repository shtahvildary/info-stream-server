const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require("fluent-ffmpeg");
var request = require("request");

class StreamCreator {
  
  constructor() {
    this.runningCommands = {};
  // var  date=new Date();
  }

  // https://www.ffmpeg.org/ffmpeg-formats.html#hls-2

  callFfmpeg(address, name, id) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    console.log("ffmpeg path:",ffmpegPath,ffmpeg.path, ffmpeg.version);
    var command = ffmpeg(address, { timeout: 432000 })
      .addOptions([
        "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
        "-level 3.0",
        "-s 720x576", // 720px width, 576px height output video dimensions
        "-start_number 0", // start the first .ts segment at index 0
        "-hls_time 2", // 2 second segment duration
        // '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments",

        "-f hls", // HLS format
        "-loop 1",
        // "-hwaccel"

        "-f hls" // HLS format

      ])
      // .output("/Users/shadab/Desktop/hls-test/" + name + ".m3u8")
      .output(' /fanavari/hlsFiles/' + name + '.m3u8')
      // .output('d:/fanavari/hlsFiles/' + name + '.m3u8');
    this.runningCommands[id]= command;
    
    command.on("start", ()=> {
      console.log(name + " is started with address: " + address + ":)"+new Date());
      request.post(
        global.serverAddress + "/streamServer/hasChanged",
        {json:{ name, address,id, playState: 1 ,changeStateTime:Date.now()}},

        (err, body, response) => {
          //////////
        }
      )
    })
      .on("progress",  (progress)=> {

        // console.log(name+ ': ... frames: ' + progress.frames);
      })
      // .on('stderr', function(stderrLine) {
      //   console.log('Stderr output: ' + stderrLine);
      // })
      .on('error', (err, stdout, stderr)=> {
        delete this.runningCommands[id];
        console.log(name + " has stoped :("+new Date());
        request.post(
          global.serverAddress + "/streamServer/hasChanged",
          { json: { id, playState: 0 ,changeStateTime:Date.now()} },
          (err, body, response) => {
            //////////
            console.log('Cannot process video, there is an error ' + err);
            //   console.log('Cannot process video: ' + err.message);
          }
          )
      })
      .on("end", ()=> {
        delete this.runningCommands[id];

        console.log(name + " has stoped :("+new Date());
        request.post(
          global.serverAddress + "/streamServer/hasChanged",
          { json: { id, playState: 0 ,changeStateTime:Date.now()} },
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
      // .output('d:/fanavari/hlsFiles/' + name + '.m3u8')
      .output('/fanavari/hlsFiles/' + name + '.m3u8')

      .on("start", function () {
        console.log(name + " is started :)"+new Date());
      })
      .on("progress", function (progress) {
        console.log(name + ': ... frames: ' + progress.frames);
      }).on('stderr', function (stderrLine) {
        console.log('Stderr output: ' + stderrLine);
      }).on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
      }).on("end", function () {
        console.log(name + " has stoped :("+new Date());
        request.post(
          global.serverAddress + "/streamServer/hasChanged",
          { json: { name, address ,changeStateTime:Date.now()} },
          (err, body, response) => {
            //////////
          }
        );
      })
      .run();
  }

  start(inputs) {
    inputs.forEach(async (i, index) => {
      if (i.dshow === 0)
        this.callFfmpeg(i.address, i.name,i.id);
      else this.dShowFfmpeg(i.address, i.name)
    });
  }
  stop(id) {
    if(!this.runningCommands[id]){
      request.post(
        global.serverAddress + "/streamServer/hasChanged",
        { json: { id, playState: 0 ,changeStateTime:Date.now()} },
        (err, body, response) => {
        }
      );
      return false;
    }
    this.runningCommands[id].kill();
    // stream.ffmpegProc.stdin.write('q');
    return true;
  };
}

module.exports = StreamCreator;
