const MAX_ALUMNOS = 10;
const alumnos = [];

const form = document.getElementById('studentForm');
const resultsSection = document.getElementById('results');

function showMessage(message, type = 'success') {
  let messageBox = document.querySelector('.form-message');

  if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.className = 'form-message';
    form.appendChild(messageBox);
  }

  messageBox.textContent = message;
  messageBox.classList.remove('error', 'success');
  messageBox.classList.add(type);
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function validarNombre(nombre) {
  return typeof nombre === 'string' && nombre.trim().length > 0;
}

function validarNota(nota) {
  const numero = Number(nota);
  return Number.isFinite(numero) && numero >= 0 && numero <= 100;
}

function calcularPromedio(notas) {
  return notas.reduce((acumulador, nota) => acumulador + Number(nota), 0) / notas.length;
}

function obtenerPromedioAlumno(alumno) {
  return calcularPromedio(alumno.notas);
}

function obtenerPromedioCursoPorCertamen(indiceCertamen) {
  if (alumnos.length === 0) return 0;

  const total = alumnos.reduce((suma, alumno) => suma + Number(alumno.notas[indiceCertamen]), 0);
  return total / alumnos.length;
}

function obtenerPromedioGeneralCurso() {
  if (alumnos.length === 0) return 0;

  const total = alumnos.reduce((suma, alumno) => suma + obtenerPromedioAlumno(alumno), 0);
  return total / alumnos.length;
}

function ordenarAlumnosPorPromedio() {
  return [...alumnos].sort((a, b) => obtenerPromedioAlumno(b) - obtenerPromedioAlumno(a));
}

function contarAprobados() {
  return alumnos.filter((alumno) => obtenerPromedioAlumno(alumno) >= 55).length;
}

function contarReprobados() {
  return alumnos.filter((alumno) => obtenerPromedioAlumno(alumno) < 55).length;
}

function renderResultados() {
  if (alumnos.length === 0) {
    resultsSection.innerHTML = '<div class="empty-state">Aún no hay alumnos registrados.</div>';
    return;
  }

  const alumnosOrdenados = ordenarAlumnosPorPromedio();

  const estudiantesHTML = alumnosOrdenados
    .map((alumno) => {
      const promedio = obtenerPromedioAlumno(alumno);
      return `
        <div class="student-item">
          <strong>Nombre:</strong> ${alumno.nombre}<br />
          <strong>C1:</strong> ${alumno.notas[0]}<br />
          <strong>C2:</strong> ${alumno.notas[1]}<br />
          <strong>C3:</strong> ${alumno.notas[2]}<br />
          <strong>Promedio:</strong> ${formatNumber(promedio)}
        </div>
      `;
    })
    .join('');

  const promedioCurso1 = obtenerPromedioCursoPorCertamen(0);
  const promedioCurso2 = obtenerPromedioCursoPorCertamen(1);
  const promedioCurso3 = obtenerPromedioCursoPorCertamen(2);
  const promedioGeneral = obtenerPromedioGeneralCurso();
  const aprobados = contarAprobados();
  const reprobados = contarReprobados();

  const rankingHTML = alumnosOrdenados
    .map((alumno) => `<li>${alumno.nombre}: ${formatNumber(obtenerPromedioAlumno(alumno))}</li>`)
    .join('');

  resultsSection.innerHTML = `
    <div class="result-group">
      ${estudiantesHTML}
    </div>

    <div class="summary">
      <strong>Promedio del curso C1:</strong> ${formatNumber(promedioCurso1)}<br />
      <strong>Promedio del curso C2:</strong> ${formatNumber(promedioCurso2)}<br />
      <strong>Promedio del curso C3:</strong> ${formatNumber(promedioCurso3)}<br />
      <strong>Promedio Final Curso:</strong> ${formatNumber(promedioGeneral)}<br />
      <strong>Aprobados:</strong> ${aprobados}<br />
      <strong>Reprobados:</strong> ${reprobados}
    </div>

    <div class="summary" style="margin-top: 18px;">
      <strong>Ranking:</strong>
      <ul class="summary-list">${rankingHTML}</ul>
    </div>
  `;
}

function agregarAlumno(event) {
  event.preventDefault();

  if (alumnos.length >= MAX_ALUMNOS) {
    showMessage(`Ya se registraron ${MAX_ALUMNOS} alumnos. No se permiten más.`, 'error');
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const notas = [
    document.getElementById('certamen1').value,
    document.getElementById('certamen2').value,
    document.getElementById('certamen3').value,
  ];

  if (!validarNombre(nombre)) {
    showMessage('Debes ingresar un nombre válido.', 'error');
    return;
  }

  if (!notas.every(validarNota)) {
    showMessage('Las notas deben ser números válidos entre 0 y 100.', 'error');
    return;
  }

  const alumno = {
    nombre,
    notas: notas.map((nota) => Number(nota)),
  };

  alumnos.push(alumno);
  form.reset();
  showMessage('Alumno agregado correctamente.', 'success');
  renderResultados();
}

form.addEventListener('submit', agregarAlumno);
renderResultados();
