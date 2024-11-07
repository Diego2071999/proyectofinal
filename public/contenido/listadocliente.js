
// Tabla principal de pacientes
$(document).ready(function() {   
    var pacienteUrl = 'http://localhost:4000/datos/paci';
    
    var tablaPacientes = $('#productTable').DataTable({            
        "ajax": {
            "url": pacienteUrl,
            "dataSrc": function(data) {
                return data;
            }
        },
        "columns": [
            {"data": "nombre"},
            {"data": "apellido"},
            {"data": "email"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="btn btn-primary view-btn" onclick="verRecetas(${data.id})">
                            <i class="fas fa-eye"></i> Ver Recetas
                        </button>
                    `;
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ registros totales)"
        }
    });

    $('#customSearchContainer').append($('.dataTables_filter'));

    $('.dataTables_filter input').on('input', function () {
        tablaPacientes.search(this.value).draw();
    });
});

// Función para redireccionar a la página de recetas
function verRecetas(pacienteId) {
    window.location.href = `historialcliente.html?id=${pacienteId}`;
}
// Tabla principal de pacientes
$(document).ready(function() {   
    var pacienteUrl = 'http://localhost:4000/datos/paci';
    
    var tablaPacientes = $('#productTable').DataTable({            
        "ajax": {
            "url": pacienteUrl,
            "dataSrc": function(data) {
                return data;
            }
        },
        "columns": [
            {"data": "nombre"},
            {"data": "apellido"},
            {"data": "email"},
            {
                "data": null,
                "render": function(data, type, row) {
                    // Asegurarse de que el ID se pase correctamente
                    return `
                        <button class="btn btn-primary view-btn" onclick="verRecetas('${data.id}')">
                            <i class="fas fa-eye"></i> Ver Recetas
                        </button>
                    `;
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ registros totales)"
        }
    });

    $('#customSearchContainer').append($('.dataTables_filter'));

    $('.dataTables_filter input').on('input', function () {
        tablaPacientes.search(this.value).draw();
    });
});

// Función para redireccionar a la página de recetas
function verRecetas(pacienteId) {
    // Asegurarse de que el ID se pase como string en la URL
    window.location.href = `historialcliente.html?id=${encodeURIComponent(pacienteId)}`;
}
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');

    if (!pacienteId) {
        $('#errorMessage').html(`
            <div class="alert alert-warning">
                No se ha especificado un paciente.
            </div>
        `);
        return;
    }

    // Primero, obtener los datos del paciente
    fetch(`http://localhost:4000/datos/paci/${pacienteId}`)
        .then(response => response.json())
        .then(paciente => {
            // Mostrar información del paciente
            $('#pacienteInfo').html(`
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Información del Paciente</h5>
                        <p class="card-text">
                            <strong>Nombre:</strong> ${paciente.nombre} ${paciente.apellido}<br>
                            <strong>Email:</strong> ${paciente.email || 'No disponible'}
                        </p>
                    </div>
                </div>
            `);
        })
        .catch(error => {
            console.error('Error al obtener datos del paciente:', error);
            $('#errorMessage').html(`
                <div class="alert alert-danger">
                    Error al cargar los datos del paciente.
                </div>
            `);
        });

    // Agregar estilos personalizados
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            #tablaSecundaria td, #tablaSecundaria th {
                font-size: 0.9rem;
                padding: 8px;
                max-width: 150px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #tablaSecundaria td.expandable-cell:hover {
                white-space: normal;
                overflow: visible;
                background-color: #f8f9fa;
                position: relative;
                z-index: 1;
            }
            .medicamento-info {
                max-width: 200px;
                line-height: 1.2;
            }
        `)
        .appendTo('head');

    // Definir tablaSecundaria aquí para que sea accesible en otras funciones
    const tablaSecundaria = $('#tablaSecundaria').DataTable({
        "ajax": {
            "url": `http://localhost:4000/transaccion/recetas?paciente_cod=${pacienteId}`,
            "method": "GET",
            "dataSrc": function(response) {
                if (!response || response.error || !Array.isArray(response)) {
                    $('#errorMessage').html(`
                        <div class="alert alert-warning">
                            ${response?.error || 'No se encontraron recetas para este paciente'}
                        </div>
                    `);
                    return [];
                }

                // Filtrar recetas por el ID del paciente
                return response.filter(receta => {
                    const recetaPacienteId = receta.PACIENTE_cod?.toString() || 
                                           receta.paciente?.id?.toString();
                    return recetaPacienteId === pacienteId;
                });
            }
        },
        "columns": [
            { 
                "data": "id",
                "title": "ID Receta",
                "className": "text-center"
            },
            {
                "data": "medicamento",
                "title": "Medicamento",
                "className": "expandable-cell",
                "render": function(data) {
                    if (!data) return '<span class="text-muted">No disponible</span>';
                    return `<div class="medicamento-info">
                        ${data.nombre || ''} ${data.contenido || ''}<br>
                        ${data.presentacion || ''}
                    </div>`;
                }
            },
            {
                "data": "medicamento.descripcion",
                "title": "Descripción",
                "className": "expandable-cell",
                "defaultContent": "<span class='text-muted'>No disponible</span>"
            },
            { 
                "data": "detalleReceta.dosis_diaria",
                "title": "Dosis Diaria",
                "className": "text-center",
                "defaultContent": "<span class='text-muted'>-</span>"
            },
            { 
                "data": "detalleReceta.tiempo_consumo",
                "title": "Días",
                "className": "text-center",
                "defaultContent": "<span class='text-muted'>-</span>"
            },
            { 
                "data": "detalleReceta.fecha_inicio",
                "title": "Inicio",
                "className": "text-center",
                "render": function(data) {
                    return data ? new Date(data).toLocaleDateString() : '<span class="text-muted">-</span>';
                }
            },
            { 
                "data": "detalleReceta.fecha_fin",
                "title": "Fin",
                "className": "text-center",
                "render": function(data) {
                    return data ? new Date(data).toLocaleDateString() : '<span class="text-muted">-</span>';
                }
            }
        ],
        "order": [[6, 'desc']], // Ordenar por fecha de inicio descendente
        "language": {
            "search": "Buscar:",
            "zeroRecords": "No se encontraron recetas para este paciente",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ recetas",
            "infoEmpty": "No hay recetas disponibles",
            "infoFiltered": "(filtrado de _MAX_ recetas totales)",
            "emptyTable": "No hay recetas disponibles para este paciente",
            "loadingRecords": "Cargando...",
            "processing": "Procesando..."
        },
        "pageLength": 10,
        "responsive": true,
        "scrollX": true,
        "autoWidth": false,
        "processing": true,
        "serverSide": false
    });

    function createNewOrder(button) {
    const pacienteId = $(button).data('paciente-id'); // Obtén el ID del atributo
    console.log("ID del paciente:", pacienteId); // Verifica el ID obtenido
    if (!pacienteId) {
        alert("ID de paciente no válido.");
        return;
    }


    $.ajax({
        url: `http://localhost:4000/transaccion/recetas?paciente_cod=${pacienteId}`,
        method: 'GET',
        success: function(data) {
            if (data && data.length > 0) { // Verifica si hay datos
                console.log("Recetas obtenidas:", data);
                // Aquí puedes agregar lógica adicional para manejar las recetas
            } else {
                alert("ID de paciente no válido."); // Avisa si no hay datos
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener recetas:', error);
            alert('Error al cargar las recetas.');
        }
    });   
}

    // Función para exportar a Excel
    function exportToExcel() {
        const tableData = [];

        // Obtener los datos de la tabla DataTable
        tablaSecundaria.rows({ search: 'applied' }).every(function() {
            const data = this.data();
            tableData.push([
                data.id,
                data.medicamento?.nombre || 'No disponible',
                data.medicamento?.contenido || '',
                data.medicamento?.presentacion || '',
                data.medicamento?.descripcion || 'No disponible',
                data.detalleReceta?.dosis_diaria || '-',
                data.detalleReceta?.tiempo_consumo || '-',
                data.detalleReceta?.fecha_inicio ? new Date(data.detalleReceta.fecha_inicio).toLocaleDateString() : '-',
                data.detalleReceta?.fecha_fin ? new Date(data.detalleReceta.fecha_fin).toLocaleDateString() : '-',
            ]);
        });

        // Agregar encabezados
        const headers = ['ID Receta', 'Medicamento', 'Contenido', 'Presentación', 'Descripción', 'Dosis Diaria', 'Días', 'Fecha Inicio', 'Fecha Fin'];
        tableData.unshift(headers); // Agregar encabezados al principio del array

        // Crear un libro de Excel
        const ws = XLSX.utils.aoa_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Recetas");

        // Exportar el archivo
        XLSX.writeFile(wb, 'recetas.xlsx');
    }

    // Asignar la función al botón
    document.getElementById('exportToExcel').addEventListener('click', exportToExcel);

    // Ajustar columnas automáticamente al cambiar el tamaño de la ventana
    $(window).on('resize', function () {
        tablaSecundaria.columns.adjust();
    });
});
