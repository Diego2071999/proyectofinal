$(document).ready(function () {
  var url = 'http://localhost:4000/datos/pedido';
  var recetasUrl = 'http://localhost:4000/datos/recetas';
  var detalleUrl = 'http://localhost:4000/datos/detalle';
  var pacientesUrl = 'http://localhost:4000/datos/paci';

  const dateFilterHtml = `
     <div class="date-filter-container mb-3">
    <button id="showTodayBtn" class="btn btn-primary mr-2">Ver solo hoy</button>
    <input type="date" id="dateFilter" class="form-control d-inline-block" style="width: auto;">
  </div>
  `;
  $('#tablaPedidos_wrapper').prepend(dateFilterHtml);

  Promise.all([
    fetch(recetasUrl), 
    fetch(detalleUrl),
    fetch(pacientesUrl)
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([recetasData, detalleData, pacientesData]) => {
      console.log('Datos de recetas:', recetasData);

      const medicamentosMap = {};
      detalleData.forEach(detalle => {
        medicamentosMap[detalle.medicamento.id] = {
          descripcion: detalle.medicamento.descripcion,
          codigo: detalle.medicamento.codigo
        };
      });

      const pacientesMap = {};
      recetasData.forEach(receta => {
        if (receta.paciente) {
          const pacienteFactura = pacientesData.find(p => p.id === receta.paciente.id)?.Factura;
          pacientesMap[receta.PACIENTE_cod] = {
            nombre: receta.paciente.nombre,
            apellido: receta.paciente.apellido,
            nombreCompleto: `${receta.paciente.nombre} ${receta.paciente.apellido}`,
            cod: receta.PACIENTE_cod,
            direccion: receta.paciente.direccion,
            referencia: receta.paciente.referencia,
            telefono: receta.paciente.telefono,
            email: receta.paciente.email,
            edad: receta.paciente.edad,
            nombre_encargado: receta.paciente.nombre_encargado,
            nit: pacienteFactura?.nit,
            nomfac: pacienteFactura?.nomfac
          };
        }
      });

      let currentSearchTerm = ''; // Definido aquí

      var table = $('#tablaPedidos').DataTable({
        "ajax": {
          "url": url,
          "dataSrc": function(json) {
            const selectedDate = $('#dateFilter').val();
            let filteredData = json.filter(item => {
              const itemDate = item.fecha.split('T')[0];
              return itemDate === selectedDate;
            });

            if (currentSearchTerm) {
              const searchTermLower = currentSearchTerm.toLowerCase();
              const searchTerms = searchTermLower.split(' '); // Divide el término en partes
              const matchingPacienteCods = new Set();
              
              filteredData.forEach(item => {
                const pacienteCod = item.recetas ? item.recetas.PACIENTE_cod : null;
                if (pacienteCod && pacientesMap[pacienteCod]) {
                  const paciente = pacientesMap[pacienteCod];
                  // Verificar si alguna de las partes del término de búsqueda coincide con nombre o apellido
                  const nameMatches = searchTerms.some(term => paciente.nombre.toLowerCase().includes(term));
                  const surnameMatches = searchTerms.some(term => paciente.apellido.toLowerCase().includes(term));

                  if (nameMatches || surnameMatches) {
                    matchingPacienteCods.add(pacienteCod);
                  }
                }
              });

              filteredData = filteredData.filter(item => {
                const pacienteCod = item.recetas ? item.recetas.PACIENTE_cod : null;
                return matchingPacienteCods.has(pacienteCod);
              });
            }

            return filteredData;
          }
        },
        "columns": [
          { "data": "id" },
          { 
            "data": "fecha",
            "render": function(data) {
              return new Date(data).toLocaleDateString();
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              if (pacienteCod && pacientesMap[pacienteCod]) {
                const paciente = pacientesMap[pacienteCod];
                return `<div class="paciente-info">
                          <span class="nombre-completo">${paciente.nombreCompleto}</span>
                       </div>`;
              }
              return '<div class="paciente-info">Paciente no encontrado</div>';
            }
          },
          {
            "data": "detallePedido.cantidad",
            "defaultContent": "0"
          },
          {
            "data": "detallePedido.MEDICAMENTO_id",
            "render": function (data) {
              return medicamentosMap[data]?.codigo || 'No disponible';
            }
          },
          {
            "data": "detallePedido.MEDICAMENTO_id",
            "render": function (data) {
              return medicamentosMap[data]?.descripcion || 'Medicamento no encontrado';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.direccion || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.referencia || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.telefono || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.email || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.edad || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.nombre_encargado || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.nit || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;
              return pacientesMap[pacienteCod]?.nomfac || 'No disponible';
            }
          },
          {
            "data": null,
            "render": function (data) {
              return `<button class="new-order-button" style="padding: 5px 10px; font-size: 14px;" onclick="verDetallePedido(${data.id})">Ver Pedido</button>`;
            }
          }
        ],
        "language": {
          "search": "Buscar paciente:",
          "zeroRecords": "No hay pedidos para ningun paciente hoy",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
          "infoEmpty": "Mostrando 0 a 0 de 0 registros",
          "infoFiltered": "(filtrado de _MAX_ registros totales)"
        },
        "order": [[1, 'desc']],
        "searching": true,
        "pageLength": 10
      });

      $('.dataTables_filter input').on('input', function() {
        currentSearchTerm = $(this).val(); // Actualiza currentSearchTerm
        table.ajax.reload(); // Recarga la tabla
      });

      $('#showTodayBtn').on('click', function () {
        const today = new Date().toISOString().split('T')[0];
        $('#dateFilter').val(today).trigger('change'); // Trigger change event to apply filter
      });

      $('#dateFilter').on('change', function () {
        table.ajax.reload(); // Reload data based on selected date
      });
    })
    .catch(error => console.error('Error al cargar datos:', error));
});


// Función para ordenar la tabla de pedidos
function ordenarPor(criterio) {
  const columnasOrdenamiento = {
    'nombre': 2, // Índice de la columna que contiene el nombre del paciente
    'medicamento': 4,     // Índice de la columna que contiene el medicamento
    'fecha': 1            // Índice de la columna de fecha
  };

  if (criterio in columnasOrdenamiento) {
    const tabla = $('#tablaPedidos').DataTable();
    tabla.order([columnasOrdenamiento[criterio], 'asc']).draw();
  }
}

// Agregar esta función en tu archivo pedidos.js original
function verDetallePedido(pedidoId) {
  window.location.href = `pedidos.html?id=${pedidoId}`;
}

// Función para redirigir al detalle del pedido
function verDetallePedido(pedidoId) {
  window.location.href = `registroPedidos.html?id=${pedidoId}`;
}

// Descargar Excel
document.getElementById('downloadExcel').addEventListener('click', function() {
  var table = document.getElementById('tablaPedidos');

  // Crea un nuevo array de filas excluyendo la última columna
  var rows = Array.from(table.rows).map(row => 
      Array.from(row.cells).slice(0, -1).map(cell => cell.innerText)
  );

  // Crea una hoja de trabajo a partir del array de filas sin la columna de acciones
  var workbook = XLSX.utils.book_new();
  var worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

  // Descarga el archivo Excel
  XLSX.writeFile(workbook, 'pedidos.xlsx');
});

//descargar pdf
document.getElementById('generate-pdf-btn').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape'); // Cambiar a modo horizontal

  // Título del PDF
  doc.text("Lista de Pedidos", 14, 16);
  
  // Obtener los datos de la tabla
  const rows = document.querySelectorAll("#tablaPedidos tbody tr");
  
  // Variables para la información general
  let fecha, nombre, nit, nombreFactura, direccion, referencia, telefono, correo;
  let totalCantidad = 0; // Variable para sumar cantidades

  // Definir solo las columnas que queremos mostrar en la tabla
  const columns = [
      "No. Pedido",
      "Cantidad",
      "Código Medicamento",
      "Medicamento",
      "Edad",
      "Nombre del Encargado"
  ];

  const tableData = [];

  rows.forEach((row, index) => {
      const cols = row.querySelectorAll("td");
      
      // Guardar datos para la información general solo en la primera fila
      if (index === 0) {
          fecha = cols[1].innerText; // Fecha
          nombre = cols[2].innerText; // Nombre
          direccion = cols[6].innerText; // Dirección
          referencia = cols[7].innerText; // Referencia
          telefono = cols[8].innerText; // Teléfono
          correo = cols[9].innerText; // Correo
          nit = cols[12].innerText; // NIT
          nombreFactura = cols[13].innerText; // Nombre de la Factura
      }

      // Sumar la cantidad
      const cantidad = parseInt(cols[3].innerText) || 0;
      totalCantidad += cantidad;

      // Crear array solo con las columnas que queremos mostrar
      const rowData = [
          cols[0].innerText, // No. Pedido
          cantidad, // Cantidad
          cols[4].innerText, // Código Medicamento
          cols[5].innerText, // Medicamento
          cols[10].innerText, // Edad
          cols[11].innerText // Nombre del Encargado
      ];
      
      tableData.push(rowData);
  });

  // Agregar fila de totales
  const totalRow = [
      'TOTAL',
      totalCantidad,
      '',
      '',
      '',
      ''
  ];
  tableData.push(totalRow);

  // Imprimir la información general en el PDF
  const generalInfo = [
      `Fecha: ${fecha}`,
      `Nombre: ${nombre}`,
      `NIT: ${nit}`,
      `Nombre de la Factura: ${nombreFactura}`,
      `Dirección: ${direccion}`,
      `Referencia: ${referencia}`,
      `Teléfono: ${telefono}`,
      `Correo: ${correo}`
  ];

  // Establecer la posición para la información general
  let infoYPosition = 30;
  doc.text("Información General:", 14, infoYPosition);
  infoYPosition += 10; // Espacio después del título de información general

  generalInfo.forEach(info => {
      doc.text(info, 14, infoYPosition);
      infoYPosition += 10; // Espacio entre cada línea de información
  });

  // Generar la tabla en el PDF con estilos personalizados para la fila de totales
  doc.autoTable({
      head: [columns],
      body: tableData,
      startY: infoYPosition + 10,
      theme: 'grid',
      headStyles: { 
          fillColor: [77, 181, 227] 
      },
      didParseCell: function(data) {
          // Aplicar estilos especiales a la última fila (totales)
          if (data.row.index === tableData.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 240, 240];
              if (data.column.index === 1) { // Columna de cantidad
                  data.cell.styles.halign = 'right'; // Alinear a la derecha
              }
          }
      },
      columnStyles: {
          1: { // Estilo para la columna de cantidad
              halign: 'right'
          }
      }
  });

  // Guardar el PDF
  doc.save("pedidos.pdf");
});