import { asyncHandler } from '../middleware/errorMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const uploadBuffer = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });

export const uploadImagesController = (folder) => asyncHandler(async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    res.status(400);
    throw new Error('Cloudinary is not configured. Add Cloudinary keys to server/.env.');
  }
  const urls = await Promise.all((req.files || []).map((file) => uploadBuffer(file, `campusnest/${folder}`)));
  res.json({ urls });
});
