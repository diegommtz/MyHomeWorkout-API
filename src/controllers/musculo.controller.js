const db = require('../database/database').dbFirestore;

module.exports.CreateMusculo = (req, res) => {

    //Valores a insertar
    const dataValues = {
        musculo: req.body.musculo,
        respuesta: req.body.respuesta
    };

    //Agregar registro con id autogenerado
    db.collection('musculo').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });

}

module.exports.GetMusculo = (req, res) => {

    //Obtener el id de registro
    let idMusculo = req.params.idMusculo;
    
    //Query para buscar por id
    let query = db.collection('musculo').doc(idMusculo);

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let musculo;
            musculo = snapshot.data();
            musculo['idMusculo'] = snapshot.id;

            res.json(musculo);
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetAllMusculos = (req, res) => {

    //Query para buscar todos los registros de una colección
    let query = db.collection('musculo');

    query.get()
        .then((snapshot) => {

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let musculo;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                musculo = doc.data();
                musculo['idMusculo'] = doc.id;
                registros.push(musculo);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

module.exports.UpdateMusculo = (req, res) => {
    
    //Obtener el id de registro
    let idMusculo = req.body.idMusculo;

    //Valores a actualizar
    const dataValues = {
        musculo: req.body.musculo,
        respuesta: req.body.respuesta
    };

    //Obtener el registro de la taquería
    let query = db.collection('musculo').doc(idMusculo);

    //Actualizar el registro
    query.update(dataValues).then(ref => {
        //Regresar el id del registro actualizado        
        res.json(idMusculo);
    });
}

module.exports.DeleteMusculo = (req, res) => {

    //Obtener el id de registro
    let idMusculo = req.params.idMusculo;

    //Borrar el resgistro
    db.collection('musculo').doc(idMusculo).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}