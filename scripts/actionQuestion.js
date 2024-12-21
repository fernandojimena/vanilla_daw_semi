// BTN BACK
document.getElementById("btn_atras").addEventListener("click", function () {
  window.location.href = "pantalla1.html";
});

// Obtener el email del user logeado (almacenado en las cookies)
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, cookieValue] = cookies[i].split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
const email = getCookie("email");
// test por consola del user activo
console.log(email);

// funcion que devuelve los valores del formulario (pregunta, puntuacion y verdedero o falso)
// con trimp eliminamos espacios en los extremos para evitar errores
function valores() {
  const pregunta = document.getElementById("pregunta").value.trim();
  const puntuacion = document.getElementById("puntuacion").value.trim();
  // el input con name respuesta que este checked
  const respuestaSeleccionada = document.querySelector(
    'input[name="respuesta"]:checked'
  );
  return { pregunta, puntuacion, respuestaSeleccionada };
}

// verificacion que el valor sera de 0 a 9
function puntuacionValida(puntuacion) {
  const num = parseInt(puntuacion);
  return !isNaN(num) && num >= 0 && num <= 9 && puntuacion.length === 1;
}

// VERIFICACION Y activa el boton de grabar si esta todo OK
function validacion() {
  // reutilizacion de codigo
  // const resultado = valores();
  // const pregunta = resultado.pregunta;
  // const puntuacion = resultado.puntuacion;
  // const respuestaSeleccionada = resultado.respuestaSeleccionada;

  const { pregunta, puntuacion, respuestaSeleccionada } = valores();
  const btnGrabar = document.getElementById("btn_grabar");
  // sino tiene valores vacios o falsos activa el boton sino no
  if (pregunta && respuestaSeleccionada && puntuacionValida(puntuacion)) {
    btnGrabar.disabled = false;
  } else {
    btnGrabar.disabled = true;
  }
}

// GRABAR EN LAS COOKIES
document
  .getElementById("btn_grabar")
  .addEventListener("click", function (event) {
    // evita que el formulario se envie y la web se recargue
    event.preventDefault();
    // reutilizacion de codigo
    const { pregunta, puntuacion, respuestaSeleccionada } = valores();

    if (!pregunta || !respuestaSeleccionada || !puntuacionValida(puntuacion)) {
      return;
    }

    // desactiva boton atras
    document.getElementById("btn_atras").disabled = true;
    // genera un identificador unico para cada pregunta
    const preguntaId = new Date().getTime();
    // llama a la funcion agregar fila
    agregarFilaTabla(
      preguntaId,
      pregunta,
      respuestaSeleccionada.value,
      puntuacion,
      "guardando..."
    );

    // establezco una gestion de exepciones para los errores con try y catch
    setTimeout(function () {
      try {
        // valores registrados dentro de las cookies del usuario
        document.cookie = `${email}_pregunta${preguntaId}=${encodeURIComponent(
          pregunta
        )};path=/`;
        document.cookie = `${email}_respuesta${preguntaId}=${encodeURIComponent(
          respuestaSeleccionada.value
        )};path=/`;
        document.cookie = `${email}_puntuacion${preguntaId}=${encodeURIComponent(
          puntuacion
        )};path=/`;
        // si esta todo bien coloca ok
        actualizarEstadoListado(preguntaId, "OK");
        // agrego una verificacion por consola del guardado
        console.log("Pregunta guardada correctamente");

      } catch (error) {
        // si da error coloca error
        actualizarEstadoListado(preguntaId, "Error");
        // agrego una verificacion por consola del error
        console.error("Error al guardar la pregunta:", error);
      }
      // activo el boton atras, reseteo el formulario
      document.getElementById("btn_atras").disabled = false;
      resetFormulario();
      cargarListadoPreguntas(true);
    }, 5000);
    document.getElementById("btn_grabar").disabled = true;
  });

// AGREGAR FILA
function agregarFilaTabla(preguntaId, pregunta, respuesta, puntuacion, estado) {
  const tablaBody = document
    .getElementById("tabla")
    .getElementsByTagName("tbody")[0];
  const row = tablaBody.insertRow();
  row.setAttribute("data-id", preguntaId);
  // ingreso valores en cada posicion
  row.insertCell(0).innerText = pregunta;
  row.insertCell(1).innerText = respuesta;
  row.insertCell(2).innerText = puntuacion;
  row.insertCell(3).innerText = estado;
}

// ACTUALIZA EL ESTADO DE LAS PREGUNTAS
function actualizarEstadoListado(preguntaId, estado) {
  const tablaBody = document
    .getElementById("tabla")
    .getElementsByTagName("tbody")[0];
  for (let i = 0; i < tablaBody.rows.length; i++) {
    const row = tablaBody.rows[i];
    // verifica el id de la pregunta y compara
    if (row.getAttribute("data-id") == preguntaId) {
      row.cells[3].innerText = estado;
      break;
    }
  }
}

// MOSTRAR LISTADO
function mostrarListadoPreguntas(preguntas) {
  const tablaBody = document
    .getElementById("tabla")
    .getElementsByTagName("tbody")[0];
  const tabla = document.getElementById("tabla");

  // Limpiar la tabla
  tablaBody.innerHTML = "";

  preguntas.forEach((pregunta) => {
    const row = tablaBody.insertRow();
    row.setAttribute("data-id", pregunta.id);
    row.insertCell(0).innerText = pregunta.pregunta;
    row.insertCell(1).innerText = pregunta.respuestaCorrecta;
    row.insertCell(2).innerText = pregunta.puntuacion;
    row.insertCell(3).innerText = "OK";
  });

  tabla.style.display = "block";
}

// CARGA CON RETRASO
function cargarListadoPreguntas(conRetraso = false) {
  const preguntas = [];
  document.cookie.split("; ").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key.startsWith(`${email}_pregunta`)) {
      const preguntaId = key.replace(`${email}_pregunta`, "");
      const respuesta = getCookie(`${email}_respuesta${preguntaId}`);
      const puntuacion = getCookie(`${email}_puntuacion${preguntaId}`);

      preguntas.push({
        id: preguntaId,
        pregunta: decodeURIComponent(value),
        respuestaCorrecta: respuesta,
        puntuacion: puntuacion,
      });
    }
  });

  if (conRetraso) {
    document.getElementById("cargandoText").style.display = "block";
    setTimeout(function () {
      document.getElementById("cargandoText").style.display = "none";
      mostrarListadoPreguntas(preguntas);
    }, 5000);
  } else {
    mostrarListadoPreguntas(preguntas);
  }
}

// CARGAR PREGUNTAS CUANDO SE CARGUE LA PAGINA
document.addEventListener("DOMContentLoaded", function () {
  cargarListadoPreguntas(true);
});

// RESETEO DE FORMULARIO
function resetFormulario() {
  document.getElementById("cuestionarioForm").reset();
  document.getElementById("btn_grabar").disabled = true;
}
