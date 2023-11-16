¿como usar Youtube Image Scrapper?

instale las dependencias: npm install axios fs path sharp y cloudinary si queres guardar las imagenes en la nube y no en el ordenador

si queres guardar las imagenes en cloudinary tenes que poner tus datos en un .env y importarlas al codigo de main.js con eso el codigo queda listo para ejecutarse, y enviar la imagen a cloud.

ahora si no queres enviar las imagenes a cloudinary deberias modificar el codigo, quitando la configuracion de cloudinary y la funcion uploadToCloudinary

y este bloque de codigo " const cloudinaryUrl = await uploadToCloudinary(outputPath);
        console.log('Imagen subida a Cloudinary en', cloudinaryUrl);
    
        // Elimina las imágenes de tu computadora
        fs.unlinkSync(downloadPath);
        fs.unlinkSync(outputPath);"

        del bloque try de la funcion processImage

 s4lu2 N1t4z0