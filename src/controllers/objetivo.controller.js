const db = require('../database/database').dbFirestore;

module.exports.CreateObjetivo = (req, res) => {

    //Valores a insertar
    const dataValues = {
        objetivo: req.body.objetivo,
        respuesta: req.body.respuesta
    };

    //Agregar registro con id autogenerado
    db.collection('objetivo').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });

}

module.exports.GetObjetivo = (req, res) => {

    //Obtener el id de registro
    let idObjetivo = req.params.idObjetivo;
    
    //Query para buscar por id
    let query = db.collection('objetivo').doc(idObjetivo);

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let objetivo;
            objetivo = snapshot.data();
            objetivo['idObjetivo'] = snapshot.id;

            res.json(objetivo);
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetAllObjetivos = (req, res) => {

    //Query para buscar todos los registros de una colección
    let query = db.collection('objetivo');

    query.get()
        .then((snapshot) => {

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let objetivo;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                objetivo = doc.data();
                objetivo['idObjetivo'] = doc.id;
                registros.push(objetivo);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

module.exports.UpdateObjetivo = (req, res) => {
    
    //Obtener el id de registro
    let idObjetivo = req.body.idObjetivo;

    //Valores a actualizar
    const dataValues = {
        objetivo: req.body.objetivo,
        respuesta: req.body.respuesta
    };

    //Obtener el registro de la taquería
    let query = db.collection('objetivo').doc(idObjetivo);

    //Actualizar el registro
    query.update(dataValues).then(ref => {
        //Regresar el id del registro actualizado        
        res.json(idObjetivo);
    });
}

module.exports.DeleteObjetivo = (req, res) => {

    //Obtener el id de registro
    let idObjetivo = req.params.idObjetivo;

    //Borrar el resgistro
    db.collection('objetivo').doc(idObjetivo).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}