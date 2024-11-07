$(document).ready(function() {
    // Obtener el ID del pedido de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');
    
    if (!pedidoId) {
        alert('No se especificó un ID de pedido');
        return;
    }

    // URLs de las APIs
    const urls = {
        pedido: `http://localhost:4000/datos/pedido/${pedidoId}`,
        recetas: 'http://localhost:4000/datos/recetas',
        detalle: 'http://localhost:4000/datos/detalle',
        pacientes: 'http://localhost:4000/datos/paci'
    };

    // Cargar todos los datos necesarios
    Promise.all([
        fetch(urls.pedido),
        fetch(urls.recetas),
        fetch(urls.detalle),
        fetch(urls.pacientes)
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([pedidoData, recetasData, detalleData, pacientesData]) => {
        // Encontrar la receta correspondiente
        const receta = recetasData.find(r => r.id === pedidoData.recetas?.id);
        const paciente = receta?.paciente;
        const medicamento = detalleData.find(d => 
            d.medicamento.id === pedidoData.detallePedido?.MEDICAMENTO_id
        )?.medicamento;
        const pacienteFactura = pacientesData.find(p => p.id === paciente?.id)?.Factura;

        // Limpiar la tabla existente
        $('#tablaPedidos tbody').empty();

         // Cargar el estado de entrega desde localStorage
         const entregaStatus = localStorage.getItem(`pedido_${pedidoId}`) || (pedidoData.entregado ? 'Entregado' : 'No entregado');

        // Crear la fila con todos los datos
        const row = `
            <tr>
            <td>${pedidoData.id}</td>
            <td>${pedidoData.fecha}</td>
            <td>${paciente ? `${paciente.nombre} ${paciente.apellido}` : 'No disponible'}</td>
            <td>${pedidoData.detallePedido?.cantidad || 'No especificada'}</td>
            <td>${medicamento ? medicamento.codigo || 'No  disponible':  'No disponible'}</td>
            <td>${medicamento ? medicamento.descripcion : 'No disponible'}</td>
            <td>${paciente ? paciente.direccion || 'No disponible' : 'No disponible'}</td>
            <td>${paciente ? paciente.referencia || 'No disponible' : 'No disponible'}</td>
            <td>${paciente ? paciente.telefono || 'No disponible' : 'No disponible'}</td>
            <td>${paciente ? paciente.email || 'No disponible' : 'No disponible'}</td>
            <td>${paciente ? paciente.edad || 'No disponible' : 'No disponible'}</td>
            <td>${paciente ? paciente.nombre_encargado || 'No disponible' : 'No disponible'}</td>
            <td>${pacienteFactura ? pacienteFactura.nit || 'No disponible' : 'No disponible'}</td>
            <td>${pacienteFactura ? pacienteFactura.nomfac || 'No disponible' : 'No disponible'}</td>
            <td class="estado" style="cursor: pointer;" onclick="toggleEntrega(this)">${entregaStatus}</td>
            <td>
                <button class="new-order-button" style="padding: 5px 10px; font-size: 14px; margin-right: 5px;" onclick="verPedidosRelacionados('${pedidoData.fecha}', ${paciente?.id})">
                    Ver Pedidos Relacionados
                </button>
            </td>
        </tr>
        `;

        // Agregar la fila a la tabla
        $('#tablaPedidos tbody').append(row);

        // Inicializar DataTable con configuraciones específicas
        if (!$.fn.DataTable.isDataTable('#tablaPedidos')) {
            $('#tablaPedidos').DataTable({
                "language": {
                    "search": "Buscar paciente:",
                    "zeroRecords": "No se encontraron resultados",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                    "infoFiltered": "(filtrado de _MAX_ registros totales)"
                },
                "ordering": false, // Desactivar el ordenamiento ya que solo hay una fila
                "paging": false,   // Desactivar la paginación
                "searching": false // Desactivar la búsqueda
            });
        }

        // Actualizar el título con información del pedido
        $('h2').text(`Detalle del Pedido #${pedidoData.id}`);

        // Agregar botón para volver
        if (!$('.back-button').length) {
            $('.new-order-button').before(`
                <button class="new-order-button" onclick="window.history.back()" style="margin-right: 10px;">
                    Volver a Pedidos
                </button>
            `);
        }
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        $('#errorMessage').html(`
            <div style="color: red; padding: 10px; margin-bottom: 10px; text-align: center;">
                Error al cargar los datos del pedido. Por favor, intente nuevamente.
            </div>
        `);
    });
});


function toggleEntrega(cell) {
    const currentStatus = cell.innerText; // Obtener el estado actual
    const pedidoId = new URLSearchParams(window.location.search).get('id'); // Obtener el ID del pedido

    // Verificar si el pedido ya está entregado
    if (currentStatus === 'Entregado') {
        alert('Este pedido ya ha sido marcado como entregado y no puede ser cambiado.');
        return; // Salir de la función para evitar cambios
    }

    // Cambiar el estado a entregado
    if (currentStatus === 'No entregado') {
        cell.innerText = 'Entregado'; // Cambiar a entregado
        cell.style.cursor = 'default'; // Cambiar el cursor a default
        cell.onclick = null; // Deshabilitar el evento de clic

        // Guardar el estado en localStorage
        localStorage.setItem(`pedido_${pedidoId}`, 'Entregado');
    }
}

function verPedidosRelacionados(fecha, pacienteCod) {
    if (!pacienteCod) {
        alert('No se puede obtener los pedidos relacionados: Código de paciente no disponible');
        return;
    }

    console.log('Buscando pedidos para paciente:', pacienteCod, 'en fecha:', fecha);

    // Crear y mostrar el modal
    const modalHtml = `
    <div id="pedidosRelacionadosModal" class="modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4);">
    <div class="modal-content" style="background-color: white; margin: 5% auto; padding: 20px; width: 95%; max-width: 1400px; position: relative; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <span class="close" style="position: absolute; right: 15px; top: 10px; font-size: 28px; cursor: pointer; color: #666;">&times;</span>
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #333;">Pedidos Relacionados del Día</h3>
            <button id="imprimirPDFBtn" class="new-order-button" style="padding: 8px 16px; font-size: 14px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Imprimir PDF
            </button>
        </div>
        <div id="pedidosRelacionadosContent" style="overflow-x: auto;">
            <table id="tablaPedidosRelacionados" class="display" style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 100px;">ID Pedido</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 100px;">Fecha</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 80px;">Cantidad</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 150px;">Código Medicamento</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 200px;">Descripción Medicamento</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 150px;">Paciente</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 150px;">Doctor</th>
                        <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; min-width: 100px;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="8" style="padding: 15px; text-align: center; border-bottom: 1px solid #ddd;">Cargando...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
#pedidosRelacionadosModal table tr:nth-child(even) {
    background-color: #f9f9f9;
}

#pedidosRelacionadosModal table tr:hover {
    background-color: #f5f5f5;
}

#pedidosRelacionadosModal table td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    line-height: 1.4;
}

#tablaPedidosRelacionados td:hover {
    overflow: visible;
    white-space: normal;
    word-wrap: break-word;
    z-index: 1;
}

#tablaPedidosRelacionados td:hover::after {
    content: attr(data-content);
    position: absolute;
    left: 0;
    top: 0;
    width: auto;
    min-width: 100%;
    background-color: #fff;
    padding: 12px 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-radius: 4px;
    z-index: 2;
}

@media screen and (max-width: 768px) {
    .modal-content {
        margin: 0;
        padding: 10px;
        width: 100%;
        height: 100%;
        max-width: none;
    }
    
    #pedidosRelacionadosModal table {
        font-size: 12px;
    }
    
    #pedidosRelacionadosModal table th,
    #pedidosRelacionadosModal table td {
        padding: 8px 10px;
    }
}
</style>

<script>
// Función para agregar el atributo data-content a todas las celdas
function initializeTableCells() {
    const cells = document.querySelectorAll('#tablaPedidosRelacionados td');
    cells.forEach(cell => {
        if (!cell.hasAttribute('colspan')) {
            cell.setAttribute('data-content', cell.textContent);
        }
    });
}

// Agregar el evento después de que la tabla se actualice
const observer = new MutationObserver(() => {
    initializeTableCells();
});

observer.observe(document.querySelector('#tablaPedidosRelacionados tbody'), {
    childList: true,
    subtree: true
});

// Inicializar las celdas existentes
document.addEventListener('DOMContentLoaded', initializeTableCells);
</script>
    `;

    // Agregar el modal al body si no existe
    if (!document.getElementById('pedidosRelacionadosModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Configurar el cierre del modal
    document.querySelector('.close').onclick = function() {
    document.getElementById('pedidosRelacionadosModal').remove();
    };

    // Cargar los pedidos relacionados
    Promise.all([
        fetch('http://localhost:4000/datos/pedido'),
        fetch('http://localhost:4000/datos/detalle'),
        fetch('http://localhost:4000/datos/docpaci')
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([allPedidos, detalleData, docPaciData]) => {
        console.log('Total pedidos encontrados:', allPedidos.length);
        
        // Filtrar pedidos por fecha y paciente
        const fechaComparar = new Date(fecha).toISOString().split('T')[0];
        const pedidosRelacionados = allPedidos.filter(pedido => {
            const pedidoFecha = new Date(pedido.fecha).toISOString().split('T')[0];
            const coincideFecha = pedidoFecha === fechaComparar;
            const coincidePaciente = pedido.recetas?.PACIENTE_cod === pacienteCod;
            
            if (coincideFecha && coincidePaciente) {
                console.log('Pedido relacionado encontrado:', pedido.id);
            }
            
            return coincideFecha && coincidePaciente;
        });

        console.log('Pedidos relacionados encontrados:', pedidosRelacionados.length);

        // Crear mapa de medicamentos
        const medicamentosMap = {};
        detalleData.forEach(detalle => {
            medicamentosMap[detalle.medicamento.id] = {
                descripcion: detalle.medicamento.descripcion,
                codigo: detalle.medicamento.codigo
            };
        });

        // Crear mapa de relaciones doctor-paciente
        const docPaciMap = {};
        docPaciData.forEach(relacion => {
            docPaciMap[relacion.PACIENTE_cod] = {
                pacienteNombre: `${relacion.Paciente.nombre} ${relacion.Paciente.apellido}`,
                doctorNombre: relacion.Doctor.nombre,
                doctorInstituto: relacion.Doctor.instituto
            };
        });

        // Destruir DataTable si ya existe
        if ($.fn.DataTable.isDataTable('#tablaPedidosRelacionados')) {
            $('#tablaPedidosRelacionados').DataTable().destroy();
        }

        // Actualizar la tabla con los pedidos relacionados
        const tbody = document.querySelector('#tablaPedidosRelacionados tbody');
        if (pedidosRelacionados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No se encontraron pedidos relacionados</td></tr>';
        } else {
            tbody.innerHTML = pedidosRelacionados.map(pedido => {
                const relacion = docPaciMap[pedido.recetas?.PACIENTE_cod] || {};
                return `
                    <tr>
                        <td>${pedido.id}</td>
                        <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
                        <td>${pedido.detallePedido?.cantidad || 'No especificada'}</td>
                        <td>${medicamentosMap[pedido.detallePedido?.MEDICAMENTO_id]?.codigo || 'No disponible'}</td>
                        <td>${medicamentosMap[pedido.detallePedido?.MEDICAMENTO_id]?.descripcion || 'No disponible'}</td>
                        <td>${relacion.pacienteNombre || 'No disponible'}</td>
                        <td>${relacion.doctorNombre ? `${relacion.doctorNombre} (${relacion.doctorInstituto})` : 'No disponible'}</td>
                        <td>${localStorage.getItem(`pedido_${pedido.id}`) || (pedido.entregado ? 'Entregado' : 'No entregado')}</td>
                    </tr>
                `;
            }).join('');
        }

        // Inicializar DataTable
        $('#tablaPedidosRelacionados').DataTable({
            "language": {
                "search": "Buscar:",
                "zeroRecords": "No se encontraron pedidos relacionados",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                "infoFiltered": "(filtrado de _MAX_ registros totales)"
            },
            "ordering": true,
            "paging": true,
            "pageLength": 10,
            "searching": true
        });
        $('#tablaPedidosRelacionados').DataTable({
            // ... configuración existente ...
            "autoWidth": false,
            "columnDefs": [
                { "width": "8%", "targets": 0 },
                // ... hasta ...
                { "width": "9%", "targets": 7 }
            ],
            "scrollX": true,
            "responsive": true
        });

        // Configurar el evento click del botón imprimir PDF
        document.getElementById('imprimirPDFBtn').onclick = function() {
            // Obtener los datos necesarios para generar el PDF
            Promise.all([
                fetch('http://localhost:4000/datos/recetas')
            ])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(([recetasData]) => {
                generarPDF(
                    fecha,
                    pacienteCod,
                    pedidosRelacionados,
                    medicamentosMap,
                    recetasData,
                    docPaciMap
                );
            })
            .catch(error => {
                console.error('Error al obtener datos para el PDF:', error);
                alert('Error al generar el PDF. Por favor, intente nuevamente.');
            });
        };
    })
    .catch(error => {
        console.error('Error al cargar datos:', error);
        document.querySelector('#pedidosRelacionadosContent').innerHTML = 
            '<p style="color: red;">Error al cargar los pedidos relacionados</p>';
    });
}
window.jspdf = window.jspdf || {};

async function generarPDF(fecha, pacienteCod, pedidos, medicamentosMap, recetasData, docPaciMap) {
    try {
        // Encontrar la información del paciente
        const receta = recetasData.find(r => r.PACIENTE_cod === pacienteCod);
        const paciente = receta?.paciente;
        const nombrePaciente = paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente no encontrado';

        // Calcular el total de la cantidad
        const totalCantidad = pedidos.reduce((total, pedido) => {
            return total + (pedido.detallePedido?.cantidad || 0);
        }, 0);

        // Crear el contenido del PDF
        const elementoTemporal = document.createElement('div');
        elementoTemporal.innerHTML = `
            <div id="contenidoPDF" style="padding: 20px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="margin: 0;">Reporte de Pedidos Relacionados</h2>
                    <p style="margin: 5px 0;">Paciente: ${nombrePaciente}</p>
                    <p style="margin: 5px 0;">Fecha: ${new Date(fecha).toLocaleDateString()}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                            <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;">ID Pedido</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Fecha</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Cantidad</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Código Med.</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Descripción Med.</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Paciente</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Doctor</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 8%;"">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidos.map(pedido => {
                            const relacion = docPaciMap[pedido.recetas?.PACIENTE_cod] || {};
                            return `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${pedido.id}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(pedido.fecha).toLocaleDateString()}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${pedido.detallePedido?.cantidad || 'No especificada'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${medicamentosMap[pedido.detallePedido?.MEDICAMENTO_id]?.codigo || 'No disponible'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${medicamentosMap[pedido.detallePedido?.MEDICAMENTO_id]?.descripcion || 'No disponible'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${relacion.pacienteNombre || 'No disponible'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${relacion.doctorNombre ? `${relacion.doctorNombre} (${relacion.doctorInstituto})` : 'No disponible'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${localStorage.getItem(`pedido_${pedido.id}`) || (pedido.entregado ? 'Entregado' : 'No entregado')}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div style="margin-top: 20px; font-size: 14px;">
                    <p>Cantidad de pedidos: ${pedidos.length}</p>
                    <p style="font-size: 18px; font-weight: bold;">Total de cantidades: ${totalCantidad}</p>
                    <p>Generado el: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        document.body.appendChild(elementoTemporal);

        const canvas = await html2canvas(elementoTemporal, {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Agregar pie de página
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        pdf.text(`Reporte generado para: ${nombrePaciente}`, 10, pdf.internal.pageSize.getHeight() - 10);
        pdf.text(`Fecha de generación: ${new Date().toLocaleString()}`, pdfWidth - 70, pdf.internal.pageSize.getHeight() - 10);

        pdf.save(`Pedidos_${nombrePaciente}_${new Date(fecha).toLocaleDateString().replace(/\//g, '-')}.pdf`);

        document.body.removeChild(elementoTemporal);
    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
}

// Import pdf-lib if working in a Node.js environment
// const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

document.getElementById("generate-pdf-btn").addEventListener("click", generatePDF);

async function generatePDF() {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // Tamaño A4 en modo horizontal
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSizeTitle = 18;
    const fontSizeText = 12;
    const { width, height } = page.getSize();
    
    // Definir márgenes y espaciados
    const margin = {
        left: 50,
        right: 50,
        top: 80
    };
    const columnSpacing = {
        codigo: margin.left,
        medicamento: margin.left + 120,
        cantidad: margin.left + 350,
        estado: margin.left + 450
    };
    
    let yPosition = height - margin.top;

    // Título
    page.drawText("Detalle de Pedido", {
        x: width / 2 - 60,
        y: yPosition,
        size: fontSizeTitle,
        font,
        color: rgb(0, 0, 0)
    });
    yPosition -= 40;

    // Obtener datos de la tabla
    const rows = document.querySelectorAll("#tablaPedidos tbody tr");
    if (rows.length === 0) {
        alert("No hay datos para generar el PDF.");
        return;
    }

    // Función para manejar texto largo
    const drawWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        words.forEach(word => {
            const testLine = line + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, fontSizeText);
            
            if (testWidth > maxWidth && line !== '') {
                page.drawText(line, { x, y: currentY, size: fontSizeText, font });
                line = word + ' ';
                currentY -= lineHeight;
            } else {
                line = testLine;
            }
        });
        
        if (line.trim() !== '') {
            page.drawText(line, { x, y: currentY, size: fontSizeText, font });
        }
        
        return y - currentY; // Retorna el espacio usado
    };

    rows.forEach((row) => {
        // Verificar si hay espacio suficiente para un nuevo pedido
        if (yPosition < 150) {
            page = pdfDoc.addPage([842, 595]);
            yPosition = height - margin.top;
        }

        const cells = row.querySelectorAll("td");
        
        // Mapeo correcto de los datos según la estructura de la tabla
        const noPedido = cells[0].textContent;
        const fecha = cells[1].textContent;
        const nombrePaciente = cells[2].textContent;
        const cantidad = cells[3].textContent;
        const codigoMedicamento = cells[4].textContent;
        const medicamento = cells[5].textContent;
        const direccion = cells[6].textContent;
        const referencia = cells[7].textContent;
        const telefono = cells[8].textContent;
        const email = cells[9].textContent;
        const nit = cells[12].textContent;
        const nombreFactura = cells[13].textContent;
        const estado = cells[14].textContent;

        // Información general del pedido
        yPosition -= 30;
        page.drawText(`No Pedido: ${noPedido}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;
        
        page.drawText(`Fecha: ${fecha}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Paciente: ${nombrePaciente}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        page.drawText(`NIT: ${nit}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Nombre Factura: ${nombreFactura}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        // Información de contacto
        page.drawText(`Teléfono: ${telefono}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Email: ${email}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;
        
        // Dirección y referencia
        const direccionCompleta = `Dirección: ${direccion}${referencia ? ` (Ref: ${referencia})` : ''}`;
        const direccionUsedSpace = drawWrappedText(
            direccionCompleta,
            margin.left,
            yPosition,
            width - margin.left - margin.right,
            20
        );
        yPosition -= direccionUsedSpace + 30;

        // Encabezado de detalles
        page.drawText("Detalles del Medicamento:", { 
            x: margin.left, 
            y: yPosition, 
            size: fontSizeText, 
            font,
            color: rgb(0.2, 0.2, 0.8)
        });
        yPosition -= 25;

        // Encabezados de la tabla
        page.drawText("Código", { x: columnSpacing.codigo, y: yPosition, size: fontSizeText, font });
        page.drawText("Medicamento", { x: columnSpacing.medicamento, y: yPosition, size: fontSizeText, font });
        page.drawText("Cantidad", { x: columnSpacing.cantidad, y: yPosition, size: fontSizeText, font });
        page.drawText("Estado", { x: columnSpacing.estado, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        // Datos del medicamento
        page.drawText(codigoMedicamento, { x: columnSpacing.codigo, y: yPosition, size: fontSizeText, font });
        
        const medicamentoUsedSpace = drawWrappedText(
            medicamento,
            columnSpacing.medicamento,
            yPosition,
            columnSpacing.cantidad - columnSpacing.medicamento - 20,
            20
        );
        
        page.drawText(cantidad, { x: columnSpacing.cantidad, y: yPosition, size: fontSizeText, font });
        page.drawText(estado, { x: columnSpacing.estado, y: yPosition, size: fontSizeText, font });

        yPosition -= Math.max(medicamentoUsedSpace + 40, 60);
    });

    // Guardar y descargar el PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Detalle_Pedido.pdf";
    link.click();
}