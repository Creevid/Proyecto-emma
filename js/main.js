/*!
 * Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
 */
//
// Scripts
//

import { FirebaseManage } from "./firebase.js";

window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    const logo = document.body.querySelector("#logo");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0 && window.innerWidth > 992) {
      navbarCollapsible.classList.remove("navbar-shrink");
      logo.setAttribute("src", "../assets/white-logo.png");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
      logo.setAttribute("src", "../assets/black-logo.png");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // User Validation
  const user = sessionStorage.getItem("MY_USER");
  if (user != null) {
    hideAndShowElements();
  }

  // Show Notifications from ContactUs
  if (window.location.pathname === "/pages/notifications.html") {
    showNotifications();
  }

  // Show News on News Page
  if (window.location.pathname === "/pages/news.html") {
    showNews();
  }

  if (window.location.pathname === "/pages/full-news.html") {
    showNewsDetail();
  }

  // Add EventListener on Admin News Page
  if (window.location.pathname === "/pages/admin-news.html") {
    const adminNewsForm = document
      .querySelector("#news-form")
      .addEventListener("submit", (event) => saveNewsData(event));
  }

  if (window.location.pathname === "/pages/profile.html") {
    const changePasswordBtn = document
      .querySelector("#changePassword")
      .addEventListener("click", () => changePassword());
    const loggedUser = document.querySelector("#loggedUser");
    loggedUser.textContent = JSON.parse(user).user.email;
  }
});

window.addEventListener("resize", () => {
  const logo = document.querySelector("#logo");
  if (window.scrollY === 0 && window.innerWidth > 992) {
    logo.setAttribute("src", "../assets/white-logo.png");
  } else {
    logo.setAttribute("src", "../assets/black-logo.png");
  }
});

const loginModal = async () => {
  Swal.fire({
    iconHtml: '<i class="bi bi-person-fill"></i>',
    iconColor: "#0d48a1",
    title: "Iniciar Sesión",
    html:
      '<button class="custom-close-button" onclick="Swal.close()"><i class="bi bi-x"></i></button>' +
      '<form id="loginForm" class="needs-validation" novalidate>' +
      '<div class="mb-3">' +
      '<label for="email" class="form-label">Correo Electrónico</label>' +
      '<input type="email" class="form-control" id="email" name="email" required>' +
      '<div class="invalid-feedback">Por favor, ingrese un correo electrónico válido.</div>' +
      "</div>" +
      '<div class="mb-3">' +
      '<label for="password" class="form-label">Contraseña</label>' +
      '<input type="password" class="form-control" id="password" name="password" required>' +
      '<div class="invalid-feedback">Por favor, ingrese una contraseña.</div>' +
      "</div>" +
      "</form>",
    showCancelButton: true,
    confirmButtonText: "Ingresar",
    confirmButtonColor: "#0d47a1",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    preConfirm: async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailInput = Swal.getPopup().querySelector("#email");
      let password = Swal.getPopup().querySelector("#password").value;
      let email = emailInput.value.trim();

      if (!emailRegex.test(email)) {
        emailInput.classList.add("is-invalid");
        Swal.showValidationMessage("Correo Electrónico Inválido.");
        return false;
      }

      if (!password) {
        Swal.showValidationMessage("Ingrese una Contraseña.");
        return false;
      }

      try {
        const account = new FirebaseManage();
        account
          .authenticate(email, password)
          .then((usr) => {
            if (usr) {
              sessionStorage.setItem("MY_USER", JSON.stringify(usr));
              hideAndShowElements();
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Ha ocurrido un error!",
              text: error.message,
              icon: "error",
            });
          });
        return true;
      } catch (error) {
        Swal.showValidationMessage(
          "Credenciales inválidas. Verifique su correo y contraseña."
        );
        return false;
      }
    },
    customClass: {
      closeButton: "custom-close-button",
    },
  });
};

const logout = () => {
  try {
    try {
      Swal.fire({
        title: "¿Seguro que desea salir?",
        text: "Si cierra sesión no podrá seguir administrando el portal.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "¡Si, salir!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const account = new FirebaseManage();
          account.signOut().then(() => hideAndShowElements());
          window.location.href = "/";
        }
      });
    } catch (error) {
      console.error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Ha ocurrido un error: ", error);
    return false;
  }
};

const changePassword = async () => {
  const { value: email } = await Swal.fire({
    title: "Cambiar Contraseña",
    input: "email",
    inputLabel: "Ingresar correo electrónico",
    inputPlaceholder: "ejemplo@emma.edu",
    confirmButtonText: "Enviar",
    inputAttributes: {
      autocapitalize: "off",
      autocorrect: "off",
    },
  });
  if (email) {
    const account = new FirebaseManage();
    account.resetPassword(email);
  }
};

