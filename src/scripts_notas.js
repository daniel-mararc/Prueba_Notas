let divContenedorNotas = document.getElementsByClassName("contenedorNotas")[0];
let divContenedorCarpetas =
  document.getElementsByClassName("contenedorCarpetas")[0];
let divCrearNota = document.createElement("div");
let divActualizarNota = document.createElement("div");
let divConfigVent = document.createElement("div");
let divCrearCarpeta = document.createElement("div");

divCrearNota.classList.add("crearNota");
divActualizarNota.classList.add("actualizarNota");
divConfigVent.classList.add("configVent");
divCrearCarpeta.classList.add("crearCarpeta");

let divBotonesCrear = document.createElement("div");
let divBotonesActualizar = document.createElement("div");
let divBotonesConfig = document.createElement("div");
let divBotonesCrearCarpeta = document.createElement("div");

divBotonesCrear.classList.add("botones");
divBotonesActualizar.classList.add("botones");
divBotonesConfig.classList.add("botones");
divBotonesCrearCarpeta.classList.add("botones");

let botonAñadir = document.getElementsByClassName("boton")[0];
let botonInicio = document.getElementById("inicio");
let botonFavoritas = document.getElementById("favoritas");
let botonConfig = document.getElementById("configuracion");
let botonCrearCarpeta = document.getElementById("crearCarpeta");

let botonGuardar = document.createElement("button");
let botonActualizar = document.createElement("button");
let botonSalir = document.createElement("button");
let botonBorrar = document.createElement("button");
let botonCarpetas = document.createElement("button");
let botonCambioModo = document.createElement("button");
let botonCrear = document.createElement("button");

botonGuardar.textContent = "Guardar";
botonActualizar.textContent = "Actualizar";
botonBorrar.textContent = "Borrar";
botonSalir.textContent = "Salir";
botonCarpetas.textContent = "Añadir Carpeta";
botonCrear.textContent = "Crear";

let estrella = document.createElement("span");

estrella.classList.add("estrella");

estrella.innerHTML = "☆";

let tituloPagina = document.getElementsByClassName("titulo")[0];

tituloPagina.textContent = "🏠 Inicio";

let inputTitulo = document.createElement("input");
inputTitulo.setAttribute("type", "text");
inputTitulo.setAttribute("id", "titulo");
inputTitulo.setAttribute("placeholder", "Titulo");

let textAreaDescripcion = document.createElement("textarea");
textAreaDescripcion.setAttribute("type", "text");
textAreaDescripcion.setAttribute("id", "descripcion");
textAreaDescripcion.setAttribute("placeholder", "Descripcion");

let tituloConfig = document.createElement("h2");
tituloConfig.textContent = "Configuración";

let divConfigs = document.createElement("div");
divConfigs.classList.add("configs");

let inputNombreCarpeta = document.createElement("input");
inputNombreCarpeta.setAttribute("type", "text");
inputNombreCarpeta.setAttribute("id", "NombreCarpeta");
inputNombreCarpeta.setAttribute("placeholder", "Nombre Carpeta");

let error = document.createElement("p");

for (let i = 0; i < phpNotas.length; i++) {
  let div = document.createElement("div");

  div.setAttribute("id", phpNotas[i][0]);

  div.classList.add("nota");
  let titulo = document.createElement("h3");
  let desc = document.createElement("p");

  titulo.textContent = phpNotas[i][1];
  desc.textContent = phpNotas[i][2];

  if (phpNotas[i][3] == true) {
    div.classList.add("favorita");
  }

  div.append(titulo);
  div.append(desc);

  divContenedorNotas.append(div);
}

if (phpTema[0] == "dark") {
  document.body.classList.toggle("dark");
}

for (let i = 0; i < phpCarpetas.length; i++) {
  let carpeta = document.createElement("a");

  carpeta.id = phpCarpetas[i][0];

  carpeta.textContent = phpCarpetas[i][1];

  carpeta.classList.add("carpeta");

  let btnBorrar = document.createElement("button");
  btnBorrar.classList.add("button");
  btnBorrar.textContent = "🗑️";

  carpeta.appendChild(btnBorrar);

  divContenedorCarpetas.prepend(carpeta);
}

