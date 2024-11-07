fetch('http://localhost:4000')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Aquí puedes manejar los datos recibidos del backend
  })
  .catch(error => {
    console.error('Error:', error);
  });