const db = require('../database/database').dbFirestore;

module.exports.CreateRutina = (req, res) => {

    //Valores a insertar
    const dataValues = {
        rutina: req.body.rutina,
        respuesta: req.body.respuesta
    };

    //Agregar registro con id autogenerado
    db.collection('rutina').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });

}

module.exports.GetRutina = (req, res) => {

    //Obtener el id de registro
    let idRutina = req.params.idRutina;

    //Query para buscar por id
    let query = db.collection('rutina').doc(idRutina);
    let queryEjercicios = db.collection('rutina').doc(idRutina).collection('ejercicios');
    let queryObjetivo;
    let queryEjercicioInfo;
    let queryMusculo;

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let rutina;
            rutina = snapshot.data();
            rutina['idRutina'] = snapshot.id;

            queryObjetivo = db.collection('objetivo').doc(rutina.objetivo);
            queryObjetivo.get().then(snapshotObjetivo => {

                rutina.objetivo = snapshotObjetivo.data();
                rutina.objetivo['idObjetivo'] = snapshotObjetivo.id;

                queryEjercicios.get().then(snapshotEjercicios => {

                    //Crear arreglo que contendrá los ejercicios
                    let registros = [];
                    let ejercicio;

                    let ejerciciosSize = snapshotEjercicios.size;
                    let currSize = 0;

                    //Llenar el arreglo
                    snapshotEjercicios.forEach((doc) => {
                        ejercicio = doc.data();
                        ejercicio['idEjercicio'] = doc.id;

                        queryEjercicioInfo = db.collection('ejercicio').doc(doc.id);
                        queryEjercicioInfo.get().then(ejSnapShot => {

                            let ejObj2 = ejSnapShot.data();
                            let musculosIDs = ejObj2.musculos;
                            ejObj2['musculos'] = [];

                            let musculosSize = Object.keys(musculosIDs).length;

                            let lastId;
                            let muscIdArray = [];
                            for (let i = 1; i <= musculosSize; i++) {
                                muscIdArray.push(musculosIDs[i]);

                                if (i == musculosSize)
                                    lastId = musculosIDs[i];
                            }

                            //CAMBIAR CADA ID DE MÚSCULO POR EL OBJETO CORRESPONDIENTE                        
                            muscIdArray.forEach((id) => {

                                queryMusculo = db.collection('musculo').doc(id);

                                queryMusculo.get().then(snapshotMusculo => {

                                    if (!snapshotMusculo.exists) {
                                        res.json("El registro no existe");
                                    }
                                    else {
                                        let musculo;
                                        musculo = snapshotMusculo.data();
                                        musculo['idMusculo'] = snapshotMusculo.id;

                                        //Agregar a musculo JSON    
                                        ejObj2.musculos.push(musculo);

                                        if (lastId == id) {
                                            let tempEjercicio = doc.data();
                                            tempEjercicio['idEjercicio'] = doc.id;
                                            const result = Object.assign({}, ejObj2, tempEjercicio);
                                            registros.push(result);
                                            rutina['ejercicios'] = registros;
                                            currSize++;

                                            console.log(result);
                                            console.log("----------");

                                            if (currSize == ejerciciosSize)
                                                res.json(rutina);
                                        }

                                        //res.json(ejercicio);

                                    }
                                });
                            });
                        });
                    });

                });

            });
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetAllRutinas = (req, res) => {

    //Query para buscar todos los registros de una colección
    let query = db.collection('rutina');

    query.get()
        .then((snapshot) => {

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let rutina;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                rutina = doc.data();
                rutina['idRutina'] = doc.id;
                registros.push(rutina);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

module.exports.UpdateRutina = (req, res) => {

    //Obtener el id de registro
    let idRutina = req.body.idRutina;

    //Valores a actualizar
    const dataValues = {
        rutina: req.body.rutina,
        respuesta: req.body.respuesta
    };

    //Obtener el registro de la taquería
    let query = db.collection('rutina').doc(idRutina);

    //Actualizar el registro
    query.update(dataValues).then(ref => {
        //Regresar el id del registro actualizado        
        res.json(idRutina);
    });
}

module.exports.DeleteRutina = (req, res) => {

    //Obtener el id de registro
    let idRutina = req.params.idRutina;

    //Borrar el resgistro
    db.collection('rutina').doc(idRutina).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}