const hideAndShowElements = () => {
  const user = sessionStorage.getItem("MY_USER");
  const profileMenu = document.querySelector("#profile");
  const loginBtn = document.querySelector("#login-btn");
  profileMenu.classList.toggle("d-none");
  loginBtn.classList.toggle("d-none");
};

const showNotifications = () => {
  const db = new FirebaseManage();
  db.showContactUsData().then((data) => {
    const container = document.querySelector("#notifications");
    data.forEach((notification) => {
      const card = document.createElement("div");
      card.classList.add("col-lg-3", "col-md-6", "mb-4");
      // card.style.cursor = "pointer";
      card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">
            <i class="bi bi-person-fill"></i> ${notification.fullName}
          </h5>
          <h6 class="card-subtitle mb-2 text-muted">
            <i class="bi bi-envelope-fill"></i> <a href="mailto:${notification.email}">${notification.email}</a>
          </h6>
          <p class="card-text">
            <i class="bi bi-phone-fill"></i> ${notification.phone}
          </p>
          <p class="card-text">
            <i class="bi bi-chat-left-dots-fill"></i> "${notification.message}"
          </p>
          <p class="card-text">
            <i class="bi bi-clock-fill"></i> <small class="text-muted">${notification.date}</small>
          </p>
        </div>
      </div>
    `;

      container.appendChild(card);
    });
  });
};

const showNews = () => {
  const db = new FirebaseManage();
  db.showNewsData().then((data) => {
    const cardContainer = document.querySelector("#news-container");
    const cardTemplate = document.querySelector("#cardTemplate");
    console.log("NewsData: ", data);
    data.forEach((news) => {
      // Clonar el template del card
      const cardClone = cardTemplate.content.cloneNode(true);
      // Obtener referencias a los elementos del card
      const card = cardClone.querySelector(".news-card");
      const cardImage = cardClone.querySelector(".news-card-image");
      const cardTitle = cardClone.querySelector(".card-title");
      const cardContentPreview = cardClone.querySelector(".content-preview");
      const cardAuthor = cardClone.querySelector(".card-author");
      const cardDate = cardClone.querySelector(".card-date");
      const cardBtn = cardClone.querySelector(".show-more");

      // Establecer los valores del card
      card.style.Height = "210px";
      cardImage.src = news.frontImage;
      cardTitle.textContent = news.title;
      cardContentPreview.textContent = `${news.content.substring(0, 100)}...`;
      cardAuthor.textContent = news.author;
      cardDate.textContent = `${news.date} (${news.hour})`;
      cardBtn.setAttribute("href", `./full-news.html?id=${news.id}`);

      // Agregar el card al contenedor
      cardContainer.appendChild(cardClone);
    });
  });
};

const showNewsDetail = async () => {
  const db = new FirebaseManage();
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("id");
  db.showNewsDataById(newsId).then((data) => {
    console.log(data);
    const newsHeader = document.querySelector("#news-header");
    const newsTitle = document.querySelector("#news-title");
    const newsDetail = document.querySelector("#news-detail");
    const newsContainer = document.querySelector("#news-container");

    newsHeader.style.backgroundImage = `url("${data.frontImage}")`;
    newsTitle.textContent = data.title;
    newsDetail.innerHTML = `<p>${data.author}</p><p>${data.date} (${data.hour})</p>`;
    newsContainer.innerHTML = `<p>${data.content}</p>`;
  });
};

const saveNewsData = async (event) => {
  event.preventDefault();
  const form = event.target;
  const author = form.elements["author"].value;
  const title = form.elements["title"].value;
  const content = form.elements["content"].value;
  const frontImageFile = form.elements["frontImage"].files[0];
  const date = new Date().toLocaleDateString("es-ES");
  const hour = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const addZero = (num) => (num < 10 ? `0${num}` : num);
  const hourFormatted =
    addZero(new Date().getHours()) +
    ":" +
    addZero(new Date().getMinutes()) +
    (new Date().getHours() < 12 ? "AM" : "PM");

  const db = new FirebaseManage();
  const frontImageUrl = await db.saveImageOnStorage(frontImageFile);
  await db.sendNewsData({
    author: author,
    title: title,
    content: content,
    frontImage: frontImageUrl,
    date: date,
    hour: hourFormatted,
  });

  form.reset();
  Swal.fire({
    title: "Excelente!",
    text: "Noticia Creada Correctamente",
    icon: "success",
  });
};

const loginModalBtn = document
  .querySelector("#login-btn")
  .addEventListener("click", () => loginModal());

const logoutBtn = document
  .querySelector("#logout")
  .addEventListener("click", () => logout());
