// Mostrar reloj en tiempo real
function actualizarReloj() {
  const reloj = document.getElementById("reloj");
  const ahora = new Date();
  reloj.textContent = ahora.toLocaleTimeString();
}
setInterval(actualizarReloj, 1000);

// Guardar el registro en localStorage
function guardarRegistro(nombre, tipo, hora, fecha) {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.push({ nombre, tipo, hora, fecha });
  localStorage.setItem("registros", JSON.stringify(registros));
}

// Dar formato a fecha para el filtro (dd/mm/aaaa)
function formatoFecha(fechaInput) {
  const partes = fechaInput.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Cargar los registros a la tabla (solo para admin)
function cargarRegistros() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const filtroNombre = document.getElementById("filtroNombre")?.value.toLowerCase() || "";
  const filtroFecha = document.getElementById("filtroFecha")?.value || "";
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  registros.forEach((r) => {
    const coincideNombre = r.nombre.toLowerCase().includes(filtroNombre);
    const coincideFecha = filtroFecha === "" || r.fecha === formatoFecha(filtroFecha);

    if (coincideNombre && coincideFecha) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${r.nombre}</td>
        <td>${r.tipo}</td>
        <td>${r.hora}</td>
        <td>${r.fecha}</td>
      `;
      tbody.appendChild(fila);
    }
  });
}

// Marcar entrada o salida
function marcarAsistencia(tipo) {
  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) {
    alert("Por favor ingresa un nombre.");
    return;
  }

  const ahora = new Date();
  const hora = ahora.toLocaleTimeString();
  const fecha = ahora.toLocaleDateString();

  guardarRegistro(nombre, tipo, hora, fecha);
  if (esAdmin) cargarRegistros();
  document.getElementById("nombre").value = "";
}

// Descargar los datos como archivo CSV
function descargarCSV() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  if (registros.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  let csv = "Nombre,Tipo,Hora,Fecha\n";
  registros.forEach((r) => {
    csv += `${r.nombre},${r.tipo},${r.hora},${r.fecha}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "asistencias.csv";
  link.click();
}

// Borrar todos los registros (solo admin)
function borrarRegistros() {
  const confirmar = confirm("¿Estás seguro de que deseas borrar todos los registros?");
  if (confirmar) {
    localStorage.removeItem("registros");
    alert("Registros eliminados correctamente.");
    cargarRegistros();
  }
}

// Variable para saber si es administrador
let esAdmin = false;

// Verificar si el rol es "administrador" o "usuario"
function verificarRol() {
  const rol = document.getElementById("rol").value.trim().toLowerCase();
  const acceso = document.getElementById("acceso");
  const contenido = document.getElementById("contenido");

  if (rol === "administrador") {
    esAdmin = true;
    document.querySelector(".admin-only").style.display = "block";
    cargarRegistros();
  } else {
    esAdmin = false;
  }

  // Mostrar contenido principal y ocultar acceso
  acceso.style.display = "none";
  contenido.style.display = "block";
}

// Al cargar la página, mostrar acceso después de bienvenida
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("bienvenida").style.display = "none";
    document.getElementById("acceso").style.display = "block";
  }, 3000);

  // Activar filtros en modo administrador
  const filtros = document.getElementById("filtroNombre");
  if (filtros) {
    filtros.addEventListener("input", cargarRegistros);
    document.getElementById("filtroFecha").addEventListener("input", cargarRegistros);
  }
});