import sequelize from "../database/database.js";
import Paciente from "../models/pacienteV2.js";
import Doctor from "../models/doctorV2.js";
import DetalleReceta from "../models/detalleReceta.js";
import Factura from "../models/factura.js";


//mostrar todos
// Obtener todas las facturas
const getAllFacturas = async (req, res) => {
    try {
        const facturas = await Factura.findAll();
        res.status(200).json(facturas);
    } catch (error) {
        console.error("Error al obtener las facturas:", error);
        res.status(500).json({ message: "Error retrieving facturas" });
    }
};

// Mostrar todos los pacientes con sus facturas asociadas
const getAllPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            include: {
                model: Factura,
                attributes: ['nit', 'nomfac'] // Especifica los campos de Factura que deseas incluir
            }
        });
        res.status(200).json(pacientes);
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(500).json({ message: 'Error retrieving pacientes' });
    }
};

// Mostrar todos los doctores
const getAllDoctores = async (req, res) => {
    try {
        const doctores = await Doctor.findAll();
        res.status(200).json(doctores);
    } catch (error) {
        console.error('Error al obtener los doctores:', error);
        res.status(500).json({ message: 'Error retrieving doctores' });
    }
};

// Mostrar todos los detalles de recetas
const getAllDetalleRecetas = async (req, res) => {
    try {
        const detallesRecetas = await DetalleReceta.findAll();
        res.status(200).json(detallesRecetas);
    } catch (error) {
        console.error('Error al obtener los detalles de receta:', error);
        res.status(500).json({ message: 'Error retrieving detalles de receta' });
    }
};

//mostrar 1 dato
// Obtener una factura por ID
const getFacturaById = async (req, res) => {
    try {
        const factura = await Factura.findOne({
            where: { id: req.params.id }
        });
        if (factura) {
            res.status(200).json(factura);
        } else {
            res.status(404).json({ message: "Factura no encontrada" });
        }
    } catch (error) {
        console.error("Error al obtener la factura:", error);
        res.status(500).json({ message: "Error retrieving factura" });
    }
};
// Obtener una factura por NIT
const getFacturaByNit = async (req, res) => {
    try {
        const { nit } = req.params;  // Extraer NIT de los parámetros de la solicitud
        const factura = await Factura.findOne({
            where: { nit }  // Buscando por el campo 'nit'
        });

        if (factura) {
            res.status(200).json(factura);  // Devuelve la factura encontrada
        } else {
            res.status(404).json({ message: "Factura no encontrada" });
        }
    } catch (error) {
        console.error("Error al obtener la factura:", error);
        res.status(500).json({ message: "Error al recuperar la factura" });
    }
};


// Mostrar un paciente por ID con su factura asociada
const getPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            where: { id: req.params.id },
            include: {
                model: Factura,
                attributes: ['nit', 'nomfac']
            }
        });
        if (paciente) {
            res.json(paciente);
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        res.status(500).send(error.message);
    }
};
// Mostrar un doctor por ID
const getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: { id: req.params.id }
        });
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el doctor:', error);
        res.status(500).send(error.message);
    }
};
// Mostrar un detalle de receta por ID
const getDetalleReceta = async (req, res) => {
    try {
        const detalleReceta = await DetalleReceta.findOne({
            where: { id: req.params.id }
        });
        if (detalleReceta) {
            res.json(detalleReceta);
        } else {
            res.status(404).json({ message: 'Detalle de receta no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

//crear dato
// Crear un nuevo paciente con una factura asociada
const createPaciente = async (req, res) => {
    // Renombrar la variable para evitar conflictos
    const { Factura: facturaData, ...pacienteData } = req.body; 

    // Verificar que los datos de la factura estén presentes
    if (!facturaData || !facturaData.nit) {
        return res.status(400).json({ error: 'El nit es obligatorio.' });
    }

    try {
        // Crear la factura si no existe o encontrarla
        const [nuevaFactura] = await Factura.findOrCreate({
            where: { nit: facturaData.nit }, // Asegúrate de usar facturaData.nit
            defaults: facturaData // Usa todos los datos de la factura si se crea
        });

        // Crear el paciente asociado a la factura
        const nuevoPaciente = await Paciente.create({
            ...pacienteData,
            FACTURA_id: nuevaFactura.id // Asegúrate de usar el ID de la factura creada o encontrada
        });

        res.status(200).json(nuevoPaciente);
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(500).send(error.message);
    }
};


// Crear un nuevo doctor
const createDoctor = async (req, res) => {
    try {
        await Doctor.create(req.body);
        res.json({ message: '¡Doctor creado correctamente!' });
    } catch (error) {
        console.error('Error al crear el doctor:', error);
        res.status(500).send(error.message);
    }
};

const createDetalleReceta = async (req, res) => {
    try {
        // Crear el detalle de receta y devolver el objeto completo
        const nuevoDetalleReceta = await DetalleReceta.create(req.body);

        // Responder con el detalle de receta recién creado, incluyendo el id
        res.status(201).json(nuevoDetalleReceta);
    } catch (error) {
        console.error('Error al crear el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

//actualizar
// Actualizar un paciente y su factura asociada si es necesario
const updatePaciente = async (req, res) => {
    const { factura, ...pacienteData } = req.body;

    try {
        // Buscar el paciente
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Actualizar la factura asociada si es necesario
        if (factura) {
            await Factura.update(factura, {
                where: { id: paciente.FACTURA_id }
            });
        }

        // Actualizar los datos del paciente
        await paciente.update(pacienteData);
        res.json({ message: '¡Paciente actualizado correctamente!' });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(500).send(error.message);
    }
};

// Actualizar un doctor por ID
const updateDoctor = async (req, res) => {
    try {
        const result = await Doctor.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ message: '¡Doctor actualizado correctamente!' });
        } else {
            res.status(404).json({ message: 'Doctor no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el doctor:', error);
        res.status(500).send(error.message);
    }
};

// Actualizar un detalle de receta por ID
const updateDetalleReceta = async (req, res) => {
    try {
        const result = await DetalleReceta.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ message: '¡Detalle de receta actualizado correctamente!' });
        } else {
            res.status(404).json({ message: 'Detalle de receta no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

//eliminar
// Eliminar un paciente por ID
const deletePaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Elimina el paciente
        await paciente.destroy();
        res.json({ message: '¡Paciente eliminado correctamente!' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(500).send(error.message);
    }
};
// Eliminar un doctor por ID
const deleteDoctor = async (req, res) => {
    try {
        const result = await Doctor.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ message: '¡Doctor eliminado correctamente!' });
        } else {
            res.status(404).json({ message: 'Doctor no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el doctor:', error);
        res.status(500).send(error.message);
    }
};
// Eliminar un detalle de receta por ID
const deleteDetalleReceta = async (req, res) => {
    try {
        const result = await DetalleReceta.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ message: '¡Detalle de receta eliminado correctamente!' });
        } else {
            res.status(404).json({ message: 'Detalle de receta no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

export const methods = { 
    getAllFacturas,
    getFacturaById,
    getFacturaByNit,

    getAllPacientes,
    getAllDoctores,
    getAllDetalleRecetas,

    getPaciente,
    getDoctor,
    getDetalleReceta,

    createPaciente,
    createDoctor,
    createDetalleReceta,

    updatePaciente,
    updateDoctor,
    updateDetalleReceta,

    deletePaciente,
    deleteDoctor,
    deleteDetalleReceta
};
