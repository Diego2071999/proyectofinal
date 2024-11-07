import sequelize from "../../database/database.js";
import Receta from "../../models/recetaV2.js";
import DetalleReceta from "../../models/detalleReceta.js";
import Paciente from "../../models/pacienteV2.js";
import Medicamento from "../../models/medicamentos.js";
import DetallePedido from "../../models/detallepedido.js";
import Pedido from "../../models/pedido.js";

// Crear Receta
const createReceta = async (data) => {
    const t = await sequelize.transaction();
    try {
        const receta = await Receta.create({
            DETALLE_RECETA_id: data.detalleRecetaId,
            MEDICAMENTO_id: data.medicamentoId,
            PACIENTE_cod: data.pacienteCod
        }, { transaction: t });

        await t.commit();
        return receta;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
// Crear DetallePedido
const createDetallePedido = async (data) => {
    const t = await sequelize.transaction();
    try {
        const detallePedido = await DetallePedido.create({
            cantidad: data.cantidad,
            MEDICAMENTO_id: data.medicamentoId
        }, { transaction: t });

        await t.commit();
        return detallePedido;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
const crearPedido = async (req, res) => {
    const { cantidad, MEDICAMENTO_id, PACIENTE_cod, dosis_diaria, tiempo_consumo, fecha_inicio, fecha_fin } = req.body;

    const t = await sequelize.transaction();

    try {
        // Crear DetallePedido
        const detallePedido = await DetallePedido.create(
            { cantidad, MEDICAMENTO_id },
            { transaction: t }
        );

        // Crear DetalleReceta
        const detalleReceta = await DetalleReceta.create(
            { dosis_diaria, tiempo_consumo, fecha_inicio, fecha_fin },
            { transaction: t }
        );

        // Crear Receta
        const receta = await Receta.create(
            {
                DETALLE_RECETA_id: detalleReceta.id,
                MEDICAMENTO_id,
                PACIENTE_cod,
            },
            { transaction: t }
        );

        // Crear Pedido
        const pedido = await Pedido.create(
            {
                fecha: new Date(),
                DETALLE_PEDIDO_id: detallePedido.id,
                RECETA_id: receta.id,
            },
            { transaction: t }
        );

        await t.commit(); // Confirmar transacción si todo es exitoso
        res.status(201).json(pedido);

    } catch (error) {
        await t.rollback(); // Revertir cambios si ocurre un error
        console.error("Error al crear el pedido:", error);
        res.status(500).json({ error: 'No se pudo crear el pedido' });
    }
};

// controllers/recetaController.js
const getRecetasByPaciente = async (req, res) => {
    try {
        const pacienteId = req.query.paciente_cod;
        
        if (!pacienteId) {
            return res.status(400).json({ 
                error: 'Se requiere el ID del paciente' 
            });
        }

        const recetas = await Receta.findAll({
            where: {
                PACIENTE_cod: pacienteId
            },
            include: [
                {
                    model: DetalleReceta,
                    as: 'detalleReceta',
                    attributes: ['dosis_diaria', 'tiempo_consumo', 'fecha_inicio', 'fecha_fin']
                },
                {
                    model: Medicamento,
                    as: 'medicamento',
                    attributes: ['nombre', 'contenido', 'presentacion']
                },
                {
                    model: Paciente,
                    as: 'paciente',
                    attributes: ['nombre', 'apellido','direccion','referencia','telefono','telefono2','email','edad','nombre_encargado']
                }
            ],
            order: [
                ['detalleReceta', 'fecha_inicio', 'DESC']
            ]
        });

        if (!recetas.length) {
            return res.status(404).json({
                message: 'No se encontraron recetas para este paciente'
            });
        }

        res.json(recetas);
    } catch (error) {
        console.error('Error al obtener recetas:', error);
        res.status(500).json({
            error: 'Error al obtener las recetas del paciente'
        });
    }
};

// Leer Receta por ID
const getRecetaById = async (id) => {
    try {
        const receta = await Receta.findByPk(id, {
            include: [
                { model: DetalleReceta, as: 'detalleReceta' },
                { model: Medicamento, as: 'medicamento' },
                { model: Paciente, as: 'paciente' }
            ]
        });
        return receta;
    } catch (error) {
        throw error;
    }
};
// Leer DetallePedido por ID
const getDetallePedidoById = async (id) => {
    try {
        const detallePedido = await DetallePedido.findByPk(id, {
            include: { model: Medicamento }
        });
        return detallePedido;
    } catch (error) {
        throw error;
    }
};
// Obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [
                { model: DetallePedido, as: 'detallePedido' },
                { model: Receta, as: 'recetas' }
            ]
        });
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido', detalle: error.message });
    }
};

