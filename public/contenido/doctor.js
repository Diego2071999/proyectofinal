$(document).ready(function() {   
    var url = 'http://localhost:4000/datos/doc';
    
    var table = $('#DocTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {"data": "nombre"},
            {"data": "instituto"},
            {"data": "sede"},
            {"data": "email"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="update-btn" onclick="abrirUpdateDoctorModal(${data.id})">Actualizar</button>
                        <button class="delete-btn" onclick="abrirDeleteDoctortModal(${data.id})">Eliminar</button>
                    `;
                }
            }
        ],
       // "paging": false,           // Eliminar paginación
       // "info": false              // Ocultar la información de "Mostrando X de Y entradas"
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });

    // Evento para el formulario de nuevo producto
    document.getElementById('newDoctorForm').addEventListener('submit', function(event) {
        event.preventDefault();
        crearNuevoDoctor();
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
// Crear nuevo doctor
function crearNuevoDoctor() {
    
    const nombre = document.getElementById('inputNombre').value; // Cambiado a inputNombre
    const instituto = document.getElementById('inputInstituto').value; // Cambiado a inputInstituto
    const sede = document.getElementById('inputSede').value; // Cambiado a inputSede
    const email = document.getElementById('inputEmail').value; // Cambiado a inputEmail

    const data = {
        nombre: nombre,
        instituto: instituto,
        sede: sede,
        email: email
    };

    fetch('http://localhost:4000/datos/doc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al crear el doctor');
    })
    .then(data => {
        cerrarModalDoctor();
        $('#DocTable').DataTable().ajax.reload(); // Recargar la tabla
    })
    .catch(error => {
        console.error('Error al crear el doctor:', error);
        alert('Error al crear el doctor');
    });
}

//eliminar
function eliminarDoctor(id) {
    $.ajax({
        url: `http://localhost:4000/datos/doc/${id}`, // Endpoint ajustado para eliminar el producto
        type: 'DELETE',
        success: function(response) {
            console.log("Doctor eliminado y registro actualizado correctamente");
            cerrarDeleteProductModal();
            $('#DocTable').DataTable().ajax.reload(); // Actualizar la tabla de productos
        },
        error: function(xhr, status, error) {
            console.error("Error al eliminar Doctor y actualizar registro:", error);
            alert('Error al eliminar Doctor y actualizar registro. Por favor, inténtalo de nuevo.');
        }
    });
}

//actualizar
// Función para abrir el modal y cargar los datos del producto para actualizar
function abrirUpdateDoctorModal(docId) {
    fetch(`http://localhost:4000/datos/doc/${docId}`) // Cambiar a la ruta correcta del API
        .then(response => response.json())
        .then(data => {
            // Llenar los campos del formulario con los datos del producto
            document.getElementById('update-doctor-id').value = data.id;
            document.getElementById('update-nombre').value = data.nombre;
            document.getElementById('update-instituto').value = data.instituto;
            document.getElementById('update-sede').value = data.sede;
            document.getElementById('update-email').value = data.email;

            // Mostrar el modal
            document.getElementById("updateDoctorModal").style.display = "block";
        })
        .catch(error => {
            console.error('Error al obtener los datos del Doctor:', error);
        });
}

// Función para manejar la actualización del producto
document.getElementById('updateDoctorForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const docId = document.getElementById('update-doctor-id').value;
    const updatedDoctorData = {
        nombre: document.getElementById('update-nombre').value,
        instituto: document.getElementById('update-instituto').value,
        sede: document.getElementById('update-sede').value,
        email: document.getElementById('update-email').value
    };

    try {
        const response = await fetch(`http://localhost:4000/datos/doc/${docId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDoctorData)
        });

        if (response.ok) {
            alert('¡Doctor actualizado correctamente!');
            cerrarUpdateDoctorModal(); // Cerrar el modal después de actualizar
            // Recargar la tabla de productos
            $('#DocTable').DataTable().ajax.reload(); // Si usas DataTables para actualizar la tabla
        } else {
            throw new Error('Error al actualizar el Doctor');
        }
    } catch (error) {
        console.error('Error al actualizar el Doctor:', error);
        alert('Ocurrió un error al actualizar el Doctor.');
    }
});