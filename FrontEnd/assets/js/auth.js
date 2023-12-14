// Insert paragraphe pour erreur de login
const loginError = document.createElement("p");
loginError.classList.add("loginErrorMessage");

// Récupération du formulaire
const loginForm = document.querySelector(".loginForm");

function login() {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        // Récupération des inputs
        const user = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };

        // stockage sous format stringify
        const userData = JSON.stringify(user);

        // Connexion à l'API et envoi des inputs
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: userData
        });        

        if (response.ok) {
            const validation = await response.json();
            // Stockage du token
            window.sessionStorage.setItem("token", validation.token);
            checkIsLogged();
        }
        else {
            loginError.innerHTML = "Identifiants incorrect.<br />Veuillez vérifier votre e-mail et votre mot de passe.";
            loginForm.insertBefore(loginError, loginForm.childNodes[2]);
        }
    });
};

function checkIsLogged() {
    if (window.sessionStorage.token) window.location.href = "./index.html";
};

login();
checkIsLogged();