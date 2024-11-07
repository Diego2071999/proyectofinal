$(document).ready(function () {
    var url = 'http://localhost:4000/datos/recetas';
    var patientDoctorRelation = {}; // Almacena la relación Paciente-Doctor
    var delayedRecords = [];
    var currentRecords = [];

    // Consulta la relación Paciente-Doctor y almacénala
    $.ajax({
        url: 'http://localhost:4000/datos/docpaci',
        method: 'GET',
        success: function(data) {
            data.forEach(relation => {
                patientDoctorRelation[relation.PACIENTE_id] = relation.DOCTOR_id;
            });
        },
        error: function(err) {
            console.error('Error al obtener la relación Paciente-Doctor:', err);
        }
    });

    // Crear botón de registros retrasados
    var delayedButton = $('<button>')
        .text('Retrasados (0)')
        .addClass('delayed-button')
        .on('click', function() {
            if ($(this).hasClass('showing-delayed')) {
                table.clear().rows.add(currentRecords).draw();
                $(this).removeClass('showing-delayed').text('Retrasados (' + delayedRecords.length + ')');
            } else {
                table.clear().rows.add(delayedRecords).draw();
                $(this).addClass('showing-delayed').text('Mostrar Actuales');
            }
        });

    // Agregar botón al contenedor específico
    $('#delayedButtonContainer').append(delayedButton);
    
    var table = $('#recetaTable').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": function (data) {
                const today = new Date();
                delayedRecords = [];
                currentRecords = [];

                if (!data || data.length === 0) {
                    console.warn("No se encontraron datos en la respuesta del servidor.");
                    return [];
                }

                data.forEach(item => {
                    const fechaFin = new Date(item.detalleReceta.fecha_fin);
                    const diffTime = fechaFin - today;
                    item.daysToToday = diffTime / (1000 * 60 * 60 * 24);

                    if (item.daysToToday < 0) {
                        delayedRecords.push(item);
                    } else {
                        currentRecords.push(item);
                    }

                    // Agregar DOCTOR_id desde la relación Paciente-Doctor
                    item.DOCTOR_id = patientDoctorRelation[item.paciente.id] || 'No asignado';
                });

                delayedButton.text('Retrasados (' + delayedRecords.length + ')');
                currentRecords.sort((a, b) => a.daysToToday - b.daysToToday);
                
                console.log('Datos cargados desde la API:', currentRecords);
                return currentRecords;
            }
        },
       "columns": [
            {
                "data": "paciente",
                "title": "Paciente",
                "render": function (data, type, row) {
                    // Updated render function to include Factura data
                    const factura = data.Factura || {};
                    const nit = factura.nit || 'No disponible';
                    const nomfac = factura.nomfac || 'No disponible';

                    return `
                    <strong>Nombre:</strong> ${data.nombre} ${data.apellido}<br>
                    <strong>Edad:</strong> ${data.edad} años<br>
                    <strong>Encargado:</strong> ${data.nombre_encargado}<br>
                    <strong>Dirección:</strong> ${data.direccion}<br>
                    <strong>Referencia:</strong> ${data.referencia}<br>
                    <strong>NIT:</strong> ${nit}<br>
                    <strong>Nombre Factura:</strong> ${nomfac}<br>
                    <strong>Email:</strong> ${data.email}<br>
                    <strong>Teléfonos:</strong> ${data.telefono} / ${data.telefono2}<br>
                    `;
                }
            },
            {
                "data": "medicamento",
                "title": "Medicamento",
                "render": function (data, type, row) {
                    return `
                    <strong>Código:</strong> ${data.codigo}<br>
                    <strong>Descripción:</strong> ${data.descripcion}
                    `;
                }
            },
            {
                "data": "detalleReceta",
                "title": "Detalles de Receta",
                "render": function (data, type, row) {
                    if (type === 'sort') {
                        return new Date(data.fecha_fin).getTime();
                    }
                    
                    const diasRestantes = Math.ceil(row.daysToToday);
                    const estadoDias = diasRestantes >= 0 
                        ? `<span class="text-success">${diasRestantes} días restantes</span>`
                        : `<span class="text-danger">${Math.abs(diasRestantes)} días de retraso</span>`;

                    return `
                    <strong>Dosis diaria:</strong> ${data.dosis_diaria}<br>
                    <strong>Tiempo consumo:</strong> ${data.tiempo_consumo} días<br>
                    <strong>Inicio:</strong> ${new Date(data.fecha_inicio).toLocaleDateString()}<br>
                    <strong>Fin:</strong> ${new Date(data.fecha_fin).toLocaleDateString()}<br>
                    <strong>Dias Restantes:</strong> ${estadoDias}
                    `;
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button class="update-btn" onclick="abrirReabastecerModal(${data.id}, ${row.paciente.id}, ${row.medicamento.id})">Reabastecer</button>
                        <input type="hidden" name="DOCTOR_id" value="${row.DOCTOR_id}"> <!-- Campo oculto de DOCTOR_id -->
                    `;
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)"
        },
        "responsive": true,
        "orderCellsTop": true,
        "fixedHeader": true,
        "pageLength": 10,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('id', `row-${data.id}`).addClass('align-middle');
            
            if (data.daysToToday < 0) {
                $(row).addClass('delayed-row bg-light-danger');
            }
        },
        "order": [[2, 'asc']]
    });

    $('#customSearchContainer').append($('.dataTables_filter'));

    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });

    $('.dataTables_filter label').contents().filter(function() {
        return this.nodeType === 3;
    }).remove();

    $('.dataTables_filter input').attr('placeholder', 'Buscar...');
});


function seleccionarFila(fila) {
    // Asumimos que los IDs están en los inputs ocultos dentro de la fila
    const medicamentoId = fila.querySelector('input[type="hidden"]:nth-of-type(1)').value; // ID del medicamento
    const pacienteId = fila.querySelector('input[type="hidden"]:nth-of-type(2)').value; // ID del paciente
    const recetaId = fila.querySelector('input[type="hidden"]:nth-of-type(3)').value; // ID de la receta

    // Asignar los valores a los campos ocultos
    document.getElementById('medicamentoId').value = medicamentoId;
    document.getElementById('pacienteId').value = pacienteId;
    document.getElementById('recetaId').value = recetaId;

    // Opcional: abrir el modal
    abrirModal();
}

async function obtenerCantidadDetallePedido(recetaId, medicamentoId) {
    try {
        const response = await fetch(`http://localhost:4000/datos/detalle?medicamentoId=${medicamentoId}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const cantidad = data[0].cantidad;
            document.getElementById('cantidadInput').value = cantidad;
        } else {
            console.log('No se encontró la cantidad del detalle de pedido.');
            document.getElementById('cantidadInput').value = '';
        }
    } catch (error) {
        console.error('Error al obtener la cantidad:', error);
        document.getElementById('cantidadInput').value = '';
    }
}

