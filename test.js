const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: 'your_api_key',
    api_secret: 'your_api_secret'
  });

async function downloadImage(imageUrl, outputPath) {
    const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function makeImageSquareWithBlurredBorders(inputPath, outputPath) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const maxSize = Math.max(metadata.width, metadata.height);
    const extendOptions = {
        top: Math.round((maxSize - metadata.height) / 2),
        bottom: Math.round((maxSize - metadata.height) / 2),
        left: Math.round((maxSize - metadata.width) / 2),
        right: Math.round((maxSize - metadata.width) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparente o el color deseado
    };

    await image.extend(extendOptions).toFile(outputPath);
}

async function uploadToCloudinary(path) {
    const result = await cloudinary.uploader.upload(path);
    return result.url;
  }

async function processImage(url) {
    const videoId = url.split('=')[1];
    const imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const downloadPath = path.resolve(__dirname, 'image.jpg');
    const outputPath = path.resolve(__dirname, 'output.jpg');

    try {
        await downloadImage(imageUrl, downloadPath);
        console.log('Imagen descargada y guardada en', downloadPath);
    
        await makeImageSquareWithBlurredBorders(downloadPath, outputPath);
        console.log('Imagen procesada y guardada en', outputPath);
    
        const cloudinaryUrl = await uploadToCloudinary(outputPath);
        console.log('Imagen subida a Cloudinary en', cloudinaryUrl);
    
        // Elimina las imágenes de tu computadora
        fs.unlinkSync(downloadPath);
        fs.unlinkSync(outputPath);
      } catch (err) {
        console.error('Ocurrió un error:', err);
      }
}

const url = 'https://www.youtube.com/watch?v=cIlqUAsEleE';
processImage(url);