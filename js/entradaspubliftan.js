function toggleInfo() {
  const info = document.getElementById('info');
  info.style.display = info.style.display === 'block' ? 'none' : 'block';
}

function togglePrivacidad() {
  const texto = document.getElementById('privacidad-texto');
  texto.style.display = texto.style.display === 'block' ? 'none' : 'block';
}

function mostrarDetalles(tipo) {
  document.getElementById('detalles-gratis').style.display = 'none';
  document.getElementById('detalles-asiento').style.display = 'none';

  if (tipo === 'gratis') {
    document.getElementById('detalles-gratis').style.display = 'block';
  } else if (tipo === 'asiento') {
    document.getElementById('detalles-asiento').style.display = 'block';
  }
}

// Rellenar selects de día, mes y año para el usuario
const diaSelect = document.getElementById('dia');
const mesSelect = document.getElementById('mes');
const anioSelect = document.getElementById('anio');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const anioActual = new Date().getFullYear();

for (let d = 1; d <= 31; d++) {
  diaSelect.innerHTML += `<option value="${d}">${d}</option>`;
}
meses.forEach((mes, i) => {
  mesSelect.innerHTML += `<option value="${i + 1}">${mes}</option>`;
});
for (let y = anioActual; y >= 1920; y--) {
  anioSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

// Rellenar selects de día, mes y año para tutor legal
const tutorDiaSelect = document.getElementById('tutor-dia');
const tutorMesSelect = document.getElementById('tutor-mes');
const tutorAnioSelect = document.getElementById('tutor-anio');

for (let d = 1; d <= 31; d++) {
  tutorDiaSelect.innerHTML += `<option value="${d}">${d}</option>`;
}
meses.forEach((mes, i) => {
  tutorMesSelect.innerHTML += `<option value="${i + 1}">${mes}</option>`;
});
for (let y = anioActual; y >= 1920; y--) {
  tutorAnioSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

// Envío del formulario
document.getElementById('inscripcionForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const dia = document.getElementById('dia').value;
  const mes = document.getElementById('mes').value;
  const anio = document.getElementById('anio').value;
  const email = document.getElementById('email').value.trim();
  const provincia = document.getElementById('provincia').value.trim();
  const privacidad = document.getElementById('privacidad').checked;
  const tipoEntradaSeleccionada = document.querySelector('input[name="tipoEntrada"]:checked');
  const tutorSection = document.getElementById('tutor-legal');

  const dniRegex = /^[XYZ]?\d{7,8}[A-Z]$/i;

  if (!nombre || !apellidos || !dni || !dia || !mes || !anio || !email || !provincia) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (!dniRegex.test(dni)) {
    alert("Introduce un DNI o NIE válido.");
    return;
  }

  if (!privacidad) {
    alert("Debes aceptar la política de privacidad.");
    return;
  }

  if (!tipoEntradaSeleccionada) {
    alert("Debes seleccionar un tipo de entrada.");
    return;
  }

  // Calcular edad
  const fechaNacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  if (
    hoy.getMonth() < fechaNacimiento.getMonth() ||
    (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    edad--;
  }

  // Si es menor y aún no se completó tutor legal, mostrar y detener envío
  if (edad < 18 && tutorSection.classList.contains('hidden')) {
    tutorSection.classList.remove('hidden');
    alert("Eres menor de edad. Por favor, completa los datos del tutor legal.");
    return;
  }

  // Preparar y enviar formulario
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("apellidos", apellidos);
  formData.append("dni", dni);
  formData.append("dia", dia);
  formData.append("mes", mes);
  formData.append("anio", anio);
  formData.append("email", email);
  formData.append("provincia", provincia);
  formData.append("tipoEntrada", tipoEntradaSeleccionada.value);

  if (edad < 18) {
    const tutorNombre = document.getElementById('tutor-nombre').value.trim();
    const tutorApellidos = document.getElementById('tutor-apellidos').value.trim();
    const tutorDni = document.getElementById('tutor-dni').value.trim();
    const tutorEmail = document.getElementById('tutor-email').value.trim();
    const tutorDia = document.getElementById('tutor-dia').value;
    const tutorMes = document.getElementById('tutor-mes').value;
    const tutorAnio = document.getElementById('tutor-anio').value;

    if (!tutorNombre || !tutorApellidos || !tutorDni || !tutorEmail || !tutorDia || !tutorMes || !tutorAnio) {
      alert("Por favor, completa todos los datos del tutor legal.");
      return;
    }

    if (!dniRegex.test(tutorDni)) {
      alert("El DNI del tutor no es válido.");
      return;
    }

    formData.append("tutor-nombre", tutorNombre);
    formData.append("tutor-apellidos", tutorApellidos);
    formData.append("tutor-dni", tutorDni);
    formData.append("tutor-email", tutorEmail);
    formData.append("tutor-dia", tutorDia);
    formData.append("tutor-mes", tutorMes);
    formData.append("tutor-anio", tutorAnio);
  }

  const spinner = document.getElementById('loadingSpinner');
  spinner.classList.remove('hidden'); // Mostrar spinner

const scriptURL = "https://script.google.com/macros/s/AKfycbzITblI7cpko2v49xpUsY8XSGn_ZHoOhs_8sU0l7iJWGXHiu_JQGbD4gBYfI_MjtaLG/exec";

fetch(scriptURL, { method: "POST", body: formData })
  .then(response => {
    spinner.classList.add('hidden'); // ocultar spinner
    if (response.ok) {
      alert("Inscripción enviada con éxito.");
      document.getElementById("inscripcionForm").reset();
      document.getElementById("detalles-gratis").style.display = 'none';
      document.getElementById("detalles-asiento").style.display = 'none';
      tutorSection.classList.add('hidden');

      // Redirigir a Stripe si es con asiento
      if (tipoEntradaSeleccionada.value === "asiento") {
        window.location.href = "https://buy.stripe.com/7sY7sL51F6MXgRbcPxcjS00";
      }
    } else {
      alert("Error al enviar. Intenta nuevamente.");
    }
  })
  .catch(error => {
    spinner.classList.add('hidden'); // ocultar spinner
    console.error("Error:", error);
    alert("Hubo un problema al enviar el formulario.");
  });

});

function cerrar() {
  window.location.href = '../index.html';
}

function closeInfoModal() {
  document.getElementById('infoModal').classList.add('hidden');
}