function abrirReabastecerModal(id) {
    document.getElementById('ReabastecerModal').style.display = 'block';
    var table = $('#recetaTable').DataTable();
    var data = table.row(`#row-${id}`).data();

    if (data) {
        const recetaId = id;
        const medicamentoId = data.medicamento.id;
        const pacienteId = data.paciente.id;
        const factura = data.paciente.Factura || {};

        obtenerCantidadDetallePedido(recetaId, medicamentoId);

        const fechaInicio = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Rellena el contenido del modal con los valores actuales y los campos de entrada para edición
        document.getElementById('modalContent').innerHTML = `
                <input type="hidden" id="medicamentoId" value="${medicamentoId}" />
                <input type="hidden" id="pacienteId" value="${pacienteId}" />

                <p><strong>Paciente:</strong> ${data.paciente.nombre} ${data.paciente.apellido}</p>
                <p><strong>Encargado:</strong> ${data.paciente.nombre_encargado}</p>
                <p><strong>Dirección:</strong> ${data.paciente.direccion}</p>
                <p><strong>Referencia:</strong> ${data.paciente.referencia}</p>
                <p><strong>NIT:</strong> ${factura.nit || 'No disponible'}</p>
                <p><strong>Nombre Factura:</strong> ${factura.nomfac || 'No disponible'}</p>
                <p><strong>Email:</strong> ${data.paciente.email}</p>
                <p><strong>Teléfonos:</strong> ${data.paciente.telefono} / ${data.paciente.telefono2}</p>
                <hr>
                <p><strong>Medicamento Código:</strong> ${data.medicamento.codigo}</p>
                <p><strong>Descripción:</strong> ${data.medicamento.descripcion}</p>
                <hr>
                <label for="cantidadInput"><strong>Cantidad:</strong></label>
                <input type="number" id="cantidadInput" placeholder="Cantidad actual..." />
                <hr>
                <label for="dosisDiariaInput"><strong>Dosis diaria:</strong></label>
                <input type="number" id="dosisDiariaInput" value="${data.detalleReceta.dosis_diaria}" placeholder="Dosis diaria..." />
                <label for="tiempoConsumoInput"><strong>Tiempo consumo (días):</strong></label>
                <input type="number" id="tiempoConsumoInput" value="${data.detalleReceta.tiempo_consumo}" placeholder="Tiempo de consumo..." />
                <hr>
                <label for="fechaInicioInput"><strong>Fecha inicio:</strong></label>
                <input type="date" id="fechaInicioInput" value="${fechaInicio}" readonly />
                <hr>
                <label for="fechaFinInput"><strong>Fecha fin (editable):</strong></label>
                <input type="date" id="fechaFinInput" />
                <hr>
            `;

        // Calcular fecha de fin estimada al cambiar la cantidad o dosis
        calcularFechaFin();

        // Agregar eventos para recalcular la fecha fin
        document.getElementById('cantidadInput').addEventListener('input', calcularFechaFin);
        document.getElementById('dosisDiariaInput').addEventListener('input', calcularFechaFin);
        document.getElementById('tiempoConsumoInput').addEventListener('input', calcularFechaFin);

        document.getElementById('ReabastecerModal').style.display = 'block';
    } else {
        alert('No se encontraron datos para la receta seleccionada.');
    }
}

