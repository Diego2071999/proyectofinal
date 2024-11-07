function login() {
    const usuario = document.querySelector('input[name="usuario"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch('http://localhost:4000/user/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(users => {
        const user = users.find(user => user.nombre_usuario === usuario && user.password === password);
        if (user) {
            // Usuario autenticado, redirigir a otra página
            window.location.href = 'inicio.html';
        } else {
            // Mostrar mensaje de error en la página
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        // Manejar el error en caso de que la solicitud falle
    });
}