$(document).ready(function() {
    // Recuperar datos del sessionStorage
    const datosPaciente = JSON.parse(sessionStorage.getItem('datosPaciente'));
    
    if (datosPaciente) {
        // Llenar los campos del formulario
        $('#inputNIT').val(datosPaciente.nit);
        $('#inputNombreFactura').val(datosPaciente.nombreFactura);
        $('#inputDireccionEntrega').val(datosPaciente.direccionEntrega);
        $('#inputReferencia').val(datosPaciente.referencia);
        $('#inputTelefono').val(datosPaciente.telefono);
        $('#inputTelefono2').val(datosPaciente.telefono2);
        $('#inputEmail').val(datosPaciente.email);
        $('#inputNombrePaciente').val(datosPaciente.nombrePaciente);
        $('#inputApellidoPaciente').val(datosPaciente.apellidoPaciente);
        $('#inputEdad').val(datosPaciente.edad);
        $('#inputNombreEncargado').val(datosPaciente.nombreEncargado);
        
        // Agregar campo oculto para el ID del paciente
        $('<input>').attr({
            type: 'hidden',
            id: 'pacienteId',
            name: 'pacienteId',
            value: datosPaciente.paciente_id
        }).appendTo('#facturaForm');
    } else {
        // Mostrar mensaje si no hay datos
        $('<div>').addClass('alert alert-warning')
            .text('No se encontraron datos del paciente.')
            .insertBefore('#facturaForm');
    }

    // Manejar el envío del formulario
    $('#facturaForm').on('submit', function(e) {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica para enviar el formulario
        const formData = {
            pacienteId: $('#pacienteId').val(),
            nit: $('#inputNIT').val(),
            nombreFactura: $('#inputNombreFactura').val(),
            direccionEntrega: $('#inputDireccionEntrega').val(),
            referencia: $('#inputReferencia').val(),
            telefono: $('#inputTelefono').val(),
            telefono2: $('#inputTelefono2').val(),
            email: $('#inputEmail').val(),
            nombrePaciente: $('#inputNombrePaciente').val(),
            apellidoPaciente: $('#inputApellidoPaciente').val(),
            edad: $('#inputEdad').val(),
            nombreEncargado: $('#inputNombreEncargado').val(),
            doctorId: $('#dropdownDoc').val(),
            medicamentoId: $('#dropdown').val(),
            cantidad: $('#inputCantidad').val(),
            dosisDiaria: $('#inputDosisDiaria').val(),
            tiempo: $('#inputTiempo').val()
        };

        // Aquí puedes enviar formData a tu servidor
        console.log(formData);
    });
});