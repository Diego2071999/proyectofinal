import sequelize from "../database/database.js";
import Receta from "../models/recetaV2.js"
import Doctor from "../models/doctorV2.js";
import Paciente from "../models/pacienteV2.js";
import DetalleReceta from "../models/detalleReceta.js";
import medicamento from "../models/medicamentos.js";
import DetallePedido from "../models/detallepedido.js";
import Pedido from "../models/pedido.js";

// Mostrar todas las recetas, doctores y pedidos
const getAllData = async (req, res) => {
    try {
        // Obtener todas las recetas con sus asociaciones
        const recetas = await Receta.findAll({
            include: [
                { model: DetalleReceta, as: 'recetas' }, 
                { model: medicamento, as: 'medicamento' },
                { model: Paciente, as: 'Paciente' }
            ]
        });

        // Obtener todos los doctores
        const doctores = await Doctor.findAll();

        // Obtener todos los pedidos con sus asociaciones
        const pedidos = await Pedido.findAll({
            include: [
                { model: DetallePedido, as: 'DetallePedido' },
                { model: Receta, as: 'recetas' }
            ]
        });

        // Remover los campos no deseados (DETALLE_PEDIDO_id, RECETA_id) de los pedidos
        const pedidosSinIds = pedidos.map(record => {
            const { DETALLE_PEDIDO_id, RECETA_id, ...data } = record.toJSON();
            return data;
        });

        // Crear una respuesta estructurada y clara para el frontend
        res.status(200).json({
            recetas: recetas.map(receta => ({
                id: receta.id,
                dosis_diaria: receta.recetas.dosis_diaria,
                consumo_diario: receta.recetas.consumo_diario,
                tiempo_consumo: receta.recetas.tiempo_consumo,
                medicamento: receta.medicamento.nombre,
                paciente: `${receta.Paciente.nombre} ${receta.Paciente.apellido}`,
                email: receta.Paciente.email
            })),
            doctores: doctores.map(doctor => ({
                id: doctor.id,
                nombre: doctor.nombre,
                apellido: doctor.apellido,
                especialidad: doctor.especialidad
            })),
            pedidos: pedidosSinIds
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ message: 'Error retrieving data' });
    }
};

// Mostrar receta, doctor o pedido por id
const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const receta = await Receta.findByPk(id, {
            include: [
                { model: DetalleReceta, as: 'recetas' },
                { model: medicamento, as: 'medicamento' },
                { model: Paciente, as: 'Paciente' }
            ]
        });

        const doctor = await Doctor.findByPk(id);

        const pedido = await Pedido.findByPk(id, {
            include: [
                { model: DetallePedido, as: 'DetallePedido' },
                { model: Receta, as: 'recetas' }
            ]
        });

        if (receta || doctor || pedido) {
            res.status(200).json({ receta, doctor, pedido });
        } else {
            res.status(404).json({ message: 'No data found with the provided id' });
        }
    } catch (error) {
        console.error('Error al obtener los datos por id:', error);
        res.status(500).json({ message: 'Error retrieving data by id' });
    }
};

export const methods = { 
    getAllData,
    getById,
};