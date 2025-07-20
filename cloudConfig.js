const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//connecting cloudinary acc to our backend 
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderstay_DEV',
    allowedFormats: ["png","jpg","jpeg"]
   
  },
});

module.exports={
    cloudinary,
    storage
}