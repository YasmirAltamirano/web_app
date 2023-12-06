document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("boton_ingresar")
    .addEventListener("click", ingresarNombre);
  document
    .getElementById("boton_agregar_tarea")
    .addEventListener("click", agregarTarea);
  document.getElementById("logoff").addEventListener("click", volverBienvenida);
  document
    .getElementById("logoInfo")
    .addEventListener("click", () => mostrarVista("info"));
  document
    .getElementById("logoAgenda")
    .addEventListener("click", () => mostrarVista("agenda_tarea"));

  const nombreAlmacenado = localStorage.getItem("usuarioNombre");
  if (nombreAlmacenado) {
    mostrarTareas();
    mostrarVista("agenda_tarea");
  } else {
    mostrarVista("splashScreen");
    ingresarBienvenida();
  }
});

function mostrarVista(vista) {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("oculto"));
  document.getElementById(vista).classList.remove("oculto");
}

function ingresarBienvenida() {
  setTimeout(() => {
    mostrarVista("bienvenida");
  }, 3000);
}

function ingresarNombre() {
  const nombre = document.getElementById("nombreInput").value;
  const nombreSpan = document.getElementById("nombre");

  if (nombre !== "") {
    localStorage.setItem("usuarioNombre", nombre);

    document.getElementById("saludo").textContent = `¡Bienvenido, ${nombre}!`;
    document.getElementById("saludo").classList.remove("mensaje_oculto");

    document.getElementById("i_nombre").classList.add("mensaje_oculto");
    document.getElementById("nombreInput").classList.add("mensaje_oculto");
    document.getElementById("boton_ingresar").classList.add("mensaje_oculto");
    nombreSpan.textContent = nombre;

    setTimeout(() => {
      mostrarVista("agenda_tarea");
    }, 2000);
  } else {
    alert("Ingrese un nombre");
  }
}

function volverBienvenida() {
  // Limpiar localStorage y mostrar la vista de bienvenida después de 2 segundos
  localStorage.clear();
  setTimeout(() => {
    mostrarVista("bienvenida");
    document.getElementById("bienvenida").style.transition =
      "opacity 2s ease-in-out";
    document.getElementById("bienvenida").style.opacity = 1;
    document.getElementById("agenda_tarea").classList.add("oculto");
    document.getElementById("saludo").classList.add("mensaje_oculto");
    document.getElementById("i_nombre").classList.remove("mensaje_oculto");
    document.getElementById("nombreInput").classList.remove("mensaje_oculto");
    document
      .getElementById("boton_ingresar")
      .classList.remove("mensaje_oculto");
  }, 2000);
}

function agregarTarea() {
  const ingresoTarea = document.getElementById("ingresoTarea");

  if (ingresoTarea.value !== "") {
    const lista = document.querySelector("#listadoTareas");
    const nuevaTarea = document.createElement("li");
    nuevaTarea.innerHTML = `
      <div>
        <input type="checkbox" onchange="completarTarea(this)">
        <span>${ingresoTarea.value}</span>
        <input type="file" accept="image/*">
        <input type="date" class="fechaInput">
        <button class="complete" onclick="completarTarea(this.parentElement)"> <img src="./assets/img/check.svg"></img></button>
        <button class="delete" onclick="eliminarTarea(this.parentElement.parentElement)"><img src="./assets/img/delete.svg"></img></button>
      </div>
    `;

    lista.prepend(nuevaTarea);
    guardarTareas();
    ingresoTarea.value = "";
  }
}

function guardarTareas() {
  const listadoTareas = document.getElementById("listadoTareas");
  const tareasItems = listadoTareas.getElementsByTagName("li");

  let tareasHTML = "";

  for (let i = 0; i < tareasItems.length; i++) {
    const textoTarea = tareasItems[i].querySelector("span").textContent;
    const estaCompletada = tareasItems[i].querySelector(
      'input[type="checkbox"]'
    ).checked;
    const fechaTarea = tareasItems[i].querySelector(".fechaInput").value;

    tareasHTML += `
      <div>
      <li>
        <input type="checkbox" onchange="completarTarea(this)" ${
          estaCompletada ? "checked" : ""
        }>
        <span style="${
          estaCompletada ? "text-decoration: line-through;" : ""
        }"> ${textoTarea}</span>
        <input type="file" accept="image/*">
        <input type="date" class="fechaInput" value="${fechaTarea}">
        <button class="complete" onclick="completarTarea(this.parentElement)"><img src="./assets/img/check.svg"></img></button>
        <button class="delete" onclick="eliminarTarea(this.parentElement.parentElement)"><img src="./assets/img/delete.svg"></button>
        </li>
        </div>
      
    `;
  }

  // Guardar el contenido HTML en localStorage
  localStorage.setItem("tareas", tareasHTML);
}

function eliminarTarea(tarea) {
  tarea.remove();
  guardarTareas();
}

function completarTarea(tarea) {
  const checkbox = tarea.querySelector('input[type="checkbox"]');
  const textoTarea = tarea.querySelector("span");

  if (checkbox.checked) {
    textoTarea.style.textDecoration = "line-through";
    textoTarea.style.color = "blue";
  } else {
    textoTarea.style.textDecoration = "none";
  }

  guardarTareas();
}

function mostrarTareas() {
  const listadoTareas = document.getElementById("listadoTareas");
  const tareasGuardadas = localStorage.getItem("tareas");

  if (tareasGuardadas) {
    listadoTareas.innerHTML = tareasGuardadas;
  } else {
    localStorage.setItem("tareas", "");
  }
}
