let usuarioId = null;

$(document).ready(function() {   
    var url = 'http://localhost:4000/user/roles';

    $('#userTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            {"data": "Nombre"},
            {"data": "lastname"},
            {"data": "rol.Rol"},
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="view-btn" onclick="abrirModalver(${data.id})">Ver</button>
                        <button class="update-btn" onclick="abrirUpdatemodal(${data.id})">Actualizar</button>
                        <button class="delete-btn" onclick="abrirDeleteUserModal(${data.id})">Eliminar</button>
                    `;
                }
            }
        ],
        "paging": false,           // Eliminar paginación
        "info": false             // Ocultar la información de "Mostrando X de Y entradas"
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });
});

function ordenarPor(criterio) {
    var table = $('#userTable').DataTable();
    var columnIndex = {
        'nombre': 0,
        'apellido': 1,
        'rol': 2
    }[criterio];
    table.order([columnIndex, 'asc']).draw();
}



function validateFrorm(){
    let name = document.getElementById('inputname').value;
    let lastname = document.getElementById('inputlastname').value;
    let email = document.getElementById('inputemail').value;
    let tel = document.getElementById('inputtel').value;
    let rol = document.getElementById('inputrol').value;
    let password = document.getElementById('inputpassword').value;
    let username = document.getElementById('inputusername').value;

    if (name ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (lastname ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (email ==  "") {
        alert("El campo esta vacío");
        return false;
    }else if(!email.includes('@')){
        alert("El correo no es valido");
        return false;
    }
    if (tel ==  "") {
        alert("El campo esta vacío");
        return false;
    }if (rol ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (password ==  "") {
        alert("El campo esta vacío");
        return false;
    }
    if (username ==  "") {
        alert("El campo esta vacío");
        return false;
    }

    return true;
}

// Al cargar el DOM, agregar el evento al formulario
document.getElementById('newUserForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
    crearNuevoUsuario(); // Llamar a la función para crear el nuevo usuario
});

// Función para enviar los datos del nuevo usuario al backend
function crearNuevoUsuario() {
    if (!validateFrorm()) {
        return; // Validación fallida, no se envía la solicitud
    }

    const nombre = document.getElementById('inputname').value;
    const apellido = document.getElementById('inputlastname').value;
    const correo = document.getElementById('inputemail').value;
    const telefono = document.getElementById('inputtel').value;
    const rol = document.getElementById('inputrol').value;
    const password = document.getElementById('inputpassword').value;
    const username = document.getElementById('inputusername').value;

    const data = {
        Nombre: nombre,
        lastname: apellido,
        Correo: correo,
        telefono: telefono,
        idrol: { Rol: rol }, // Enviar el rol como objeto con la propiedad Rol
        password: password,
        nombre_usuario: username
    };

    fetch('http://localhost:4000/user/roles', {
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
        throw new Error('Error al crear usuario y rol');
    })
    .then(data => {
        console.log(data);
        cerrarNuevoUsuarioModal(); // Cerrar el modal después de crear el usuario
        refrescarTablaUsuarios();
    })
    .catch(error => {
        console.error('Error al crear usuario y rol:', error);
        alert('Error al crear usuario y rol');
    });
    
}

function eliminarUsuarioYActualizarRegistro(id) {
    $.ajax({
        url: `http://localhost:4000/user/user/${id}`, // Nueva dirección para eliminar el usuario
        type: 'DELETE',
        success: function(response) {
            console.log("Usuario eliminado y registro actualizado correctamente");
            cerrarDeleteUserModal();
            $('#userTable').DataTable().ajax.reload(); // Actualizar la tabla de usuarios
        },
        error: function(xhr, status, error) {
            console.error("Error al eliminar usuario y actualizar registro:", error);
            alert('Error al eliminar usuario y actualizar registro. Por favor, inténtalo de nuevo.');
        }
    });
}


function refrescarTablaUsuarios() {
    var table = $('#userTable').DataTable();
    table.ajax.reload(); // Recargar los datos en la tabla
}

//ver usuario
// Función para obtener los datos del usuario desde el backend
async function obtenerUsuarioConRoles(userId) { // Recibir el userId
    try {
        const response = await fetch(`http://localhost:4000/user/roles/${userId}`);
        const data = await response.json();

        // Llenar los campos del modal con los datos del usuario
        document.getElementById('modal-nombre').textContent = data[0].Nombre;
        document.getElementById('modal-apellido').textContent = data[0].lastname;
        document.getElementById('modal-correo').textContent = data[0].Correo;
        document.getElementById('modal-telefono').textContent = data[0].telefono;
        document.getElementById('modal-username').textContent = data[0].nombre_usuario;
        document.getElementById('modal-rol').textContent = data[0].rol.Rol;

        // Mostrar el modal
        document.getElementById("userModal").style.display = "block";
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
}

//actualizar datos
// Función para abrir el modal y cargar los datos del usuario para actualizar
function abrirUpdatemodal(userId) {
    fetch(`http://localhost:4000/user/roles/${userId}`)
        .then(response => response.json())
        .then(data => {
            // Llenar los campos del formulario con los datos del usuario
            document.getElementById('update-user-id').value = data[0].id;
            document.getElementById('update-nombre').value = data[0].Nombre;
            document.getElementById('update-apellido').value = data[0].lastname;
            document.getElementById('update-correo').value = data[0].Correo;
            document.getElementById('update-telefono').value = data[0].telefono;
            document.getElementById('update-username').value = data[0].nombre_usuario;
            document.getElementById('update-rol').value = data[0].rol.Rol;
            document.getElementById('update-password').value = data[0].password; // Si es seguro mostrarla

            // Mostrar el modal
            document.getElementById("updateUserModal").style.display = "block";
        })
        .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
        });
}

// Función para manejar la actualización del usuario
document.getElementById('updateUserForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const userId = document.getElementById('update-user-id').value;
    const updatedUserData = {
        Nombre: document.getElementById('update-nombre').value,
        lastname: document.getElementById('update-apellido').value,
        Correo: document.getElementById('update-correo').value,
        telefono: document.getElementById('update-telefono').value,
        nombre_usuario: document.getElementById('update-username').value,
        idrol: { Rol: document.getElementById('update-rol').value },
        password: document.getElementById('update-password').value
    };

    try {
        const response = await fetch(`http://localhost:4000/user/roles/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserData)
        });

        if (response.ok) {
            alert('¡Usuario actualizado correctamente!');
            cerrarUpdateModal(); // Cerrar el modal después de actualizar
            // Recargar la tabla o la página si es necesario
            location.reload(); // Recargar la página para reflejar los cambios
        } else {
            throw new Error('Error al actualizar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al actualizar el usuario.');
    }
});

