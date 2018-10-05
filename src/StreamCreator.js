var ffmpeg = require("fluent-ffmpeg");
var request = require("request");

class StreamCreator {
  constructor(config) {
    this.config = config;
    this.inputs = config.inputs;
  }

  // https://www.ffmpeg.org/ffmpeg-formats.html#hls-2

  callFfmpeg(address, name) {
    ffmpeg(address, { timeout: 432000 })
      .addOptions([
        // ffmpeg('/Users/shadab/Downloads/video_2017-08-09_18-26-12.mp4', { timeout: 432000 }).addOptions([

        "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
        "-level 3.0",
        "-s 720x576", // 720px width, 576px height output video dimensions
        "-start_number 0", // start the first .ts segment at index 0
        "-hls_time 10", // 10 second segment duration
        // '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
        "-hls_flags delete_segments",
        "-f hls" // HLS format
      ])
      .output("/Users/shadab/Desktop/hls-test/" + name + ".m3u8")
      // ]).output('/Users/shadab/Desktop/hls-test/out.m3u8').on('start',startCallback).on('end', endCallback).run()
      // ]).output('d:/hls-test/'+name+'.m3u8')

      .on("start", function() {
        console.log(name + " is started :)");
      })
      .on("progress", function(progress) {
        // console.log(name+ ': ... frames: ' + progress.frames);
      })
      .on("end", function() {
        console.log(name + " has stoped :(");
        request.post(
          global.serverAddress+"/streamServer/hasChanged",
          // "http://localhost:5000/api/streamServer/hasChanged",
          { json: { name, address } },
          (err, body, response) => {
            //////////
          }
        );
        // callFfmpeg(address,name)
      })
      .run();
  }
  coding() {
    console.log(this.inputs);
    this.inputs.forEach(async (i, index) => {
      this.callFfmpeg(i.address, i.name);
    });
  }
}

module.exports = StreamCreator;
