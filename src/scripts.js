let divNotas = document.getElementsByClassName("notas");
let botonAñadir = document.getElementsByClassName("boton");

botonAñadir[0].addEventListener("click", () => {
  let div = document.createElement("div");
  div.classList.add("nota");
  let titulo = document.createElement("h3");
  titulo.textContent = "Titulo Prueba";
  let desc = document.createElement("p");
  desc.textContent = "Descripcion de prueba ";

  div.append(titulo);
  div.append(desc);

  divNotas[0].append(div);
});
