const db = require('../database/database').dbFirestore;

module.exports.CreatePersona = (req, res) => {

    //Valores a insertar
    const dataValues = {
        persona: req.body.persona,
        respuesta: req.body.respuesta
    };

    //Agregar registro con id autogenerado
    db.collection('persona').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });

}

module.exports.GetPersona = (req, res) => {

    //Obtener el id de registro
    let idPersona = req.params.idPersona;
    
    //Query para buscar por id
    let query = db.collection('persona').doc(idPersona);

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let persona;
            persona = snapshot.data();
            persona['id'] = snapshot.id;

            res.json(persona);
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetAllPersonas = (req, res) => {

    //Query para buscar todos los registros de una colección
    let query = db.collection('persona');

    query.get()
        .then((snapshot) => {

            //Crear arreglo que contendrá todos los registros
            let registros = [];

            let persona;

            //Llenar el arreglo
            snapshot.forEach((doc) => {
                persona = doc.data();
                persona['id'] = doc.id;
                registros.push(persona);
            });

            //Regresar el arreglo
            res.json(registros);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

module.exports.UpdatePersona = (req, res) => {
    
    //Obtener el id de registro
    let idPersona = req.body.id;

    //Valores a actualizar
    const dataValues = {
        persona: req.body.persona,
        respuesta: req.body.respuesta
    };

    //Obtener el registro de la taquería
    let query = db.collection('persona').doc(idPersona);

    //Actualizar el registro
    query.update(dataValues).then(ref => {
        //Regresar el id del registro actualizado        
        res.json(idPersona);
    });
}

module.exports.DeletePersona = (req, res) => {

    //Obtener el id de registro
    let idPersona = req.params.idPersona;

    //Borrar el resgistro
    db.collection('persona').doc(idPersona).delete().then(() => {
        //Enviar un mensaje de que funcionó
        res.json({ message: 'deleted' });
    });
}