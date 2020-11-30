const { storage } = require('firebase-admin');

const db = require('../database/database').dbFirestore;

module.exports.CreateFoto = (req, res) => {

    //Valores a insertar
    const dataValues = {
        fecha: req.body.fecha,
        fotoDerecha: req.body.fotoDerecha,
        fotoIzquierda: req.body.fotoIzquierda,
        fotoFrontal: req.body.fotoFrontal
    };

    //Agregar registro con id autogenerado
    db.collection('foto').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });
}

module.exports.SubmitFoto = async (req, res) => {
    
    // Obtener el bucket
    const bucket = storage.bucket();

    // Obtener el archivo
    const blob = bucket.file(req.file.originalname);

    // Para generar token
    let uuid = uuidv4();

    // Crear un blobsteam con el archivo 
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        }
    });

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.        
        const publicUrl = encodeURI(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${req.file.originalname}?alt=media&token=${uuid}`);

        res.json(publicUrl);
    });

    blobStream.end(req.file.buffer);

}

module.exports.GetFotoPersona = (req, res) => {

    //Obtener el id del registro
    let idFoto = req.params.idFoto;
    let idFecha = req.params.idFecha;

    //Query para buscar por id
    let query = db.collection('foto').doc(idFoto).collection('fecha').doc(idFecha);

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let foto;
            foto = snapshot.data();
            foto['idFoto'] = snapshot.id;

            res.json(foto);
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
};

module.exports.GetFotosPersona = (req, res) => {

    //Obtener el id del registro
    let idFoto = req.params.idPersona;

    //Query para buscar todos los registros de una colección
    let query = db.collection('foto').doc(idFoto).collection('fecha');

    query.get()
        .then((snapshot) => {

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let foto;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                foto = doc.data();
                foto['idFoto'] = doc.id;
                registros.push(foto);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });

}

module.exports.DeletePersonaFotos = (req, res) => {

    //Obtener el id de registro
    let idFoto = req.params.idFoto;

    //Borrar el resgistro
    db.collection('foto').doc(idFoto).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}

module.exports.DeleteFoto = (req, res) => {

    //Obtener el id de registro
    let idFoto = req.params.idFoto;
    let idFecha = req.params.idFecha;

    //Borrar el resgistro
    db.collection('foto').doc(idFoto).collection('fecha').doc(idFecha).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}