botonAñadir.addEventListener("click", () => {
  divCrearNota.style.display = "flex";
  error.style.display = "none";

  divActualizarNota.style.display = "none";
  divConfigVent.style.display = "none";
  divCrearCarpeta.style.display = "none";

  divBotonesCrear.append(botonCarpetas);
  divBotonesCrear.append(botonGuardar);
  divBotonesCrear.append(botonSalir);

  estrella.classList.remove("activa");

  divCrearNota.append(estrella);
  divCrearNota.append(inputTitulo);
  divCrearNota.append(textAreaDescripcion);
  divCrearNota.append(divBotonesCrear);

  inputTitulo.value = "";
  textAreaDescripcion.value = "";

  document.body.append(divCrearNota);
});

divCrearNota.addEventListener("click", (e) => {
  if (e.target.closest(".estrella")) {
    e.target.classList.toggle("activa");
  }
});

divActualizarNota.addEventListener("click", (e) => {
  if (e.target.closest(".estrella")) {
    e.target.classList.toggle("activa");
  }
});

botonGuardar.addEventListener("click", () => {
  let div = document.createElement("div");
  let notas = document.querySelectorAll(".nota");
  let uid = crypto.randomUUID();

  div.setAttribute("id", uid);

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

    if (estrella.classList.contains("activa")) {
      notaDiv.classList.add("favorita");
    } else {
      notaDiv.classList.remove("favorita");
    }

    fetch("guardarNotas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: div.getAttribute("id"),
        titulo: titulo.textContent,
        desc: desc.textContent,
        fav: estrella.classList.contains("activa"),
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

    divActualizarNota.style.display = "flex";
    error.style.display = "none";

    divCrearNota.style.display = "none";
    divConfigVent.style.display = "none";
    divCrearCarpeta.style.display = "none";

    divBotonesActualizar.append(botonCarpetas);
    divBotonesActualizar.append(botonActualizar);
    divBotonesActualizar.append(botonBorrar);
    divBotonesActualizar.append(botonSalir);

    divActualizarNota.append(estrella);
    divActualizarNota.append(inputTitulo);
    divActualizarNota.append(textAreaDescripcion);
    divActualizarNota.append(divBotonesActualizar);

    let h3 = notaDiv.querySelector("h3");
    let p = notaDiv.querySelector("p");

    if (notaDiv.classList.contains("favorita")) {
      estrella.classList.add("activa");
    } else {
      estrella.classList.remove("activa");
    }

    inputTitulo.value = notaDiv.querySelector("h3").textContent;
    textAreaDescripcion.value = notaDiv.querySelector("p").textContent;

    document.body.append(divActualizarNota);

    botonActualizar.onclick = () => {
      let titulo = inputTitulo.value;
      let desc = textAreaDescripcion.value;

      if (titulo != "" || desc != "") {
        h3.textContent = titulo;
        p.textContent = desc;

        divActualizarNota.style.display = "none";

        if (estrella.classList.contains("activa")) {
          notaDiv.classList.add("favorita");
        } else {
          notaDiv.classList.remove("favorita");
        }

        if (
          tituloPagina.textContent == "✨ Favoritas" &&
          !estrella.classList.contains("activa")
        ) {
          notaDiv.remove();
        }

        fetch("actualizarNotas.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: titulo,
            desc: desc,
            id: notaDiv.id,
            fav: estrella.classList.contains("activa"),
          }),
        });
      } else {
        error.textContent = "Tienes que poner texto";
        error.style.display = "block";
        divActualizarNota.append(error);
      }
    };

    botonBorrar.onclick = () => {
      fetch("borrarNotas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notaDiv.id }),
      });
      notaDiv.remove();
      divActualizarNota.style.display = "none";
    };
  }
});

