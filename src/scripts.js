let divNotas = document.getElementsByClassName("notas")[0];
let botonAñadir = document.getElementsByClassName("boton")[0];

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
  let div = document.createElement("div");
  div.classList.add("nota");
  let titulo = document.createElement("h3");
  titulo.textContent = "Titulo Prueba";
  let desc = document.createElement("p");
  desc.textContent = "Descripcion de prueba ";

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
