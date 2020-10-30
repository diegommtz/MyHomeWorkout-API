const db = require('../database/database').dbFirestore;

module.exports.CreateHorario = (req, res) => {

    let idHorario = req.params.idPersona;

    //Valores a insertar
    const dataValues = {
        lunes: req.body.lunes,
        martes: req.body.martes,
        miercoles: req.body.miercoles,
        jueves: req.body.jueves,
        viernes: req.body.viernes,
        sabado: req.body.sabado,
        domingo: req.body.domingo,
        hora: req.body.hora,
        minuto: req.body.minuto
    };

    //Agregar registro con id autogenerado
    db.collection('horario').doc(idHorario).set(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });
}

module.exports.GetHorario = (req, res) => {

    //Obtener el id de registro
    let idHorario = req.params.idPersona;
    
    //Query para buscar por id
    let query = db.collection('horario').doc(idHorario);

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let horario;
            horario = snapshot.data();
            horario['id'] = snapshot.id;

            res.json(horario);
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetAllHorarios = (req, res) => {

    console.log("hola");
    //Query para buscar todos los registros de una colección
    let query = db.collection('horario');

    query.get()
        .then((snapshot) => {

            console.log(snapshot);

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let horario;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                horario = doc.data();
                horario['id'] = doc.id;
                registros.push(horario);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

module.exports.UpdateHorario = (req, res) => {
    
    //Obtener el id de registro
    let idHorario = req.body.id;

    //Valores a actualizar
    const dataValues = {
        lunes: req.body.lunes,
        martes: req.body.martes,
        miercoles: req.body.miercoles,
        jueves: req.body.jueves,
        viernes: req.body.viernes,
        sabado: req.body.sabado,
        domingo: req.body.domingo,
        hora: req.body.hora,
        minuto: req.body.minuto
    };


    //Obtener el registro de la taquería
    let query = db.collection('horario').doc(idHorario);

    //Actualizar el registro
    query.update(dataValues).then(ref => {
        //Regresar el id del registro actualizado        
        res.json(idHorario);
    });
}

module.exports.DeleteHorario = (req, res) => {

    //Obtener el id de registro
    let idHorario = req.params.idHorario;

    //Borrar el resgistro
    db.collection('horario').doc(idHorario).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}