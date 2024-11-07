import sequelize from "../../database/database.js";
import Clientes from "../models/cliente.js";
import Pacientes from "../models/paciente.js";
import Doctores from "../models/doctor.js";
import Recetas from "../models/receta.js";
import Facturas from "../models/factura.js";
import Medicamentos from "../../models/medicamentos.js";
import TiposEnfermedad from "../models/tipoEnfermedad.js";
//todos los registros
const getAllFacWithRelations = async (req, res) => {
    try {
        const facWithRelations = await Facturas.findAll({
            attributes: ['id', 'CLIENTE_id', 'PACIENTE_id', 'DOCTOR_id', 'TIPO_ENFERMEDAD_id', 'RECETA_id', 'cod_factura', 'cantidad', 'fecha'],
            include: [
                {
                    model: Clientes,
                    attributes: ['nombre_en_factura', 'direccion_de_entrega', 'telefono', 'email']
                },
                {
                    model: Pacientes,
                    attributes: ['nombre', 'apellido', 'edad', 'nombre_encargado']
                },
                {
                    model: Doctores,
                    attributes: ['nombre', 'institucion', 'email']
                },
                {
                    model: TiposEnfermedad,
                    attributes: ['cronica', 'aguda']
                },
                {
                    model: Recetas,
                    attributes: ['dosis_diaria', 'cantidad_diaria', 'tiempo'],
                    include: [
                        {
                            model: Medicamentos,
                            attributes: ['nombre', 'contenido', 'presentacion'], // Asegúrate de usar los atributos correctos
                        }
                    ]
                }
            ]
        });

        res.status(200).json(facWithRelations);
    } catch (error) {
        console.error('Error al obtener los registros con sus relaciones:', error);
        res.status(500).json({ message: 'Error al obtener los registros con sus relaciones' });
    }
};
// Mostrar todos los registros de clientes (solo nombre y codclie)
const getAllClientes = async (req, res) => {
    try {
        const clientes = await Clientes.findAll({
            attributes: ['nombre_en_factura', 'codclie'] // Solo obtener nombre y codclie
        });
        res.status(200).json(clientes); // Enviar respuesta con los clientes encontrados
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

//un solo registro
const getFactura = async (req, res) => {
    try {
        const factura = await Facturas.findOne({
            where: { id: req.params.id }, // Buscar por ID
            attributes: ['id', 'CLIENTE_id', 'PACIENTE_id', 'DOCTOR_id', 'TIPO_ENFERMEDAD_id', 'RECETA_id', 'cod_factura', 'cantidad', 'fecha'],
            include: [
                {
                    model: Clientes,
                    attributes: ['nombre_en_factura', 'direccion_de_entrega', 'telefono', 'email']
                },
                {
                    model: Pacientes,
                    attributes: ['nombre', 'apellido', 'edad', 'nombre_encargado']
                },
                {
                    model: Doctores,
                    attributes: ['nombre', 'institucion', 'email']
                },
                {
                    model: TiposEnfermedad,
                    attributes: ['cronica', 'aguda']
                },
                {
                    model: Recetas,
                    attributes: ['dosis_diaria', 'cantidad_diaria', 'tiempo'],
                    include: [
                        {
                            model: Medicamentos,
                            attributes: ['nombre', 'contenido', 'presentacion'], // Asegúrate de usar los atributos correctos
                        }
                    ]
                }
            ]
        });

        if (factura) {
            res.status(200).json(factura); // Enviar la factura encontrada
        } else {
            res.status(404).json({ message: 'Factura no encontrada' }); // Manejar el caso en que no se encuentre la factura
        }
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({ message: 'Error al obtener la factura' });
    }
};

// Mostrar un solo registro de cliente por ID
const getCliente = async (req, res) => {
    try {
        const cliente = await Clientes.findOne({
            where: { id: req.params.id }, // Buscar por ID
            attributes: ['nombre_en_factura', 'codclie'] // Solo obtener nombre y codclie
        });
        if (cliente) {
            res.json(cliente); // Enviar el cliente encontrado
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).send(error.message);
    }
};

//crear datos
const createFactura = async (req, res) => {
    
}

export const methods = { 
    getAllFacWithRelations,
    getAllClientes,

    getFactura,
    getCliente,

    createFactura
};