botonSalir.addEventListener("click", () => {
  divActualizarNota.style.display = "none";
  divCrearNota.style.display = "none";
  divConfigVent.style.display = "none";
  divCrearCarpeta.style.display = "none";
});

botonInicio.addEventListener("click", (e) => {
  e.preventDefault();

  tituloPagina.textContent = "🏠 Inicio";

  fetch("inicioNotas.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      divContenedorNotas.innerHTML = "";

      for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");

        div.setAttribute("id", data[i][0]);

        div.classList.add("nota");
        let titulo = document.createElement("h3");
        let desc = document.createElement("p");

        titulo.textContent = data[i][1];
        desc.textContent = data[i][2];

        if (data[i][3] == true) {
          div.classList.add("favorita");
        }

        div.append(titulo);
        div.append(desc);

        divContenedorNotas.append(div);
      }
    });
});

botonFavoritas.addEventListener("click", (e) => {
  e.preventDefault();

  tituloPagina.textContent = "✨ Favoritas";

  fetch("notasFavoritas.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      divContenedorNotas.innerHTML = "";

      for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");

        div.setAttribute("id", data[i][0]);

        div.classList.add("nota");
        let titulo = document.createElement("h3");
        let desc = document.createElement("p");

        titulo.textContent = data[i][1];
        desc.textContent = data[i][2];

        div.classList.add("favorita");

        div.append(titulo);
        div.append(desc);

        divContenedorNotas.append(div);
      }
    });
});

botonConfig.addEventListener("click", (e) => {
  e.preventDefault();

  divConfigVent.style.display = "flex";

  divCrearNota.style.display = "none";
  divActualizarNota.style.display = "none";
  divCrearCarpeta.style.display = "none";

  if (document.body.classList.contains("dark")) {
    botonCambioModo.textContent = "Modo claro";
  } else {
    botonCambioModo.textContent = "Modo oscuro";
  }

  botonCambioModo.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      botonCambioModo.textContent = "Modo claro";

      fetch("actualizarTema.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tema: "dark",
        }),
      });
    } else {
      botonCambioModo.textContent = "Modo oscuro";
      fetch("actualizarTema.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tema: "bright",
        }),
      });
    }
  });

  divConfigs.append(botonCambioModo);

  divBotonesConfig.append(botonSalir);

  divConfigVent.append(tituloConfig);
  divConfigVent.append(divConfigs);
  divConfigVent.append(divBotonesConfig);

  document.body.append(divConfigVent);
});

botonCrearCarpeta.addEventListener("click", () => {
  divCrearCarpeta.style.display = "flex";

  divActualizarNota.style.display = "none";
  divCrearNota.style.display = "none";
  divConfigVent.style.display = "none";

  divBotonesCrearCarpeta.append(botonCrear);
  divBotonesCrearCarpeta.append(botonSalir);

  divCrearCarpeta.append(inputNombreCarpeta);
  divCrearCarpeta.append(divBotonesCrearCarpeta);

  document.body.append(divCrearCarpeta);

  botonCrear.onclick = () => {
    let carpeta = document.createElement("a");
    let uid = crypto.randomUUID();

    carpeta.textContent = inputNombreCarpeta.value;

    carpeta.classList.add("carpeta");

    carpeta.id = uid;

    let btnBorrar = document.createElement("button");
    btnBorrar.classList.add("button");
    btnBorrar.textContent = "🗑️";

    carpeta.appendChild(btnBorrar);

    divContenedorCarpetas.append(carpeta);

    divCrearCarpeta.style.display = "none";

    fetch("crearCarpeta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: uid,
        nombre: inputNombreCarpeta.value,
      }),
    });
  };
});

botonCarpetas.addEventListener("click", () => {
  console.log("boton");
});

divContenedorCarpetas.addEventListener("click", (e) => {
  if (e.target.closest(".button")) {
    let carpeta = e.target.closest(".carpeta");
    carpeta.remove();
    console.log("borrar");
    fetch("borrarCarpeta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: carpeta.id,
      }),
    });
  } else if (e.target.closest(".carpeta")) {
    console.log(e.target.id);
  }
});
