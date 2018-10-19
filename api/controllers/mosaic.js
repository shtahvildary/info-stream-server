

const { Mosaic } = require('../../index');



var mosaicCreator = new Mosaic()
/*      POST /api/mosaic/start     */
let mosaic_start = async (req, res) => {
  const inputs = req.body
  try {

    mosaicCreator.start(inputs)


    return res.status(200).json({ mosaic: { inputs } });
  } catch (e) {
    console.error('error: ', e);
    return res.status(500).json({ error: e });
  }

};
let mosaic_stop=async(req,res)=>{
  const inputs = req.body
  console.log("req",req.body)
  try{
    if(mosaicCreator.stop(inputs.id))
    return res.status(200).json({mosaic:{inputs}})
    else return res.status(200).json({mosaic:{},message:"nothing to stop."})
  } catch(e){
    console.error('error: ', e);
    return res.status(500).json({ error: e });
  }
}
module.exports = { mosaic_start, mosaic_stop };
