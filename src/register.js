let inputEmail = document.getElementById("email");
let inputPassword = document.getElementById("password");
let inputPassword2 = document.getElementById("password2");
let errorEmail = document.getElementById("errorEmail");
let errorPassword = document.getElementById("errorPassword");
let errorPassword2 = document.getElementById("errorPassword2");
let botonRegistrar = document.getElementById("botonRegistrar");

inputEmail.addEventListener("input", () => {
  inputEmail.classList.remove("err");
  errorEmail.style.display = "none";
});

inputPassword.addEventListener("input", () => {
  inputPassword.classList.remove("err");
  errorPassword.style.display = "none";
});

inputPassword2.addEventListener("input", () => {
  inputPassword2.classList.remove("err");
  errorPassword2.style.display = "none";
});

botonRegistrar.addEventListener("click", () => {
  let email = inputEmail.value.trim();
  let password = inputPassword.value;
  let password2 = inputPassword2.value;
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

  if (password !== password2) {
    inputPassword2.classList.add("err");
    errorPassword2.style.display = "block";
    valido = false;
  }

  if (valido) {
    fetch("register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          window.location.href = "index.html";
        } else {
          errorEmail.textContent = data.msg;
          errorEmail.style.display = "block";
        }
      });
  }
});
