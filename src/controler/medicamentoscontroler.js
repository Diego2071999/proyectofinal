import sequelize from "../database/database.js";
import medicamento from "../models/medicamentos.js"

// Mostrar todos los registros de medicamentos
const getAllMedicamentos = async (req, res) => {
    try {
        const medicamentos = await medicamento.findAll();
        res.status(200).json(medicamentos); // Enviar respuesta con los medicamentos encontrados
    } catch (error) {
        console.error('Error al obtener los medicamentos:', error);
        res.status(500).json({ message: 'Error retrieving medicamentos' });
    }
};

// Mostrar un solo registro de medicamento
const getMedicamento = async (req, res) => {
    try {
        const medic = await medicamento.findOne({
            where: { id: req.params.id } // Buscar por ID
        });
        if (medic) {
            res.json(medic); // Enviar el medicamento encontrado
        } else {
            res.status(404).json({ message: 'Medicamento no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el medicamento:', error);
        res.status(500).send(error.message);
    }
};

// Crear un nuevo registro de medicamento
const createMedicamento = async (req, res) => {
    try {
        await medicamento.create(req.body); // Crear un nuevo medicamento con los datos del cuerpo de la solicitud
        res.json({
            "message": "¡Medicamento creado correctamente!"
        });
    } catch (error) {
        console.error('Error al crear el medicamento:', error);
        res.status(500).send(error.message);
    }
};

// Actualizar un registro de medicamento
const updateMedicamento = async (req, res) => {
    try {
        const result = await medicamento.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ "message": "¡Medicamento actualizado correctamente!" });
        } else {
            res.status(404).json({ message: 'Medicamento no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el medicamento:', error);
        res.status(500).send(error.message);
    }
};

// Eliminar un registro de medicamento
const deleteMedicamento = async (req, res) => {
    try {
        const result = await medicamento.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ "message": "¡Medicamento eliminado correctamente!" });
        } else {
            res.status(404).json({ message: 'Medicamento no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el medicamento:', error);
        res.status(500).send(error.message);
    }
};


export const methods = {
    getAllMedicamentos,
    getMedicamento,
    createMedicamento,
    updateMedicamento,
    deleteMedicamento
}