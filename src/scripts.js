let divContenedorNotas = document.getElementsByClassName("contenedorNotas")[0];
let divCrearNota = document.createElement("div");
let divActualizarNota = document.createElement("div");
let divNotas = document.querySelector(".nota");

let botonAñadir = document.getElementsByClassName("boton")[0];
let botonGuardar = document.createElement("button");
let botonActualizar = document.createElement("button");
let botonSalir = document.createElement("button");

botonGuardar.textContent = "Guardar";
botonActualizar.textContent = "Actualizar";
botonSalir.textContent = "Salir";

let inputTitulo = document.createElement("input");
inputTitulo.setAttribute("type", "text");
inputTitulo.setAttribute("id", "titulo");
inputTitulo.setAttribute("placeholder", "Titulo");

let inputDescripcion = document.createElement("input");
inputDescripcion.setAttribute("type", "text");
inputDescripcion.setAttribute("id", "descripcion");
inputDescripcion.setAttribute("placeholder", "Descripcion");

let error = document.createElement("p");

for (let i = 0; i < php.length; i++) {
  let div = document.createElement("div");

  div.setAttribute("id", php[i][0]);

  div.classList.add("nota");
  let titulo = document.createElement("h3");
  let desc = document.createElement("p");

  titulo.textContent = php[i][1];
  desc.textContent = php[i][2];

  div.append(titulo);
  div.append(desc);

  divContenedorNotas.append(div);
}

botonAñadir.addEventListener("click", () => {
  divCrearNota.style.display = "block";
  error.style.display = "none";

  if ((divActualizarNota.style.display = "block")) {
    divActualizarNota.style.display = "none";
  }

  divCrearNota.append(inputTitulo);
  divCrearNota.append(inputDescripcion);
  divCrearNota.append(botonGuardar);
  divCrearNota.append(botonSalir);

  inputTitulo.value = "";
  inputDescripcion.value = "";

  document.body.append(divCrearNota);
});

botonGuardar.addEventListener("click", () => {
  let div = document.createElement("div");

  div.setAttribute("id", php.length + 1);

  div.classList.add("nota");

  let titulo = document.createElement("h3");
  let desc = document.createElement("p");

  titulo.textContent = inputTitulo.value;
  desc.textContent = inputDescripcion.value;

  if (titulo.textContent != "" || desc.textContent != "") {
    div.append(titulo);
    div.append(desc);

    divContenedorNotas.append(div);

    divCrearNota.style.display = "none";
  } else {
    error.textContent = "Tienes que poner texto";
    divCrearNota.append(error);
  }

  fetch("guardarNotas.php", {
    method: "POST",
    headers: { "Content-Type": "aplication/json" },
    body: JSON.stringify({
      titulo: titulo.textContent,
      desc: desc.textContent,
    }),
  });
});

divContenedorNotas.addEventListener("click", (e) => {
  if (e.target.tagName == "DIV") {
    let id = e.target.getAttribute("id");
    divActualizarNota.style.display = "block";

    if ((divCrearNota.style.display = "block")) {
      divCrearNota.style.display = "none";
    }
    if (id != null) {
      error.style.display = "none";

      divActualizarNota.append(inputTitulo);
      divActualizarNota.append(inputDescripcion);
      divActualizarNota.append(botonActualizar);
      divActualizarNota.append(botonSalir);

      inputTitulo.value = e.target.querySelector("h3").textContent;
      inputDescripcion.value = e.target.querySelector("p").textContent;

      document.body.append(divActualizarNota);
    }
  }
});

botonActualizar.addEventListener("click", () => {
  titulo.textContent = inputTitulo.value;
  desc.textContent = inputDescripcion.value;

  if (titulo.textContent != "" || desc.textContent != "") {
    div.append(titulo);
    div.append(desc);

    divContenedorNotas.append(div);

    divActualizarNota.style.display = "none";
  } else {
    error.textContent = "Tienes que poner texto";
    divActualizarNota.append(error);
  }

  fetch("actualizarNotas.php", {
    method: "POST",
    headers: { "Content-Type": "aplication/json" },
    body: JSON.stringify({
      titulo: titulo.textContent,
      desc: desc.textContent,
      id: php[id][0],
    }),
  });
});

botonSalir.addEventListener("click", () => {
  divCrearNota.style.display = "none";
});
