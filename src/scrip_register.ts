const inputEmailRegister = document.getElementById(
  "email",
) as HTMLInputElement | null;
const inputPasswordRegister = document.getElementById(
  "password",
) as HTMLInputElement | null;
const inputPassword2Register = document.getElementById(
  "password2",
) as HTMLInputElement | null;

const errorEmailRegister = document.getElementById(
  "errorEmail",
) as HTMLElement | null;
const errorPasswordRegister = document.getElementById(
  "errorPassword",
) as HTMLElement | null;
const errorPassword2Register = document.getElementById(
  "errorPassword2",
) as HTMLElement | null;

const botonRegistrar = document.getElementById(
  "botonRegistrar",
) as HTMLButtonElement | null;

if (
  inputEmailLogin &&
  inputPasswordLogin &&
  inputPassword2Register &&
  errorEmailLogin &&
  errorPasswordLogin &&
  errorPassword2Register &&
  botonRegistrar
) {
  inputEmailLogin.addEventListener("input", () => {
    inputEmailLogin.classList.remove("err");
    errorEmailLogin.style.display = "none";
  });

  inputPasswordLogin.addEventListener("input", () => {
    inputPasswordLogin.classList.remove("err");
    errorPasswordLogin.style.display = "none";
  });

  inputPassword2Register.addEventListener("input", () => {
    inputPassword2Register.classList.remove("err");
    errorPassword2Register.style.display = "none";
  });

  botonRegistrar.addEventListener("click", () => {
    const email = inputEmailLogin.value.trim();
    const password = inputPasswordLogin.value;
    const password2 = inputPassword2Register.value;
    let valido = true;

    if (!email.includes("@") || !email.includes(".")) {
      inputEmailLogin.classList.add("err");
      errorEmailLogin.style.display = "block";
      valido = false;
    }

    if (password.length < 6) {
      inputPasswordLogin.classList.add("err");
      errorPasswordLogin.style.display = "block";
      valido = false;
    }

    if (password !== password2) {
      inputPassword2Register.classList.add("err");
      errorPassword2Register.style.display = "block";
      valido = false;
    }

    if (valido) {
      fetch("register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data: { ok: boolean; msg?: string }) => {
          if (data.ok) {
            window.location.href = "index.html";
          } else {
            errorEmailLogin.textContent = data.msg ?? "Error";
            errorEmailLogin.style.display = "block";
          }
        });
    }
  });
}
