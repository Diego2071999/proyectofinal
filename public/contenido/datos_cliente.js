document.addEventListener('DOMContentLoaded', function () {
    const inputNIT = document.getElementById('inputNIT');
    const nomfacInput = document.getElementById('inputNombreFactura');
    const form = document.getElementById('facturaForm');
    let facturaId = null; // Nueva variable para almacenar el ID de la factura

    // Función para agregar sección de medicamento
    window.addMedicationSection = function () {
        const container = document.getElementById('medicationSections');
        const sectionIndex = container.children.length + 1;

        const section = document.createElement('div');
        section.className = 'medication-section';

        section.innerHTML = `
            <div class="medication-header">
                <h3>Medicamento ${sectionIndex}</h3>
                <button type="button" class="remove-medication" onclick="removeMedicationSection(this)">
                    Eliminar
                </button>
            </div>
            
            <select id="dropdown_${sectionIndex}" class="form-control">
                <option value="">Selecciona un Medicamento</option>
            </select>

            <div class="form-group">
                <label for="inputCantidad_${sectionIndex}">Cantidad:</label>
                <input type="number" id="inputCantidad_${sectionIndex}" placeholder="Ingrese la cantidad" required>
            </div>

            <div class="form-group">
                <label for="inputDosisDiaria_${sectionIndex}">Dosis Diaria:</label>
                <input type="number" id="inputDosisDiaria_${sectionIndex}" placeholder="Ingrese la dosis diaria de consumo" required>
            </div>

            <div class="form-group">
                <label for="inputTiempo_${sectionIndex}">Tiempo:</label>
                <input type="number" id="inputTiempo_${sectionIndex}" placeholder="Ingrese el tiempo de tratamiento en dias" required>
            </div>
        `;

        container.appendChild(section);
        populateMedicineDropdown(sectionIndex);
    };

    // Función para remover sección de medicamento
    window.removeMedicationSection = function (button) {
        const section = button.closest('.medication-section');
        section.remove();

        // Renumerar las secciones restantes
        const sections = document.querySelectorAll('.medication-section');
        sections.forEach((section, index) => {
            section.querySelector('h3').textContent = `Medicamento ${index + 1}`;
        });
    };

    // Función para poblar el dropdown de medicamentos
    async function populateMedicineDropdown(sectionIndex) {
        try {
            const response = await fetch('http://localhost:4000/med/medi');
            const medicines = await response.json();

            const select = document.getElementById(`dropdown_${sectionIndex}`);
            select.innerHTML = '<option value="">Selecciona un Medicamento</option>';

            medicines.forEach(medicine => {
                const option = document.createElement('option');
                option.value = medicine.id;
                option.textContent = medicine.descripcion;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading medicines:', error);
        }
    }

    // Modificar solo el evento input del NIT para guardar el ID de la factura
    inputNIT.addEventListener('input', async () => {
        const nit = inputNIT.value.trim();
        if (nit) {
            try {
                const response = await fetch(`http://localhost:4000/datos/fac/nit/${nit}`);
                if (response.ok) {
                    const factura = await response.json();
                    nomfacInput.value = factura.nomfac;
                    facturaId = factura.id; // Guardar el ID de la factura
                } else {
                    nomfacInput.value = '';
                    facturaId = null;
                }
            } catch (error) {
                console.error('Error al obtener la factura:', error);
                nomfacInput.value = '';
                facturaId = null;
            }
        } else {
            nomfacInput.value = '';
            facturaId = null;
        }
    });

    // Cargar doctores y medicamentos iniciales
    const fetchDoctorsAndMedicines = async () => {
        try {
            const [doctors, medicines] = await Promise.all([
                fetch('http://localhost:4000/datos/doc').then(res => res.json()),
                fetch('http://localhost:4000/med/medi').then(res => res.json()),
            ]);

            const doctorSelect = document.getElementById('dropdownDoc');
            doctorSelect.innerHTML = '<option value="">Selecciona al Doctor</option>';

            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.nombre;
                doctorSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading doctors and medicines:', error);
        }
    };

    fetchDoctorsAndMedicines();

    // Manejo del envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Verificar si hay al menos una sección de medicamento
        const medicationSections = document.querySelectorAll('.medication-section');
        if (medicationSections.length === 0) {
            alert('Por favor, agregue al menos un medicamento');
            return;
        }

        const nit = inputNIT.value.trim();
        const pacienteData = {
            nomfac: nomfacInput.value,
            direccion: document.getElementById('inputDireccionEntrega').value,
            referencia: document.getElementById('inputReferencia').value,
            telefono: document.getElementById('inputTelefono').value,
            telefono2: document.getElementById('inputTelefono2').value,
            email: document.getElementById('inputEmail').value,
            nombre: document.getElementById('inputNombrePaciente').value,
            apellido: document.getElementById('inputApellidoPaciente').value,
            edad: document.getElementById('inputEdad').value,
            nombre_encargado: document.getElementById('inputNombreEncargado').value,
            Factura: {
                nit: nit,
                nomfac: nomfacInput.value
            }
        };

        const doctorId = document.getElementById('dropdownDoc').value;

        if (!doctorId) {
            alert('Por favor, seleccione un doctor');
            return;
        }

        try {
            // Crear nuevo paciente
            const crearPacienteResponse = await fetch('http://localhost:4000/datos/paci', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pacienteData)
            });

            if (!crearPacienteResponse.ok) {
                const errorText = await crearPacienteResponse.text();
                throw new Error(`Error al crear paciente: ${errorText}`);
            }
            const paciente = await crearPacienteResponse.json();

            // Crear relación Doctor-Paciente
            const doctorPacienteResponse = await fetch('http://localhost:4000/datos/docpaci', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    PACIENTE_cod: paciente.id,
                    DOCTOR_id: doctorId
                })
            });

            if (!doctorPacienteResponse.ok) {
                const errorText = await doctorPacienteResponse.text();
                throw new Error(`Error al crear relación doctor-paciente: ${errorText}`);
            }

            // Procesar cada sección de medicamento
            for (const section of medicationSections) {
                const sectionIndex = Array.from(section.parentElement.children).indexOf(section) + 1;
                const medicineId = document.getElementById(`dropdown_${sectionIndex}`).value;
                const cantidad = document.getElementById(`inputCantidad_${sectionIndex}`).value;
                const dosisDiaria = document.getElementById(`inputDosisDiaria_${sectionIndex}`).value;
                const tiempo = document.getElementById(`inputTiempo_${sectionIndex}`).value;

                if (!medicineId || !cantidad || !dosisDiaria || !tiempo) {
                    throw new Error(`Por favor, complete todos los campos para el Medicamento ${sectionIndex}`);
                }

                // Calcular duración del tratamiento
                const diasPorCantidad = Math.ceil(cantidad / dosisDiaria);
                const diasTotales = diasPorCantidad + tiempo;

                // Calcular fechas
                const fechaInicio = new Date();
                const fechaFin = new Date(fechaInicio);
                fechaFin.setDate(fechaInicio.getDate() + diasTotales);

                // Crear detalle de receta
                const detalleRecetaResponse = await fetch('http://localhost:4000/datos/receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        dosis_diaria: dosisDiaria,
                        tiempo_consumo: tiempo,
                        fecha_inicio: fechaInicio.toISOString().split('T')[0],
                        fecha_fin: fechaFin.toISOString().split('T')[0]
                    })
                });

                if (!detalleRecetaResponse.ok) {
                    throw new Error('Error al crear detalle de receta');
                }
                const detalleReceta = await detalleRecetaResponse.json();

                // Crear receta
                const recetaResponse = await fetch('http://localhost:4000/datos/recetas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        DETALLE_RECETA_id: detalleReceta.id,
                        MEDICAMENTO_id: medicineId,
                        PACIENTE_cod: paciente.id,
                        DOCTOR_id: doctorId // Agregar el ID del doctor
                    })
                });

                if (!recetaResponse.ok) {
                    throw new Error('Error al crear receta');
                }
                const receta = await recetaResponse.json();

                // Crear detalle de pedido
                const detallePedidoResponse = await fetch('http://localhost:4000/datos/detalle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cantidad: cantidad,
                        MEDICAMENTO_id: medicineId
                    })
                });

                if (!detallePedidoResponse.ok) {
                    throw new Error('Error al crear detalle de pedido');
                }
                const detallePedido = await detallePedidoResponse.json();

                // Crear pedido
                const pedidoResponse = await fetch('http://localhost:4000/datos/pedido', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fecha: new Date().toISOString().split('T')[0],
                        DETALLE_PEDIDO_id: detallePedido.id,
                        RECETA_id: receta.id,
                        FACTURA_id: facturaId // Agregar el ID de la factura
                    })
                });

                if (!pedidoResponse.ok) {
                    throw new Error('Error al crear pedido');
                }
            }

            // Éxito - resetear formulario y redirigir
            form.reset();
            alert('Factura creada correctamente');
            window.location.href = 'inicio.html';
        } catch (error) {
            console.error('Error al crear la factura:', error);
            alert('Ocurrió un error al crear la factura: ' + error.message);
        }
    });
});