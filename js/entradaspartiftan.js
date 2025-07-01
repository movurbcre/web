// Mostrar u ocultar información
function toggleInfo() {
  const info = document.getElementById("info");
  info.style.display = info.style.display === "block" ? "none" : "block";
}

function togglePrivacidad() {
  const texto = document.getElementById("privacidad-texto");
  texto.style.display = texto.style.display === "block" ? "none" : "block";
}

// Rellenar selects de día, mes y año para participante
const diaSelect = document.getElementById("dia");
const mesSelect = document.getElementById("mes");
const anioSelect = document.getElementById("anio");
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
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
const tutorDiaSelect = document.getElementById("tutor-dia");
const tutorMesSelect = document.getElementById("tutor-mes");
const tutorAnioSelect = document.getElementById("tutor-anio");

for (let d = 1; d <= 31; d++) {
  tutorDiaSelect.innerHTML += `<option value="${d}">${d}</option>`;
}
meses.forEach((mes, i) => {
  tutorMesSelect.innerHTML += `<option value="${i + 1}">${mes}</option>`;
});
for (let y = anioActual; y >= 1920; y--) {
  tutorAnioSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

// Función para convertir archivo a Base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Envío del formulario
document.getElementById("inscripcionForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Mostrar spinner
  document.getElementById("loadingSpinner").classList.remove("hidden");

  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const dia = document.getElementById("dia").value;
  const mes = document.getElementById("mes").value;
  const anio = document.getElementById("anio").value;
  const email = document.getElementById("email").value.trim();
  const provincia = document.getElementById("provincia").value.trim();
  const privacidad = document.getElementById("privacidad").checked;

  const dniRegex = /^[XYZ]?\d{7,8}[A-Z]$/i;

  if (!nombre || !apellidos || !dni || !dia || !mes || !anio || !email || !provincia) {
    alert("Por favor, completa todos los campos.");
    document.getElementById("loadingSpinner").classList.add("hidden");
    return;
  }

  if (!dniRegex.test(dni)) {
    alert("Introduce un DNI o NIE válido.");
    document.getElementById("loadingSpinner").classList.add("hidden");
    return;
  }

  if (!privacidad) {
    alert("Debes aceptar la política de privacidad.");
    document.getElementById("loadingSpinner").classList.add("hidden");
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

  const tutorSection = document.getElementById("tutor-legal");

  // Mostrar tutor si menor de edad y detener envío si datos no completados
  if (edad < 18 && tutorSection.classList.contains("hidden")) {
    tutorSection.classList.remove("hidden");
    alert("Eres menor de edad. Por favor, completa los datos del tutor legal.");
    document.getElementById("loadingSpinner").classList.add("hidden");
    return;
  }

  // Capturar el archivo video
  const videoInput = document.getElementById("videoFile");
  const videoFile = videoInput.files[0];

  if (!videoFile) {
    alert("Por favor, selecciona un video.");
    document.getElementById("loadingSpinner").classList.add("hidden");
    return;
  }

  try {
    const base64String = await getBase64(videoFile);
    const base64Data = base64String.split(",")[1];
    const mimeType = base64String.split(";")[0].split(":")[1];

    const extension = videoFile.name.split(".").pop();
    const videoNombrePersonalizado = (nombre + apellidos).replace(/\s+/g, "") + "." + extension;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellidos", apellidos);
    formData.append("dni", dni);
    formData.append("dia", dia);
    formData.append("mes", mes);
    formData.append("anio", anio);
    formData.append("email", email);
    formData.append("provincia", provincia);
    formData.append("privacidad", privacidad);
    formData.append("tipoEntrada", "participante");
    formData.append("videoBase64", base64Data);
    formData.append("videoType", mimeType);
    formData.append("videoNombre", videoNombrePersonalizado);

    if (edad < 18) {
      const tutorNombre = document.getElementById("tutor-nombre").value.trim();
      const tutorApellidos = document.getElementById("tutor-apellidos").value.trim();
      const tutorDni = document.getElementById("tutor-dni").value.trim();
      const tutorEmail = document.getElementById("tutor-email").value.trim();
      const tutorDia = document.getElementById("tutor-dia").value;
      const tutorMes = document.getElementById("tutor-mes").value;
      const tutorAnio = document.getElementById("tutor-anio").value;

      if (!tutorNombre || !tutorApellidos || !tutorDni || !tutorEmail || !tutorDia || !tutorMes || !tutorAnio) {
        alert("Por favor, completa todos los datos del tutor legal.");
        document.getElementById("loadingSpinner").classList.add("hidden");
        return;
      }

      if (!dniRegex.test(tutorDni)) {
        alert("El DNI del tutor no es válido.");
        document.getElementById("loadingSpinner").classList.add("hidden");
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

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzmuHNA0SFWdMMhnxVQ9AgwudDpOkX2jfmTja2sZ4OE5Du_eM61XmdRgCbgKMj0GGqzqQ/exec";

    const response = await fetch(scriptURL, { method: "POST", body: formData });

    if (response.ok) {
      alert("Inscripción enviada con éxito.");
      document.getElementById("inscripcionForm").reset();
      tutorSection.classList.add("hidden");
      document.getElementById("file-name").textContent = "Ningún archivo seleccionado";
    } else {
      alert("Error al enviar. Intenta nuevamente.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al enviar el formulario.");
  } finally {
    // Ocultar spinner cuando termine
    document.getElementById("loadingSpinner").classList.add("hidden");
  }
});

function cerrar() {
  window.location.href = "../index.html";
}

// Ocultar modal informativo
function closeInfoModal() {
  document.getElementById("infoModal").classList.add("hidden");
}

// Validación de archivo video y mostrar nombre del archivo
document.getElementById("videoFile").addEventListener("change", function () {
  const fileNameSpan = document.getElementById("file-name");
  if (this.files && this.files.length > 0) {
    fileNameSpan.textContent = this.files[0].name;
  } else {
    fileNameSpan.textContent = "Ningún archivo seleccionado";
  }
});
