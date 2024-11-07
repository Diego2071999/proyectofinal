import sequelize from "../database/database.js";
import Roles from "../models/roles.js";
import Rols from "../models/roles.js";
import User from  "../models/usuarios.js";

//mostrar todos los registros
//usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            //attributes: ['title', 'content',]
        }); // Obtener todos los blogs
        res.status(200).json(users); // Enviar respuesta con los blogs encontrados
    } catch (error) {
        console.error('Error al obtener los blogs:', error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
};

//roles
const getAllrols = async (req, res) => {
    try {
        const roles = await Rols.findAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        res.status(500).json({ message: 'Error retrieving roles' });
    }
}

//roles y usarios
const getAllUsersWithRoles = async (req, res) => {
    try {
        const usersWithRoles = await User.findAll({
            attributes: ['id', 'Nombre', 'lastname', 'Correo', 'telefono', 'nombre_usuario'],
            include: [{
                model: Roles,
                attributes: ['Rol']
            }]
        });
        res.status(200).json(usersWithRoles);
    } catch (error) {
        console.error('Error al obtener los usuarios con roles:', error);
        res.status(500).json({ message: 'Error retrieving users with roles' });
    }
};

//mostrar un solo registro
const getuser = async (req,res) => {
    console.log(req);
    try{
        const user = await User.findAll({
            where:{id:req.params.id}
        });
        res.json(user[0]);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
    
};

const getrol = async (req,res) => {
    console.log(req);
    try{
        const user = await Rols.findAll({
            where:{id:req.params.id}
        });
        res.json(user[0]);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
    
};

const getuserWithRole = async (req, res) => {
    console.log(req);
    try{
        const usersWithRoles = await User.findAll({
            where:{id:req.params.id},
            attributes: ['id', 'Nombre', 'lastname', 'Correo', 'telefono', 'password', 'nombre_usuario'],
            include: [{
                model: Roles,
                attributes: ['Rol']
            }]
        });
        res.status(200).json(usersWithRoles);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

//crear un registro
const createuser = async (req, res) => {
    try {
        await User.create(req.body)
        res.json({
            "message":"¡Registro creado correctamente!"
        })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const createrol = async (req, res) => {
    try {
        await Roles.create(req.body)
        res.json({
            "message":"¡Registro creado correctamente!"
        })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


const createUserWithRole = async (req, res) => {
    const { Nombre, lastname, Correo, telefono, idrol, password, nombre_usuario } = req.body;

    const t = await sequelize.transaction(); // Iniciar una transacción

    try {
        // Verificar si el rol ya existe basado en el nombre del rol (idrol.Rol)
        let existingRole = await Roles.findOne({
            where: { Rol: idrol.Rol },
            transaction: t
        });

        if (!existingRole) {
            // Si el rol no existe, crearlo
            existingRole = await Roles.create({
                Rol: idrol.Rol // Nombre del rol pasado en la solicitud
            }, { transaction: t });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            where: { nombre_usuario },
            transaction: t
        });

        if (existingUser) {
            // Si el usuario ya existe, no se crea un nuevo usuario
            await t.rollback();
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Si el usuario no existe, crearlo con el id del rol encontrado o creado
        const newUser = await User.create({
            Nombre,
            lastname,
            Correo,
            telefono,
            idrol: existingRole.id, // Usar el id del rol encontrado o creado
            password,
            nombre_usuario
        }, { transaction: t });

        // Confirmar la transacción
        await t.commit();

        res.status(201).json({ message: 'Usuario y rol creados correctamente', user: newUser });
    } catch (error) {
        // Revertir la transacción en caso de error
        await t.rollback();
        console.error('Error al crear usuario con rol:', error);
        res.status(500).json({ message: 'Error al crear usuario con rol' });
    }
};

//actualizar un registro
const updateuser = async (req, res) => {
    try {
        await User.update(req.body, {
            where: { id: req.params.id },
        })
        res.json({
            "message":"¡Registro actualizado correctamente!"
        })
    } catch (error) {
        res.status(500);
        return res.send(error.message); // Agregar return aquí
    }
};
const updaterol = async (req, res) => {
    try {
        await Roles.update(req.body, {
            where: { id: req.params.id },
        })
        res.json({
            "message":"¡Registro actualizado correctamente!"
        })
    } catch (error) {
        res.status(500);
        return res.send(error.message); // Agregar return aquí
    }
};

const updateUserWithRole = async (req, res) => {
    const { Nombre, lastname, Correo, telefono, idrol, password, nombre_usuario } = req.body;

    try {
        const t = await sequelize.transaction(); // Iniciar una transacción

        // Verificar si el rol ya existe basado en el nombre del rol (idrol.Rol)
        let existingRole = await Roles.findOne({
            where: { Rol: idrol.Rol },
            transaction: t
        });

        if (!existingRole) {
            // Si el rol no existe, crearlo
            existingRole = await Roles.create({
                Rol: idrol.Rol // Nombre del rol pasado en la solicitud
            }, { transaction: t });
        }

        // Actualizar el usuario con los nuevos datos
        await User.update(
            {
                Nombre,
                lastname,
                Correo,
                telefono,
                idrol: existingRole.id, // Usar el id del rol encontrado o creado
                password,
                nombre_usuario
            },
            { where: { id: req.params.id }, transaction: t }
        );

        // Confirmar la transacción
        await t.commit();

        res.json({ message: "¡Registro actualizado correctamente!" });
    } catch (error) {
        // Revertir la transacción en caso de error
        await t.rollback();
        console.error("Error al actualizar usuario con rol:", error);
        res.status(500).send(error.message);
    }
};

//eliminar un registro
const deleteuser = async(req, res)=>{
    try{
        await User.destroy({
            where: {id: req.params.id}
        })
        res.json({
            "message":"¡Usuario eliminado correctamente!"
        })
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}
const deleterol = async(req, res)=>{
    try{
        await Roles.destroy({
            where: {id: req.params.id}
        })
        res.json({
            "message":"¡Rol eliminado correctamente!"
        })
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
    getAllUsers,
    getAllrols,
    getAllUsersWithRoles,

    getuser,
    getrol,
    getuserWithRole,

    createuser,
    createrol,
    createUserWithRole,

    updateuser,
    updaterol,
    updateUserWithRole,

    deleteuser,
    deleterol,
}