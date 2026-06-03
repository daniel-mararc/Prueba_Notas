let divContenedorNotas = document.getElementsByClassName("contenedorNotas")[0];
let divContenedorCarpetas =
  document.getElementsByClassName("contenedorCarpetas")[0];
let divCrearNota = document.createElement("div");
let divActualizarNota = document.createElement("div");
let divConfigVent = document.createElement("div");
let divCrearCarpeta = document.createElement("div");
let divCarpetasPopup = document.createElement("div");
let divUsuariosPopup = document.createElement("div");

divCrearNota.classList.add("crearNota");
divActualizarNota.classList.add("actualizarNota");
divConfigVent.classList.add("configVent");
divCrearCarpeta.classList.add("crearCarpeta");
divCarpetasPopup.classList.add("popupCarpetas");
divUsuariosPopup.classList.add("popupUsuarios");

let divBotonesCrear = document.createElement("div");
let divBotonesActualizar = document.createElement("div");
let divBotonesConfig = document.createElement("div");
let divBotonesCrearCarpeta = document.createElement("div");
let divBotonesPopup = document.createElement("div");

divBotonesCrear.classList.add("botones");
divBotonesActualizar.classList.add("botones");
divBotonesConfig.classList.add("botones");
divBotonesCrearCarpeta.classList.add("botones");
divBotonesPopup.classList.add("botonesPopup");

let botonAñadir = document.getElementsByClassName("boton")[0];
let botonInicio = document.getElementById("inicio");
let botonFavoritas = document.getElementById("favoritas");
let botonConfig = document.getElementById("configuracion");
let botonCompartir = document.getElementById("compartidos");
let botonCerrarSesion = document.getElementById("cerrarSesion");
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
let comaprtir = document.createElement("span");

estrella.classList.add("estrella");
comaprtir.classList.add("compartir");

estrella.innerHTML = "☆";
comaprtir.innerHTML = "👤";

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

  divBotonesCrear.append(botonGuardar);
  divBotonesCrear.append(botonSalir);

  estrella.classList.remove("activa");

  divCrearNota.append(inputTitulo);
  divCrearNota.append(textAreaDescripcion);
  divCrearNota.append(divBotonesCrear);

  inputTitulo.value = "";
  textAreaDescripcion.value = "";

  document.body.append(divCrearNota);
});

divActualizarNota.addEventListener("click", (e) => {
  let notaId = divActualizarNota.dataset.id;

  if (e.target.closest(".estrella")) {
    e.target.classList.toggle("activa");
  }
  if (e.target.closest(".compartir")) {
    fetch("getUsuariosCompartidos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_nota: notaId }),
    })
      .then((res) => res.json())
      .then((data) => {
        abrirPopupUsuarios(data, notaId);
      });
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

    fetch("guardarNotas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: div.getAttribute("id"),
        titulo: titulo.textContent,
        desc: desc.textContent,
        fav: false,
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

    divActualizarNota.dataset.id = notaDiv.id;

    divActualizarNota.style.display = "flex";
    error.style.display = "none";

    divCrearNota.style.display = "none";
    divConfigVent.style.display = "none";
    divCrearCarpeta.style.display = "none";

    divBotonesActualizar.append(botonCarpetas);
    divBotonesActualizar.append(botonActualizar);
    divBotonesActualizar.append(botonBorrar);
    divBotonesActualizar.append(botonSalir);

    divActualizarNota.append(comaprtir);
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

    botonCarpetas.onclick = () => {
      fetch("getCarpetasAsigNotas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_nota: notaDiv.id }),
      })
        .then((res) => res.json())
        .then((carpetasAsignadas) => {
          abrirPopupCarpetas(carpetasAsignadas, notaDiv.id);
        });
    };

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

  fetch("favoritoNotas.php", {
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

botonCompartir.addEventListener("click", (e) => {
  e.preventDefault();

  console.log("Compartidas");

  tituloPagina.textContent = "👤 Compartidas";

  fetch("getNotasCompartidas.php", {
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
        let compartido = document.createElement("small");

        titulo.textContent = data[i][1];
        desc.textContent = data[i][2];
        compartido.textContent = "Nota de " + data[i][4];

        div.classList.add("favorita");

        div.append(titulo);
        div.append(compartido);
        div.append(desc);

        divContenedorNotas.append(div);
      }
    });
});

botonCerrarSesion.addEventListener("click", () => {
  fetch("cerrarSesion.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then(() => {
    window.location.href = "index.html";
  });
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

    carpeta.append(btnBorrar);

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

divContenedorCarpetas.addEventListener("click", (e) => {
  if (e.target.closest(".button")) {
    let carpeta = e.target.closest(".carpeta");
    carpeta.remove();
    fetch("borrarCarpeta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: carpeta.id,
      }),
    });
  } else if (e.target.closest(".carpeta")) {
    let nombre = e.target.closest(".carpeta").childNodes[0].textContent;

    tituloPagina.textContent = "📂 " + nombre;

    fetch("getCarpetaNotas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: e.target.id,
      }),
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
  }
});

