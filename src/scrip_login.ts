const inputEmailLogin = document.getElementById("email") as HTMLInputElement;
const inputPasswordLogin = document.getElementById(
  "password",
) as HTMLInputElement;

const errorEmailLogin = document.getElementById("errorEmail") as HTMLElement;
const errorPasswordLogin = document.getElementById(
  "errorPassword",
) as HTMLElement;

const botonEntrar = document.getElementById("botonEntrar") as HTMLButtonElement;

// =====================
// INPUT EMAIL
// =====================
inputEmailLogin.addEventListener("input", () => {
  inputEmailLogin.classList.remove("err");
  errorEmailLogin.style.display = "none";
});

// =====================
// INPUT PASSWORD
// =====================
inputPasswordLogin.addEventListener("input", () => {
  inputPasswordLogin.classList.remove("err");
  errorPasswordLogin.style.display = "none";
});

// =====================
// LOGIN
// =====================
botonEntrar.addEventListener("click", () => {
  const email = inputEmailLogin.value.trim();
  const password = inputPasswordLogin.value;

  let valido = true;

  // reset errores
  errorEmailLogin.style.display = "none";
  errorPasswordLogin.style.display = "none";

  // =====================
  // VALIDACIÓN EMAIL
  // =====================
  if (!email.includes("@") || !email.includes(".")) {
    inputEmailLogin.classList.add("err");
    errorEmailLogin.style.display = "block";
    valido = false;
  }

  // =====================
  // VALIDACIÓN PASSWORD
  // =====================
  if (password.length < 6) {
    inputPasswordLogin.classList.add("err");
    errorPasswordLogin.style.display = "block";
    valido = false;
  }

  // =====================
  // FETCH LOGIN
  // =====================
  if (valido) {
    fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data: { ok: boolean }) => {
        if (data.ok) {
          window.location.href = "notas.php";
        } else {
          errorPasswordLogin.textContent = "Correo o contraseña incorrectos.";
          errorPasswordLogin.style.display = "block";
        }
      });
  }
});
