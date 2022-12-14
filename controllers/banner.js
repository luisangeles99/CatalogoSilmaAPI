const Banner = require('../models/banner');
const { upload, remove } = require('../services/cloudinary');

// get active banner
// it is prefered to only have one banner
const getBanner = async(req, res) => {
    let banner = null;
    try {
        banner = await Banner.findOne({isActive: true});
    } catch (err) {
        console.log(err);
        return res.status(505).send({error: 'Internal server error'});
    }

    if(banner === null){
        return res.status(404).send({error: 'Banner not found'});
    }

    return res.json({data: banner});
}

// create new Banners
const createBanner = async(req, res) => {
    let banner = new Banner(req.body);

    try {
        const imgPath = req.file.path;
        //save img
        const res = await upload(imgPath, 'banner-imgs');
        banner.imgUrl = res.url;
        banner.publicImgId = res.public_id;
        await banner.save();
    } catch (err) {
        console.log(err);
        return res.status(505).send({error: 'Internal server error'});
    }
    return res.json({success: 'Banner created', banner});
}

// update active banner
// isActive is not allowed to be changed from api
const updateBanner = async(req, res) => {
    
    const bannerId = req.body.id;
    const updates = Object.keys(req.body);

    //remove id from obj
    const i = updates.indexOf('id');
    if( i != -1){
        updates.splice(i, 1);
    }

    const allowedUpdates = ['name'];

    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid update check avaliable update keys ' + allowedUpdates});
    }

    let banner = null;

    try {
        banner = await Banner.findOne({_id: bannerId});
    } catch (err) {
        console.log(err);
        return res.status(505).send({error: 'Internal server error'});
    }

    if(!banner){
        return res.status(404).send({error: 'Banner not found'});
    }

    try {
        //remove previous banner img
        const publicId = banner.publicImgId;
        await remove(publicId);

        //upload new banner
        const imgPath = req.file.path;
        const res = await upload(imgPath, 'banner-imgs');

        banner = await Banner.findByIdAndUpdate(bannerId, 
          {
            $set: {
                name: req.body.name,
                imgUrl: res.url,
                publicImgId: res.public_id
            }
          }  
        );

    } catch (err) {
        console.log(err);
        return res.status(505).send({error: 'Internal server error'});
    }

    return res.json({success: 'Banner updated', banner});
}


module.exports = {
    getBanner: getBanner,
    createBanner: createBanner,
    updateBanner: updateBanner
}