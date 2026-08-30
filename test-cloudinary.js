import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const run = async () => {
  try {
    const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const dataURI = "data:image/png;base64," + b64;
    console.log("Uploading...");
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'pets2' });
    console.log("Success:", result.secure_url);
  } catch (e) {
    console.error("Upload error:", e);
  }
};
run();
