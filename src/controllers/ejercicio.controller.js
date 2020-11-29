const db = require('../database/database').dbFirestore;

module.exports.CreateEjercicio = (req, res) => {

    //Valores a insertar
    const dataValues = {
        ejercicio: req.body.ejercicio,
        respuesta: req.body.respuesta
    };

    //Agregar registro con id autogenerado
    db.collection('ejercicio').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });

}

module.exports.GetEjercicio = (req, res) => {

    //Obtener el id de registro
    let idEjercicio = req.params.idEjercicio;

    //Query para buscar por id
    let query = db.collection('ejercicio').doc(idEjercicio);
    let queryMusculo;

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let ejercicio;
            ejercicio = snapshot.data();
            ejercicio['idEjercicio'] = snapshot.id;

            let musculosIDs = ejercicio.musculos;
            ejercicio['musculos'] = [];

            let musculosSize = Object.keys(musculosIDs).length;

            let lastId;
            let muscIdArray = [];
            for (let i = 1; i <= musculosSize; i++) {
                muscIdArray.push(musculosIDs[i]);

                if(i == musculosSize)
                    lastId = musculosIDs[i];
            }

            //CAMBIAR CADA ID DE MÚSCULO POR EL OBJETO CORRESPONDIENTE                        
            muscIdArray.forEach((id) => {

                queryMusculo = db.collection('musculo').doc(id);
                console.log("-----------------");
                console.log("ID: " + id);
                console.log("-----------------");

                queryMusculo.get().then(snapshotMusculo => {

                    if (!snapshotMusculo.exists) {
                        res.json("El registro no existe");
                    }
                    else {                    
                        let musculo;
                        musculo = snapshotMusculo.data();
                        musculo['idMusculo'] = snapshotMusculo.id;
                
                        //Agregar a musculo JSON    
                        ejercicio.musculos.push(musculo);    
                        
                        if(lastId == id)
                            res.json(ejercicio);
                    }
                }).catch(err => {
                    res.json('Error getting document', err);
                });        
            });
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetAllEjercicios = (req, res) => {

    //Query para buscar todos los registros de una colección
    let query = db.collection('ejercicio');

    query.get()
        .then((snapshot) => {

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let ejercicio;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                ejercicio = {}; //doc.data();
                ejercicio['idEjercicio'] = doc.id;
                ejercicio['dificultad'] = doc.data().dificultad;
                ejercicio['focalizacion'] = doc.data().focalizacion;
                ejercicio['nombre'] = doc.data().nombre;
                ejercicio['video'] = doc.data().video;
                registros.push(ejercicio);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

module.exports.UpdateEjercicio = (req, res) => {

    //Obtener el id de registro
    let idEjercicio = req.body.idEjercicio;

    //Valores a actualizar
    const dataValues = {
        ejercicio: req.body.ejercicio,
        respuesta: req.body.respuesta
    };

    //Obtener el registro de la taquería
    let query = db.collection('ejercicio').doc(idEjercicio);

    //Actualizar el registro
    query.update(dataValues).then(ref => {
        //Regresar el id del registro actualizado        
        res.json(idEjercicio);
    });
}

module.exports.DeleteEjercicio = (req, res) => {

    //Obtener el id de registro
    let idEjercicio = req.params.idEjercicio;

    //Borrar el resgistro
    db.collection('ejercicio').doc(idEjercicio).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}