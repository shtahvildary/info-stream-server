var ffmpeg = require('fluent-ffmpeg')

function startCallback() {
  console.log('started')
  // do something when encoding is done 
}
function endCallback() {
  console.log('finished')
  // do something when encoding is done 
}
class StreamCreator {
  constructor(config) {
    this.config = config
    this.inputs = config.inputs

  }

  // Below is FFMPEG converting MP4 to HLS with reasonable options.
  // https://www.ffmpeg.org/ffmpeg-formats.html#hls-2


  coding() {
    this.inputs.map((i, index) => {
      console.log('i: ',i.address)


      ffmpeg(i.address, { timeout: 432000 }).addOptions([
      // ffmpeg('/Users/shadab/Downloads/video_2017-08-09_18-26-12.mp4', { timeout: 432000 }).addOptions([
      // ffmpeg('http://172.16.16.103:1383', { timeout: 432000 }).addOptions([
        '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
        '-level 3.0',
        '-s 720x576',          // 640px width, 360px height output video dimensions
        '-start_number 0',     // start the first .ts segment at index 0
        '-hls_time 10',        // 10 second segment duration
        '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
        '-f hls'               // HLS format
        // ]).output('/Users/shadab/Desktop/hls-test/'+i.name+'.m3u8').on('start',startCallback).on('end', endCallback).run()
        // ]).output('/Users/shadab/Desktop/hls-test/out.m3u8').on('start',startCallback).on('end', endCallback).run()
        ]).output('d:/hls-test/hls-test/'+i.name+'.m3u8').on('start',startCallback).on('end', endCallback).run()
      // ]).output('d:/hls-test/varzesh.m3u8').on('start',startCallback).on('end', endCallback).run()
    })
  }
}

module.exports = StreamCreator
