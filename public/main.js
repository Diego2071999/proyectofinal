document.getElementById('getDataBtn').addEventListener('click', () => {
    // Hacer una solicitud GET al backend
    fetch('http://localhost:4000')
        .then(response => response.json())
        .then(data => {
            document.getElementById('responseGet').innerText = data.message;  // Asegúrate de que 'message' esté en la respuesta
        })
        .catch(error => console.error('Error al obtener datos:', error));
});

/*
document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;

    // Hacer una solicitud POST al backend
    fetch('http://localhost:4000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responsePost').innerText = `Respuesta: ${data.message}, Datos: ${data.data.name}`;
    })
    .catch(error => console.error('Error al enviar datos:', error));
});*/
