let divContenedorNotas = document.getElementsByClassName("contenedorNotas")[0];
let divCrearNota = document.createElement("div");
divCrearNota.classList.add("crearNota");
let divActualizarNota = document.createElement("div");
divActualizarNota.classList.add("actualizarNota");

let botonAñadir = document.getElementsByClassName("boton")[0];
let botonGuardar = document.createElement("button");
let botonActualizar = document.createElement("button");
let botonSalir = document.createElement("button");
let botonBorrar = document.createElement("button");

botonGuardar.textContent = "Guardar";
botonActualizar.textContent = "Actualizar";
botonSalir.textContent = "Salir";

let inputTitulo = document.createElement("input");
inputTitulo.setAttribute("type", "text");
inputTitulo.setAttribute("id", "titulo");
inputTitulo.setAttribute("placeholder", "Titulo");

let textAreaDescripcion = document.createElement("textarea");
textAreaDescripcion.setAttribute("type", "text");
textAreaDescripcion.setAttribute("id", "descripcion");
textAreaDescripcion.setAttribute("placeholder", "Descripcion");

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
  divCrearNota.append(textAreaDescripcion);
  divCrearNota.append(botonGuardar);
  divCrearNota.append(botonSalir);

  inputTitulo.value = "";
  textAreaDescripcion.value = "";

  document.body.append(divCrearNota);
});

botonGuardar.addEventListener("click", () => {
  let div = document.createElement("div");
  let notas = document.querySelectorAll(".nota");
  if (notas.length > 0) {
    let ultimaNota = notas[notas.length - 1];
    let id = parseInt(ultimaNota.id) + 1;

    div.setAttribute("id", id);
  } else {
    div.setAttribute("id", 1);
  }

  div.classList.add("nota");

  let titulo = document.createElement("h3");
  let desc = document.createElement("p");

  titulo.textContent = inputTitulo.value;
  desc.textContent = textAreaDescripcion.value;

  if (titulo.textContent != "" || desc.textContent != "") {
    div.append(titulo);
    div.append(desc);

    divContenedorNotas.append(div);

    divCrearNota.style.display = "none";

    fetch("guardarNotas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: div.getAttribute("id"),
        titulo: titulo.textContent,
        desc: desc.textContent,
      }),
    });
  } else {
    error.textContent = "Tienes que poner texto";
    error.style.display = "block";
    divCrearNota.append(error);
  }
});

divContenedorNotas.addEventListener("click", (e) => {
  if (e.target.closest(".nota")) {
    let notaDiv = e.target.closest(".nota");

    divActualizarNota.style.display = "block";
    divCrearNota.style.display = "none";
    error.style.display = "none";

    divActualizarNota.append(inputTitulo);
    divActualizarNota.append(textAreaDescripcion);
    divActualizarNota.append(botonActualizar);
    divActualizarNota.append(botonSalir);
    divActualizarNota.append(botonBorrar);

    let h3 = notaDiv.querySelector("h3");
    let p = notaDiv.querySelector("p");

    inputTitulo.value = notaDiv.querySelector("h3").textContent;
    textAreaDescripcion.value = notaDiv.querySelector("p").textContent;

    document.body.append(divActualizarNota);

    botonActualizar.addEventListener("click", () => {
      let titulo = inputTitulo.value;
      let desc = textAreaDescripcion.value;

      if (titulo != "" || desc != "") {
        h3.textContent = titulo;
        p.textContent = desc;

        divActualizarNota.style.display = "none";

        fetch("actualizarNotas.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: titulo,
            desc: desc,
            id: notaDiv.id,
          }),
        });
      } else {
        error.textContent = "Tienes que poner texto";
        error.style.display = "block";
        divActualizarNota.append(error);
      }
    });

    botonBorrar.addEventListener("click", () => {
      fetch("borrarNotas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        id: notaDiv.id,
      });
    });
  }
});

botonSalir.addEventListener("click", () => {
  divActualizarNota.style.display = "none";
  divCrearNota.style.display = "none";
});
