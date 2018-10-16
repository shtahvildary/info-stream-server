// const _ = require("lodash");

// function getStreams(req, res, next) {
//   let stats = {};

//   console.log("sessions: ", this.sessions);
//   this.sessions.forEach(function (session, id) {
//     if (session.isStarting) {
//       let regRes = /\/(.*)\/(.*)/gi.exec(
//         session.publishStreamPath || session.playStreamPath
//       );

//       if (regRes === null) return;

//       let [app, stream] = _.slice(regRes, 1);

//       if (!_.get(stats, [app, stream])) {
//         _.set(stats, [app, stream], {
//           publisher: null,
//           subscribers: []
//         });
//       }

//       switch (true) {
//         case session.isPublishing: {
//           console.log("stream:", stream);
//           _.set(stats, [app, stream, "publisher"], {
//             app: app,
//             stream: stream,
//             clientId: session.id,
//             connectCreated: session.connectTime,
//             bytes: session.socket.bytesRead,
//             ip: session.socket.remoteAddress,
//             audio:
//               session.audioCodec > 0
//                 ? {
//                   codec: session.audioCodecName,
//                   profile: session.audioProfileName,
//                   samplerate: session.audioSamplerate,
//                   channels: session.audioChannels
//                 }
//                 : null,
//             video:
//               session.videoCodec > 0
//                 ? {
//                   codec: session.videoCodecName,
//                   width: session.videoWidth,
//                   height: session.videoHeight,
//                   profile: session.videoProfileName,
//                   level: session.videoLevel,
//                   fps: session.videoFps
//                 }
//                 : null
//           });

//           break;
//         }
//         case !!session.playStreamPath: {
//           switch (session.constructor.name) {
//             case "NodeRtmpSession": {
//               stats[app][stream]["subscribers"].push({
//                 app: app,
//                 stream: stream,
//                 clientId: session.id,
//                 connectCreated: session.connectTime,
//                 bytes: session.socket.bytesWritten,
//                 ip: session.socket.remoteAddress,
//                 protocol: "rtmp"
//               });

//               break;
//             }
//             case "NodeFlvSession": {
//               stats[app][stream]["subscribers"].push({
//                 app: app,
//                 stream: stream,
//                 clientId: session.id,
//                 connectCreated: session.connectTime,
//                 bytes: session.req.connection.bytesWritten,
//                 ip: session.req.connection.remoteAddress,
//                 protocol: session.TAG === "websocket-flv" ? "ws" : "http"
//               });

//               break;
//             }
//           }

//           break;
//         }
//       }
//     }
//   });

//   res.json(stats);
// }

// function getStream(req, res, next) {
//   let streamStats = {
//     isLive: false,
//     viewers: 0,
//     duration: 0,
//     bitrate: 0,
//     startTime: null
//   };

//   let publishStreamPath = `/${req.params.app}/${req.params.stream}`;

//   let publisherSession = this.sessions.get(
//     this.publishers.get(publishStreamPath)
//   );

//   streamStats.isLive = !!publisherSession;
//   streamStats.viewers = _.filter(
//     Array.from(this.sessions.values()),
//     session => {
//       return session.playStreamPath === publishStreamPath;
//     }
//   ).length;
//   streamStats.duration = streamStats.isLive
//     ? Math.ceil((Date.now() - publisherSession.startTimestamp) / 1000)
//     : 0;
//   streamStats.bitrate =
//     streamStats.duration > 0
//       ? Math.ceil(
//         (_.get(publisherSession, ["socket", "bytesRead"], 0) * 8) /
//         streamStats.duration /
//         1024
//       )
//       : 0;
//   streamStats.startTime = streamStats.isLive
//     ? publisherSession.connectTime
//     : null;

//   res.json(streamStats);
// }

// exports.getStreams = getStreams;
// exports.getStream = getStream;

////////////////////////////////////////////

const { StreamCreator } = require('../../index');



/*      POST /api/streams/state/change     */
let stream_start = async (req, res) => {
  const inputs = req.body
  try {

    var tsCreator = new StreamCreator(inputs)
    tsCreator.start()


    return res.status(200).json({ stream: { inputs } });
  } catch (e) {
    console.error('error: ', e);
    return res.status(500).json({ error: e });
  }
  let stream_stop=async(req,res)=>{
    try{
      var tsCreator=new StreamCreator(inputs)
      tsCreator.stop()
      return res.status(200).json({stream:{inputs}})
    } catch(e){
      console.error('error: ', e);
      return res.status(500).json({ error: e });
    }
  }
};
module.exports = { stream_start, getStream };
