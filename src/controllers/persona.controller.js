const bcrypt = require('bcrypt');
const { query } = require('express');

const db = require('../database/database').dbFirestore;

module.exports.CreatePersona = (req, res) => {

    let password = bcrypt.hashSync(req.body.contrasena, 10);

    //Valores a insertar
    const dataValues = {
        nombre: req.body.nombre,
        contrasena: password,
        altura: req.body.altura,
        genero: req.body.genero,
        nacimiento: req.body.nacimiento,
        objetivo: req.body.objetivo.idObjetivo,
        peso: req.body.peso,
        entrenamientos: req.body.entrenamientos
    };

    //Agregar registro con id autogenerado
    db.collection('persona').add(dataValues).then(ref => {
        //Regresar el id del nuevo registro
        res.json(ref.id);
    });

}

module.exports.Login = (req, res) => {
    let nombre = req.params.nombrePersona;
    let contrasena = req.params.contrasena;

    console.log(req.params);

    let query = db.collection('persona').where('nombre', '==', nombre);

    query.get().then(snapshot => {
        if (snapshot.empty) {
            res.json("El registro no existe");
        }
        else {

            snapshot.forEach(doc => {

                let persona = doc.data();
                persona["idPersona"] = doc.id;
                
                let match = bcrypt.compareSync(contrasena, doc.data().contrasena);

                if (match) {          
                    res.json(doc.id);                    
                }
                else {
                    res.json('El registro no existe');
                }                
            });
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.AumentarEntrenamiento = (req, res) => {

    console.log("holaaaaaaaaa");
    let idPersona = req.params.idPersona;

    let query = db.collection('persona').doc(idPersona);

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let persona;
            persona = snapshot.data();
            persona['idPersona'] = snapshot.id;

            let entrenamientos = persona.entrenamientos;
            entrenamientos++;

            console.log(entrenamientos);

            query.update({entrenamientos: entrenamientos});
            res.json(idPersona);            
        }
    }).catch(err => {
        res.json('Error getting document', err);
    });
}

module.exports.GetPersona = (req, res) => {

    //Obtener el id de registro
    let idPersona = req.params.idPersona;
    
    //Query para buscar por id
    let query = db.collection('persona').doc(idPersona);
    let queryObjetivo;

    query.get().then(snapshot => {

        if (!snapshot.exists) {
            res.json("El registro no existe");
        }
        else {
            let persona;
            persona = snapshot.data();
            persona['idPersona'] = snapshot.id;

            queryObjetivo = db.collection('objetivo').doc(persona.objetivo);
            queryObjetivo.get().then(snapshotObjetivo => {
                if (!snapshotObjetivo.exists) {
                    res.json("El registro no existe");
                }
                else {
                    let objetivo;
                    objetivo = snapshotObjetivo.data();
                    objetivo['idObjetivo'] = snapshotObjetivo.id;
        
                    persona.objetivo = objetivo;
                    res.json(persona);
                }
            }).catch(err => {
                res.json('Error getting document', err);
            });
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
                persona['idPersona'] = doc.id;
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
    let idPersona = req.body.idPersona;

    //Valores a actualizar
    const dataValues = {
        nombre: req.body.nombre,
        altura: req.body.altura,
        genero: req.body.genero,
        nacimiento: req.body.nacimiento,
        objetivo: req.body.objetivo.idObjetivo,
        peso: req.body.peso,
        entrenamientos: req.body.entrenamientos
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