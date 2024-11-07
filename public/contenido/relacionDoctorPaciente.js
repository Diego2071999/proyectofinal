$(document).ready(function() {   
    var url = 'http://localhost:4000/datos/docpaci';
    
    var table = $('#DocTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {"data": "Doctor.nombre"},   // Accediendo al nombre del Doctor
            {"data": "Doctor.instituto"}, // Accediendo al instituto del Doctor
            {"data": "Doctor.sede"},      // Accediendo a la sede del Doctor
            {"data": "Doctor.email"},     // Accediendo al email del Doctor
            {
                "data": null,
                "render": function(data, type, row) {
                    return `${row.Paciente.nombre} ${row.Paciente.apellido}`;
                }
            },   // Accediendo al nombre del Paciente
        ],
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });
});

function ordenarPor(criterio) {
    var table = $('#DocTable').DataTable();
    var columnIndex = {
        'nombre': 0,
        'instituto': 1,
        'sede': 2,
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}

function downloadExcel() {
    // Obtén los datos de la tabla
    var tableData = [];
    var table = $('#DocTable').DataTable();

    // Agregar encabezados
    tableData.push([
        'Nombre Doctor', 
        'Instituto', 
        'Sede', 
        'Email', 
        'Nombre Paciente'
    ]);

    // Agregar datos de las filas
    table.rows().every(function(rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        tableData.push([
            data.Doctor.nombre,
            data.Doctor.instituto,
            data.Doctor.sede,
            data.Doctor.email,
            `${data.Paciente.nombre} ${data.Paciente.apellido}`
        ]);
    });

    // Crea un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(tableData);
    XLSX.utils.book_append_sheet(wb, ws, 'Doctores y Pacientes');

    // Generar y descargar el archivo
    XLSX.writeFile(wb, 'doctores_y_pacientes.xlsx');
}