function abrirPopupCarpetas(carpetasAsignadas, notaId) {
  divCarpetasPopup.innerHTML = "";
  divCarpetasPopup.style.display = "flex";

  let titulo = document.createElement("h3");
  titulo.textContent = "Carpetas";
  divCarpetasPopup.append(titulo);

  let carpetas = document.getElementsByClassName("carpeta");

  for (let i = 0; i < carpetas.length; i++) {
    let carpeta = document.createElement("div");

    carpeta.classList.add("carpetaPopup");
    carpeta.dataset.id = carpetas[i].id;
    carpeta.textContent = "📁 " + carpetas[i].childNodes[0].textContent;

    let yaAsignada = carpetasAsignadas.includes(carpetas[i].id);

    if (yaAsignada) {
      carpeta.classList.add("seleccionada");
    }

    carpeta.onclick = () => {
      carpeta.classList.toggle("seleccionada");
    };

    divCarpetasPopup.append(carpeta);
  }

  let divBotonesPopup = document.createElement("div");
  divBotonesPopup.classList.add("botonesPopup");

  let btnGuardar = document.createElement("button");
  let btnCerrar = document.createElement("button");

  btnGuardar.textContent = "Guardar";
  btnCerrar.textContent = "Cerrar";

  btnGuardar.onclick = () => {
    let seleccionadas = document.querySelectorAll(".carpetaPopup.seleccionada");

    let idsSeleccionados = Array.from(seleccionadas).map((c) => c.dataset.id);

    fetch("guardarNotasCarpeta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_nota: notaId,
        carpetas: idsSeleccionados,
      }),
    });

    divCarpetasPopup.style.display = "none";
  };

  btnCerrar.onclick = () => {
    divCarpetasPopup.style.display = "none";
  };

  divBotonesPopup.append(btnGuardar, btnCerrar);
  divCarpetasPopup.append(divBotonesPopup);

  divActualizarNota.append(divCarpetasPopup);
}

function abrirPopupUsuarios(usuariosCompartidos, notaId) {
  divUsuariosPopup.innerHTML = "";
  divUsuariosPopup.style.display = "flex";

  let titulo = document.createElement("h3");
  titulo.textContent = "Usuarios";
  divUsuariosPopup.append(titulo);

  fetch("getUsuariosCompartir.php")
    .then((res) => res.json())
    .then((usuarios) => {
      for (let i = 0; i < usuarios.length; i++) {
        let usuario = document.createElement("div");

        usuario.classList.add("usuarioPopup");
        usuario.dataset.id = usuarios[i][0];
        let correoOriginal = String(usuarios[i][1]).trim();
        let nombreCortado = correoOriginal.split("@")[0];
        usuario.textContent = "👤 " + nombreCortado;

        let yaCompartido = usuariosCompartidos.includes(usuarios[i][0]);

        if (yaCompartido) {
          usuario.classList.add("seleccionado");
        }

        usuario.onclick = () => {
          usuario.classList.toggle("seleccionado");
        };

        divUsuariosPopup.append(usuario);
      }

      let divBotones = document.createElement("div");
      divBotones.classList.add("botonesPopup");

      let btnGuardar = document.createElement("button");
      let btnCerrar = document.createElement("button");

      btnGuardar.textContent = "Guardar";
      btnCerrar.textContent = "Cerrar";

      btnGuardar.onclick = () => {
        let seleccionados = document.querySelectorAll(
          ".usuarioPopup.seleccionado",
        );

        let ids = Array.from(seleccionados).map((u) => u.dataset.id);

        fetch("guardarNotasCompartidas.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_nota: notaId,
            usuarios: ids,
          }),
        });

        divUsuariosPopup.style.display = "none";
      };

      btnCerrar.onclick = () => {
        divUsuariosPopup.style.display = "none";
      };

      divBotones.append(btnGuardar, btnCerrar);
      divUsuariosPopup.append(divBotones);

      divActualizarNota.append(divUsuariosPopup);
    });
}
