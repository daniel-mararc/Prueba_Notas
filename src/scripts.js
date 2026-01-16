let divNotas = document.getElementsByClassName("notas")[0];
let divCrearNota = document.createElement("div");
let botonAñadir = document.getElementsByClassName("boton")[0];
let botonGuardar = document.createElement("button");
let botonSalir = document.createElement("button");
let inputTitulo = document.createElement("input");
let inputDescripcion = document.createElement("input");
let error = document.createElement("p");

inputTitulo.setAttribute("type", "text");
inputTitulo.setAttribute("id", "titulo");
inputTitulo.setAttribute("placeholder", "Titulo");

inputDescripcion.setAttribute("type", "text");
inputDescripcion.setAttribute("id", "descripcion");
inputDescripcion.setAttribute("placeholder", "Descripcion");

for (let i = 0; i < php.length; i++) {
  let div = document.createElement("div");
  div.classList.add("nota");
  let titulo = document.createElement("h3");
  let desc = document.createElement("p");

  titulo.textContent = php[i][1];
  desc.textContent = php[i][2];

  div.append(titulo);
  div.append(desc);

  divNotas.append(div);
}

botonAñadir.addEventListener("click", () => {
  divCrearNota.style.display = "block";
  error.style.display = "none";

  botonGuardar.textContent = "Guardar";
  botonSalir.textContent = "Salir";

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
  div.classList.add("nota");

  let titulo = document.createElement("h3");
  let desc = document.createElement("p");

  titulo.textContent = inputTitulo.value;
  desc.textContent = inputDescripcion.value;

  if (titulo.textContent != "" || desc.textContent != "") {
    div.append(titulo);
    div.append(desc);

    divNotas.append(div);

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

botonSalir.addEventListener("click", () => {
  divCrearNota.style.display = "none";
});
