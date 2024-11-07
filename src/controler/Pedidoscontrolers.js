import sequelize from "../database/database.js";
import DetallePedido from "../models/detallepedido.js";
import Pedido from "../models/pedido.js";
import Receta from "../models/recetaV2.js";
import Medicamento from "../models/medicamentos.js";
import Factura from "../models/factura.js";

// Mostrar todos los registros de detallePedido
const getAllDetallePedidos = async (req, res) => {
    try {
        const detallePedidos = await DetallePedido.findAll({
            include: [{ model: Medicamento, as: 'medicamento' }] // Incluir los datos del medicamento
        });

        // Mapeamos para remover MEDICAMENTO_id
        const response = detallePedidos.map(record => {
            const { MEDICAMENTO_id, ...data } = record.toJSON(); // Excluir MEDICAMENTO_id
            return data;
        });

        res.status(200).json(response); // Enviar respuesta con los detalles de pedido
    } catch (error) {
        console.error('Error al obtener los detalles de pedidos:', error);
        res.status(500).json({ message: 'Error retrieving detallePedido records' });
    }
};
// Mostrar todos los registros de Pedido
const getAllPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: DetallePedido, as: 'detallePedido' }, // Incluir detalles del pedido
                { model: Receta, as: 'recetas' }, // Incluir detalles de la receta
                { model: Factura, as: 'factura' } // Incluir detalles de la factura
            ]
        });

        const response = pedidos.map(record => {
            const { DETALLE_PEDIDO_id, RECETA_id, FACTURA_id, ...data } = record.toJSON();
            return data;
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error retrieving pedidos' });
    }
};


// Mostrar un solo registro de detallePedido
const getDetallePedido = async (req, res) => {
    try {
        const detallePedido = await DetallePedido.findOne({
            where: { id: req.params.id },
            include: [{ model: Medicamento, as: 'medicamento' }] // Incluir datos del medicamento
        });

        if (detallePedido) {
            const { MEDICAMENTO_id, ...data } = detallePedido.toJSON(); // Excluir MEDICAMENTO_id
            res.json(data); // Enviar el detalle de pedido encontrado
        } else {
            res.status(404).json({ message: 'DetallePedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el detalle de pedido:', error);
        res.status(500).send(error.message);
    }
};
// Mostrar un solo registro de Pedido
const getPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findOne({
            where: { id: req.params.id },
            include: [
                { model: DetallePedido, as: 'detallePedido' },
                { model: Receta, as: 'recetas' },
                { model: Factura, as: 'factura' }
            ]
        });

        if (pedido) {
            const { DETALLE_PEDIDO_id, RECETA_id, FACTURA_id, ...data } = pedido.toJSON(); // Excluir IDs foráneos
            res.json(data);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).send(error.message);
    }
};


// Crear un nuevo registro de detallePedido
// Crear un nuevo detalle de pedido
const createDetallePedido = async (req, res) => {
    try {
        // Crear el detalle de pedido y devolver el objeto completo
        const nuevoDetallePedido = await DetallePedido.create(req.body);

        // Responder con el detalle de pedido recién creado, incluyendo el id
        res.status(201).json(nuevoDetallePedido);
    } catch (error) {
        console.error('Error al crear el detalle de pedido:', error);
        res.status(500).send(error.message);
    }
};
// Crear un nuevo registro de Pedido
const createPedido = async (req, res) => {
    try {
        // Crear el pedido y devolver el objeto completo
        const nuevoPedido = await Pedido.create(req.body);

        // Responder con el pedido recién creado, incluyendo el id
        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).send(error.message);
    }
};


// Actualizar un registro de detallePedido
const updateDetallePedido = async (req, res) => {
    try {
        const result = await DetallePedido.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ "message": "¡DetallePedido actualizado correctamente!" });
        } else {
            res.status(404).json({ message: 'DetallePedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el detalle de pedido:', error);
        res.status(500).send(error.message);
    }
};
// Actualizar un registro de Pedido
const updatePedido = async (req, res) => {
    try {
        const result = await Pedido.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ "message": "¡Pedido actualizado correctamente!" });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).send(error.message);
    }
};


// Eliminar un registro de detallePedido
const deleteDetallePedido = async (req, res) => {
    try {
        const result = await DetallePedido.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ "message": "¡DetallePedido eliminado correctamente!" });
        } else {
            res.status(404).json({ message: 'DetallePedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el detalle de pedido:', error);
        res.status(500).send(error.message);
    }
};
// Eliminar un registro de Pedido
const deletePedido = async (req, res) => {
    try {
        const result = await Pedido.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ "message": "¡Pedido eliminado correctamente!" });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).send(error.message);
    }
};


export const methods = { 
    getAllDetallePedidos,
    getAllPedidos,

    getDetallePedido,
    getPedido,

    createDetallePedido,
    createPedido,

    updateDetallePedido,
    updatePedido,
   
    deleteDetallePedido,
    deletePedido
};