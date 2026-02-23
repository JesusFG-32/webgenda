const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        // Asumiendo que req.user está definido por el middleware de autenticación
        const userId = req.user.id;
        const dir = path.join(__dirname, '..', 'public', 'users', String(userId));

        try {
            // fs-extra asegura que el directorio exista
            await fs.ensureDir(dir);
            cb(null, dir);
        } catch (err) {
            cb(err, null);
        }
    },
    filename: (req, file, cb) => {
        // Generar un nombre de archivo único para evitar colisiones
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es una imagen! Por favor sube una imagen.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
        }

        // Generar la ruta relativa para guardar en la BD
        const userId = req.user.id;
        const relativePath = `/users/${userId}/${req.file.filename}`;

        res.status(200).json({
            message: 'Imagen subida exitosamente',
            imageUrl: relativePath
        });
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({ message: 'Error en el servidor al subir la imagen' });
    }
});

module.exports = router;