// Leer todas las Recetas
const getAllRecetas = async () => {
    try {
        const recetas = await Receta.findAll({
            include: [
                { model: DetalleReceta, as: 'detalleReceta' },
                { model: Medicamento, as: 'medicamento' },
                { model: Paciente, as: 'paciente' }
            ]
        });
        return recetas;
    } catch (error) {
        throw error;
    }
};
// Leer todos los Detalles de Pedido
const getAllDetallesPedido = async () => {
    try {
        const detallesPedido = await DetallePedido.findAll({
            include: { model: Medicamento }
        });
        return detallesPedido;
    } catch (error) {
        throw error;
    }
};
// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: DetallePedido, as: 'detallePedido' },
                { model: Receta, as: 'recetas' }
            ]
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos', detalle: error.message });
    }
};

// Actualizar Receta
const updateReceta = async (id, data) => {
    const t = await sequelize.transaction();
    try {
        const receta = await Receta.findByPk(id);
        if (!receta) throw new Error("Receta no encontrada");

        await receta.update({
            DETALLE_RECETA_id: data.detalleRecetaId,
            MEDICAMENTO_id: data.medicamentoId,
            PACIENTE_cod: data.pacienteCod
        }, { transaction: t });

        await t.commit();
        return receta;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
// Actualizar DetallePedido
const updateDetallePedido = async (id, data) => {
    const t = await sequelize.transaction();
    try {
        const detallePedido = await DetallePedido.findByPk(id);
        if (!detallePedido) throw new Error("Detalle de Pedido no encontrado");

        await detallePedido.update({
            cantidad: data.cantidad,
            MEDICAMENTO_id: data.medicamentoId
        }, { transaction: t });

        await t.commit();
        return detallePedido;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
// Actualizar un pedido
export const actualizarPedido = async (req, res) => {
    try {
        const { fecha, DETALLE_PEDIDO_id, RECETA_id } = req.body;
        const pedido = await Pedido.findByPk(req.params.id);
        if (pedido) {
            pedido.fecha = fecha;
            pedido.DETALLE_PEDIDO_id = DETALLE_PEDIDO_id;
            pedido.RECETA_id = RECETA_id;
            await pedido.save();
            res.json(pedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido', detalle: error.message });
    }
};

// Eliminar Receta
const deleteReceta = async (id) => {
    const t = await sequelize.transaction();
    try {
        const receta = await Receta.findByPk(id);
        if (!receta) throw new Error("Receta no encontrada");

        await receta.destroy({ transaction: t });
        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
// Eliminar DetallePedido
const deleteDetallePedido = async (id) => {
    const t = await sequelize.transaction();
    try {
        const detallePedido = await DetallePedido.findByPk(id);
        if (!detallePedido) throw new Error("Detalle de Pedido no encontrado");

        await detallePedido.destroy({ transaction: t });
        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
// Eliminar un pedido
export const eliminarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (pedido) {
            await pedido.destroy();
            res.json({ mensaje: 'Pedido eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido', detalle: error.message });
    }
};

export const methods = { 
    createReceta,
    createDetallePedido,
    crearPedido,

    getRecetaById,
    getDetallePedidoById,
    obtenerPedidoPorId,
    getRecetasByPaciente,

    getAllRecetas,
    getAllDetallesPedido,
    obtenerPedidos,

    updateReceta,
    updateDetallePedido,
    actualizarPedido,

    deleteReceta,
    deleteDetallePedido,
    eliminarPedido
};