function calcularFechaFin() {
    const cantidad = parseInt(document.getElementById('cantidadInput').value) || 0;
    const dosisDiaria = parseInt(document.getElementById('dosisDiariaInput').value) || 0;
    const tiempoConsumo = parseInt(document.getElementById('tiempoConsumoInput').value) || 0;

    // Obtener la fecha de inicio desde el input del modal
    const fechaInicioInput = document.getElementById('fechaInicioInput').value;
    const fechaInicio = new Date(fechaInicioInput); // Convierte a objeto Date

    // Verifica que la fecha de inicio sea válida
    if (isNaN(fechaInicio)) {
        console.error('Fecha de inicio no válida');
        return;
    }

    // Calcula la cantidad de días necesarios para consumir el medicamento
    let diasNecesarios = 0;

    if (dosisDiaria > 0) {
        diasNecesarios = Math.ceil(cantidad / dosisDiaria); // Redondea hacia arriba
    }

    // Calcula la fecha de fin sumando los días necesarios y el tiempo de consumo
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + diasNecesarios + tiempoConsumo); // Sumar días

    // Actualiza la fecha de fin en el campo de entrada
    document.getElementById('fechaFinInput').value = fechaFin.toISOString().split('T')[0];
}


async function guardarCambios() {
    const cantidad = parseInt(document.getElementById('cantidadInput').value) || 0;
    const dosisDiaria = parseInt(document.getElementById('dosisDiariaInput').value) || 0;
    const tiempoConsumo = parseInt(document.getElementById('tiempoConsumoInput').value) || 0;
    const fechaInicio = document.getElementById('fechaInicioInput').value;
    const fechaFin = document.getElementById('fechaFinInput').value;

    // IDs necesarios
    const medicamentoId = document.getElementById('medicamentoId').value;
    const pacienteId = document.getElementById('pacienteId').value;
    const doctorId = document.querySelector('input[name="DOCTOR_id"]').value;

    try {
        // Primero, obtener la información de factura del paciente usando la URL correcta
        const facturaResponse = await fetch(`http://localhost:4000/datos/paci/${pacienteId}`);
        const pacienteData = await facturaResponse.json();
        const facturaId = pacienteData.FACTURA_id; // Obtener el ID de factura directamente del campo FACTURA_id

        if (!facturaId) {
            console.warn('No se encontró factura asociada al paciente');
        }

        // Guardar en detallePedido
        const detallePedidoResponse = await fetch('http://localhost:4000/datos/detalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cantidad: cantidad,
                MEDICAMENTO_id: medicamentoId,
            }),
        });

        const detallePedidoData = await detallePedidoResponse.json();
        const detallePedidoId = detallePedidoData.id;

        if (!detallePedidoId) {
            throw new Error("No se pudo obtener el ID de detallePedido");
        }

        // Guardar en detalleReceta
        const detalleRecetaResponse = await fetch('http://localhost:4000/datos/receta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dosis_diaria: dosisDiaria,
                tiempo_consumo: tiempoConsumo,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
            }),
        });

        const detalleRecetaData = await detalleRecetaResponse.json();
        const detalleRecetaId = detalleRecetaData.id;

        if (!detalleRecetaId) {
            throw new Error("No se pudo obtener el ID de detalleReceta");
        }

        // Guardar en receta
        const recetaResponse = await fetch('http://localhost:4000/datos/recetas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PACIENTE_cod: pacienteId,
                MEDICAMENTO_id: medicamentoId,
                DETALLE_RECETA_id: detalleRecetaId,
                DOCTOR_id: doctorId
            }),
        });

        const recetaData = await recetaResponse.json();
        const RecetaId = recetaData.id;
        
        if (!RecetaId) {
            throw new Error("No se pudo obtener el ID de Receta");
        }

        // Guardar en pedido incluyendo el ID de factura
        const pedidoResponse = await fetch('http://localhost:4000/datos/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fecha: new Date().toISOString(),
                DETALLE_PEDIDO_id: detallePedidoId,
                RECETA_id: RecetaId,
                FACTURA_id: facturaId // Usar el FACTURA_id obtenido del paciente
            }),
        });
        
        const pedidoData = await pedidoResponse.json();
        console.log("Receta guardada:", pedidoData);

        // Cerrar el modal
        document.getElementById('ReabastecerModal').style.display = 'none';
        alert('Cambios guardados correctamente');
        
        // Opcional: Recargar la tabla para mostrar los cambios
        $('#recetaTable').DataTable().ajax.reload();
        
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios, por favor intenta nuevamente.');
    }
}

function cerrarModal() {
    document.getElementById('ReabastecerModal').style.display = 'none';
}

window.onclick = function (event) {
    var modal = document.getElementById('ReabastecerModal');
    if (event.target == modal) {
        cerrarModal();
    }
}