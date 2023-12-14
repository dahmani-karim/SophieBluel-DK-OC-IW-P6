// Déclaration des variables (stockage, comptage, ciblage)
let categories = [];
let works = [];
let categoriesCounter = 0;
let worksCounter = 0;
const filters = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");
const ban = document.querySelector("header");
const loginButton = document.querySelector("[href='./login.html']");

// Connexion à l'API
const responseCategories = await fetch("http://localhost:5678/api/categories");
categories = await responseCategories.json();
categoriesCounter = categories.length;

const responseWorks = await fetch("http://localhost:5678/api/works");
works = await responseWorks.json();
worksCounter = works.length;

// RESET GALLERY
function resetGallery() {
    const cleaner = document.querySelector(".gallery");
    cleaner.innerHTML = "";
}

// Récupération des noms des catégories et construction des boutons de filtres
async function buildCategories() {
        // ajout du bouton TOUS
        const allCatFilter = document.createElement("button");
        allCatFilter.setAttribute("type","button");
        allCatFilter.setAttribute("id", "selectedFilter");
        allCatFilter.setAttribute("data-categoryId",0);
        allCatFilter.classList.add("filter");
        filters.appendChild(allCatFilter);
        allCatFilter.innerText = "Tous";

        // ajout des autres boutons de filtre en fonction des catégories existantes dans l'API
        for (let i = 0; i < categoriesCounter; i++) {
            const newFilter = document.createElement("button");
            newFilter.setAttribute("type","button");
            newFilter.setAttribute("data-categoryId",categories[i].id);
            newFilter.classList.add("filter");
            filters.appendChild(newFilter);
            newFilter.innerText = categories[i].name;
        }
}

// Récupération des travaux et construction de la gallery
async function buildGallery(id=0) {
        for (let i = 0; i < worksCounter; i++) {
            if( works[i].categoryId === id || id === 0) {
                const newWork = document.createElement("figure");
                const newIMG = document.createElement("img");
                const newFigCaption = document.createElement("figcaption");
                gallery.appendChild(newWork);
                newWork.appendChild(newIMG);
                newWork.appendChild(newFigCaption);
                newIMG.setAttribute("src",works[i].imageUrl);
                newFigCaption.innerText = works[i].title;
            }
        }
}

// Utilisation des fonctions d'initialisation
resetGallery();
buildCategories();
buildGallery();

// Filtrer
filters.addEventListener("click", function (event) {
    const activeFilter = document.getElementById("selectedFilter");
    if (event.target.classList.contains("filter")) {
        resetGallery();
        activeFilter.removeAttribute("id");
        event.target.setAttribute("id","selectedFilter");
        buildGallery(Number(event.target.getAttribute("data-categoryId")));       
    };
});

// MODE ÉDITION
function editModePage() {
    if (!window.sessionStorage.token) return;
    else {
        // Création de la bannière
        const editModeBan = document.createElement("banner");
        editModeBan.classList.add("editBan");
        const editIcon = document.createElement("img");
        editIcon.setAttribute("src", "./assets/icons/penWhite.png");
        const banText = document.createElement("p");
        banText.innerText = "Mode édition";
        editModeBan.appendChild(editIcon);
        editModeBan.appendChild(banText);
        const body = document.querySelector("body");
        body.insertBefore(editModeBan, body.childNodes[0]);

        // Création du bouton
        const editIconBlack = document.createElement("img");
        editIconBlack.setAttribute("src", "./assets/icons/penBlack.png");
        const manageButton = document.createElement("a");
        manageButton.classList.add("editButton");
        manageButton.setAttribute("href", "#modal");
        manageButton.innerText = "modifier"
        const projectTitle = document.getElementById("titleMenu");
        projectTitle.appendChild(editIconBlack);
        projectTitle.appendChild(manageButton);

        // Modification du bouton de LOGIN en LOGOUT
        loginButton.innerText ="logout";
        loginButton.setAttribute("href","#");

        // Masquer les filtres
        filters.style = "display:none";

        // LOGOUT - clean sessionStorage (FAIRE UNE FONCTION POUR LA REUTILISER DANS LE IF RETURN)
        loginButton.addEventListener("click", function() {
            window.sessionStorage.removeItem("token");
            filters.style.display= "flex";
            loginButton.innerText ="login";
            loginButton.setAttribute("href","login.html");
            manageButton.style = "display:none";
            editModeBan.style = "display:none";
        });
    }
};

editModePage();

// Menu Management (modal)
const modal = document.querySelector("aside");
const editButton = document.querySelector(".editButton");
const fermer = document.getElementById("close");

editButton.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style = "display:flex";
});

fermer.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style = "display:none";
});

// Ajouter du contenu

// Supprimer du contenu

