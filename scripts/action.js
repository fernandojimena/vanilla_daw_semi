// PARTE 1
document.addEventListener("DOMContentLoaded", function () {
  const bienvenida = document.getElementById("mensaje");
  const login = document.getElementById("formulario");

  // EVENTO F10
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "F10") {
      // oculto la primer pantalla y activo el login en el mismo html
      bienvenida.classList.add("oculto");
      login.classList.remove("oculto");
    }
  });

  // EVENTO TIMER
  setTimeout(function () {
    bienvenida.classList.add("oculto");
    login.classList.remove("oculto");
  }, 5000);
});

// PARTE 2
function validacion() {
  const input = document.getElementById("email");
  const errorMessage = document.getElementById("errorMessage");
  const email = input.value;
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // verificacion de email, si es correcto le agrego la class oculto al error
  if (patron.test(email)) {
    alert("Correo válido. ¡Bienvenido!");
    errorMessage.classList.add("oculto");

    // guardo fecha y hora
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleString("es-ES", {
      timeZone: "UTC",
    });

    // Guardamos las cookies
    // datos del usuario
    const userData = {
      email: email,
      lastLogin: fechaFormateada,
    };

    // convertir el objeto a json
    const userDataJson = encodeURIComponent(JSON.stringify(userData));

    //crea la cookie que expira en 7 dias
    document.cookie = `userData=${userDataJson}; max-age=${
      7 * 24 * 60 * 60
    }; path=/`;
    window.location.href = "pantalla2.html";
  } else {
    errorMessage.classList.remove("oculto");
    input.focus();
    // SetTimeout aplica un retraso de 0ms que nos asegura la ejecucion del focus antes que el select
    setTimeout(function () {
      input.select();
    }, 0);
  }
}

// PANTALLA 2
// Obtiene del cookie
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

const userDataJson = getCookie("userData");
// test por consola del user activo
console.log(userDataJson);

if (userDataJson) {
  const userData = JSON.parse(userDataJson);
  const email = userData.email;
  const lastLogin = userData.lastLogin;

  // Verificamos si las cookies están disponibles
  if (email && lastLogin) {
    // Saludo
    const saludo = document.getElementById("saludo");
    if (saludo) {
      saludo.innerHTML = email;
    }

    // Mostrar la fecha y hora del último acceso
    const ultimoAcceso = document.getElementById("ultimoAcceso");
    if (ultimoAcceso) {
      ultimoAcceso.innerHTML = "La última vez que ingresaste fue el " + lastLogin;
    }
  }
} else {
  // en caso de error al guardar la informacion en el paso previo
  const saludo = document.getElementById("saludo");
  if (saludo) {
    saludo.innerHTML = "No se encontraron datos de usuario.";
  }
}

// BOTON PREGUNTAS - redirecciona pantalla 3
document.getElementById("btn_preguntas").addEventListener("click", function () {
  window.location.href = "pantalla3.html";
});
