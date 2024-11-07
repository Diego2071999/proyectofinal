$(document).ready(function() {   
    var url = 'http://localhost:4000/med/medi';
    
    var table = $('#productTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log(data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {"data": "codigo"},
            {"data": "nombre"},
            {"data": "contenido"},
            {"data": "presentacion"},
            {"data": "descripcion"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="update-btn" onclick="abrirUpdateProductModal(${data.id})">Actualizar</button>
                        <button class="delete-btn" onclick="abrirDeleteProductModal(${data.id})">Eliminar</button>
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
    document.getElementById('newProductForm').addEventListener('submit', function(event) {
        event.preventDefault();
        crearNuevoProducto();
    });
});

function ordenarPor(criterio) {
    var table = $('#productTable').DataTable();
    var columnIndex = {
        'codigo': 0,
        'nombre': 1,
        'contenido': 2,
        'presentacion': 3
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}
// Crear nuevo producto
function crearNuevoProducto() {
    
    const codigo = document.getElementById('inputCodigo').value;
    const nombre = document.getElementById('inputNombre').value;
    const contenido = document.getElementById('inputContenido').value;
    const presentacion = document.getElementById('inputPresentacion').value;
    const descripcion = document.getElementById('inputDescripcion').value;

    const data = {
        codigo: codigo,
        nombre: nombre,
        contenido: contenido,
        presentacion: presentacion,
        descripcion: descripcion
    };

    fetch('http://localhost:4000/med/medi', {
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
        throw new Error('Error al crear el producto');
    })
    .then(data => {
        cerrarModalProducto();
        $('#productTable').DataTable().ajax.reload(); // Recargar la tabla
    })
    .catch(error => {
        console.error('Error al crear el producto:', error);
        alert('Error al crear el producto');
    });
}

//eliminar
function eliminarProducto(id) {
    $.ajax({
        url: `http://localhost:4000/med/medi/${id}`, // Endpoint ajustado para eliminar el producto
        type: 'DELETE',
        success: function(response) {
            console.log("Producto eliminado y registro actualizado correctamente");
            cerrarDeleteProductModal();
            $('#productTable').DataTable().ajax.reload(); // Actualizar la tabla de productos
        },
        error: function(xhr, status, error) {
            console.error("Error al eliminar producto y actualizar registro:", error);
            alert('Error al eliminar producto y actualizar registro. Por favor, inténtalo de nuevo.');
        }
    });
}

//actualizar
// Función para abrir el modal y cargar los datos del producto para actualizar
function abrirUpdateProductModal(productId) {
    fetch(`http://localhost:4000/med/medi/${productId}`) // Cambiar a la ruta correcta del API
        .then(response => response.json())
        .then(data => {
            // Llenar los campos del formulario con los datos del producto
            document.getElementById('update-product-id').value = data.id;
            document.getElementById('update-codigo').value = data.codigo;
            document.getElementById('update-nombre').value = data.nombre;
            document.getElementById('update-contenido').value = data.contenido;
            document.getElementById('update-presentacion').value = data.presentacion;
            document.getElementById('update-descripcion').value = data.descripcion;

            // Mostrar el modal
            document.getElementById("updateProductModal").style.display = "block";
        })
        .catch(error => {
            console.error('Error al obtener los datos del producto:', error);
        });
}

// Función para manejar la actualización del producto
document.getElementById('updateProductForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const productId = document.getElementById('update-product-id').value;
    const updatedProductData = {
        nombre: document.getElementById('update-nombre').value,
        contenido: document.getElementById('update-contenido').value,
        presentacion: document.getElementById('update-presentacion').value,
        descripcion: document.getElementById('update-descripcion').value
    };

    try {
        const response = await fetch(`http://localhost:4000/med/medi/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProductData)
        });

        if (response.ok) {
            alert('¡Producto actualizado correctamente!');
            cerrarUpdateProductModal(); // Cerrar el modal después de actualizar
            // Recargar la tabla de productos
            $('#productTable').DataTable().ajax.reload(); // Si usas DataTables para actualizar la tabla
        } else {
            throw new Error('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Ocurrió un error al actualizar el producto.');
    }
});