let inputEmail = document.getElementById("email");
let inputPassword = document.getElementById("password");
let errorEmail = document.getElementById("errorEmail");
let errorPassword = document.getElementById("errorPassword");
let botonEntrar = document.getElementById("botonEntrar");

inputEmail.addEventListener("input", () => {
  inputEmail.classList.remove("err");
  errorEmail.style.display = "none";
});

inputPassword.addEventListener("input", () => {
  inputPassword.classList.remove("err");
  errorPassword.style.display = "none";
});

botonEntrar.addEventListener("click", () => {
  let email = inputEmail.value.trim();
  let password = inputPassword.value;
  let valido = true;

  if (!email.includes("@") || !email.includes(".")) {
    inputEmail.classList.add("err");
    errorEmail.style.display = "block";
    valido = false;
  }

  if (password.length < 6) {
    inputPassword.classList.add("err");
    errorPassword.style.display = "block";
    valido = false;
  }

  if (valido) {
    fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log(data);
          window.location.href = "notas.php";
        } else {
          errorPassword.textContent = "Correo o contraseña incorrectos.";
          errorPassword.style.display = "block";
        }
      });
  }
});
