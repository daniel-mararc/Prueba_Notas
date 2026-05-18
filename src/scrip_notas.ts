// =====================
// TIPOS
// =====================
interface Nota {
  id: string;
  titulo: string;
  descripcion: string;
  favorita: boolean;
}

interface Carpeta {
  id: string;
  nombre: string;
}

// vienen de PHP
declare const phpNotas: [string, string, string, boolean][];
declare const phpCarpetas: [string, string][];
declare const phpTema: string[];

// =====================
// ELEMENTOS DOM
// =====================
const divContenedorNotas = document.querySelector(
  ".contenedorNotas",
) as HTMLElement;
const divContenedorCarpetas = document.querySelector(
  ".contenedorCarpetas",
) as HTMLElement;

// popups
const divCrearNota = document.createElement("div");
const divActualizarNota = document.createElement("div");
const divConfigVent = document.createElement("div");
const divCrearCarpeta = document.createElement("div");
const divCarpetasPopup = document.createElement("div");

divCrearNota.classList.add("crearNota");
divActualizarNota.classList.add("actualizarNota");
divConfigVent.classList.add("configVent");
divCrearCarpeta.classList.add("crearCarpeta");
divCarpetasPopup.classList.add("popupCarpetas");

// =====================
// BOTONES
// =====================
const botonAñadir = document.querySelector(".boton") as HTMLButtonElement;
const botonInicio = document.getElementById("inicio") as HTMLButtonElement;
const botonFavoritas = document.getElementById(
  "favoritas",
) as HTMLButtonElement;
const botonConfig = document.getElementById(
  "configuracion",
) as HTMLButtonElement;
const botonCrearCarpeta = document.getElementById(
  "crearCarpeta",
) as HTMLButtonElement;

const botonGuardar = document.createElement("button");
const botonActualizar = document.createElement("button");
const botonSalir = document.createElement("button");
const botonBorrar = document.createElement("button");
const botonCarpetas = document.createElement("button");
const botonCambioModo = document.createElement("button");
const botonCrear = document.createElement("button");

botonGuardar.textContent = "Guardar";
botonActualizar.textContent = "Actualizar";
botonBorrar.textContent = "Borrar";
botonSalir.textContent = "Salir";
botonCarpetas.textContent = "Carpetas";
botonCrear.textContent = "Crear";

// =====================
// INPUTS
// =====================
const inputTitulo = document.createElement("input");
inputTitulo.placeholder = "Título";

const textAreaDescripcion = document.createElement("textarea");
textAreaDescripcion.placeholder = "Descripción";

const inputNombreCarpeta = document.createElement("input");
inputNombreCarpeta.placeholder = "Nombre carpeta";

// =====================
// ESTRELLA
// =====================
const estrella = document.createElement("span");
estrella.classList.add("estrella");
estrella.textContent = "☆";

// =====================
// TITULO
// =====================
const tituloPagina = document.querySelector(".titulo") as HTMLElement;
tituloPagina.textContent = "🏠 Inicio";

// =====================
// RENDER NOTAS
// =====================
function renderNotas(data: [string, string, string, boolean][]) {
  divContenedorNotas.innerHTML = "";

  data.forEach((n) => {
    const div = document.createElement("div");
    div.classList.add("nota");
    div.id = n[0];

    const h3 = document.createElement("h3");
    const p = document.createElement("p");

    h3.textContent = n[1];
    p.textContent = n[2];

    if (n[3]) div.classList.add("favorita");

    div.append(h3, p);
    divContenedorNotas.append(div);
  });
}

renderNotas(phpNotas);

// =====================
// RENDER CARPETAS
// =====================
function renderCarpetas() {
  divContenedorCarpetas.innerHTML = "";

  phpCarpetas.forEach((c) => {
    const a = document.createElement("a");
    a.classList.add("carpeta");
    a.id = c[0];
    a.textContent = c[1];

    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.classList.add("button");

    a.append(btn);
    divContenedorCarpetas.append(a);
  });
}

renderCarpetas();

// =====================
// CREAR NOTA
// =====================
botonAñadir.addEventListener("click", () => {
  divCrearNota.innerHTML = "";
  divCrearNota.style.display = "flex";

  divCrearNota.append(
    estrella,
    inputTitulo,
    textAreaDescripcion,
    botonGuardar,
    botonSalir,
  );

  document.body.append(divCrearNota);
});

botonGuardar.addEventListener("click", () => {
  const id = crypto.randomUUID();

  const div = document.createElement("div");
  div.classList.add("nota");
  div.id = id;

  const h3 = document.createElement("h3");
  const p = document.createElement("p");

  h3.textContent = inputTitulo.value;
  p.textContent = textAreaDescripcion.value;

  div.append(h3, p);
  divContenedorNotas.append(div);

  fetch("guardarNotas.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      titulo: h3.textContent,
      desc: p.textContent,
      fav: estrella.classList.contains("activa"),
    }),
  });

  divCrearNota.style.display = "none";
});

// =====================
// CLICK NOTAS
// =====================
divContenedorNotas.addEventListener("click", (e) => {
  const notaDiv = (e.target as HTMLElement).closest(".nota") as HTMLElement;
  if (!notaDiv) return;

  divActualizarNota.innerHTML = "";
  divActualizarNota.style.display = "flex";

  const h3 = notaDiv.querySelector("h3") as HTMLElement;
  const p = notaDiv.querySelector("p") as HTMLElement;

  inputTitulo.value = h3.textContent || "";
  textAreaDescripcion.value = p.textContent || "";

  divActualizarNota.append(
    estrella,
    inputTitulo,
    textAreaDescripcion,
    botonCarpetas,
    botonActualizar,
    botonBorrar,
    botonSalir,
  );

  document.body.append(divActualizarNota);
});

// =====================
// POPUP CARPETAS (ARREGLADO)
// =====================
function abrirPopupCarpetas(asignadas: string[], notaId: string) {
  divCarpetasPopup.innerHTML = "";
  divCarpetasPopup.style.display = "flex";

  const titulo = document.createElement("h3");
  titulo.textContent = "Carpetas";
  divCarpetasPopup.append(titulo);

  phpCarpetas.forEach((c) => {
    const div = document.createElement("div");
    div.classList.add("carpetaPopup");
    div.dataset.id = c[0];
    div.textContent = "📁 " + c[1];

    if (asignadas.includes(c[0])) {
      div.classList.add("seleccionada");
    }

    div.addEventListener("click", () => {
      div.classList.toggle("seleccionada");
    });

    divCarpetasPopup.append(div);
  });

  const btnGuardar = document.createElement("button");
  const btnCerrar = document.createElement("button");

  btnGuardar.textContent = "Guardar";
  btnCerrar.textContent = "Cerrar";

  btnGuardar.onclick = () => {
    const seleccionadas = Array.from(
      document.querySelectorAll(".carpetaPopup.seleccionada"),
    ).map((el) => (el as HTMLElement).dataset.id!) as string[];

    fetch("guardarNotas_Carpeta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_nota: notaId,
        carpetas: seleccionadas,
      }),
    });

    divCarpetasPopup.style.display = "none";
  };

  btnCerrar.onclick = () => {
    divCarpetasPopup.style.display = "none";
  };

  divCarpetasPopup.append(btnGuardar, btnCerrar);
  divActualizarNota.append(divCarpetasPopup);
}
