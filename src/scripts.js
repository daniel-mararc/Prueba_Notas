let divNotas = document.getElementsByClassName("notas")[0];
let botonAñadir = document.getElementsByClassName("boton")[0];

console.log(php);

botonAñadir.addEventListener("click", () => {
  let div = document.createElement("div");
  div.classList.add("nota");
  let titulo = document.createElement("h3");
  titulo.textContent = "Titulo Prueba";
  let desc = document.createElement("p");
  desc.textContent = "Descripcion de prueba ";

  console.log(titulo);

  div.append(titulo);
  div.append(desc);

  divNotas.append(div);

  fetch("guardarNotas.php", {
    method: "POST",
    headers: { "Content-Type": "aplication/json" },
    body: JSON.stringify({
      titulo: titulo.textContent,
      desc: desc.textContent,
    }),
  });
});

console.log(prueba);
