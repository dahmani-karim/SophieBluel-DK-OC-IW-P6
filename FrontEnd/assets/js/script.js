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
async function buildGallery(id=0, zone="home") {
        for (let i = 0; i < worksCounter; i++) {
            if( works[i].categoryId === id || id === 0) {
                const newWork = document.createElement("figure");
                const newIMG = document.createElement("img");
                const newFigCaption = document.createElement("figcaption");
                gallery.appendChild(newWork);
                newWork.appendChild(newIMG);
                newWork.appendChild(newFigCaption);
                newIMG.setAttribute("src",works[i].imageUrl);
                newIMG.classList.add("photo");
                newFigCaption.innerText = works[i].title;
                if (zone === "modal") {
                    const removeButton = document.createElement("img");
                    removeButton.classList.add("trash");
                    removeButton.id = "trash"+[i+1];
                    removeButton.setAttribute("src", "./assets/icons/trash.png");
                    newWork.appendChild(removeButton);
                }
            }
        }
}

// Utilisation des fonctions d'initialisation
resetGallery();
buildCategories();
buildGallery(0, "modal");

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
        editIconBlack.id = "blackPen";
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
        filters.classList.add("visibilityHidden");

        // LOGOUT - clean sessionStorage (FAIRE UNE FONCTION POUR LA REUTILISER DANS LE IF RETURN)
        loginButton.addEventListener("click", function() {
            window.sessionStorage.removeItem("token");
            filters.classList.remove("visibilityHidden");
            loginButton.innerText ="login";
            loginButton.setAttribute("href","login.html");
            manageButton.classList.add("visibilityHidden");
            editModeBan.style.display = "none";
        });
    }
};

editModePage();

// Menu Management + navigation (modal)
const modal = document.getElementById("modal");
const editButton = document.querySelector(".editButton");
const closeButton = document.querySelector(".close");
const closeButton2 = document.querySelector(".close2");
const addPicture = document.querySelector(".addPicture");
const backArrow = document.getElementById("goBack");
const step1 = document.querySelector(".step1");
const step2 = document.querySelector(".step2");
//let visibilityStatut = null;

function openModal(e) {
    e.preventDefault();
    modal.style.display = "flex";
    // visibilityStatut = document.getElementById("modal");
    // console.log(visibilityStatut);
    // visibilityStatut.addEventListener("click", closeModal);
}

function closeModal(e) {
    e.preventDefault();
    step2.style.display = "none";
    step1.style.display = "flex";
    modal.style.display = "none";
}

function goToStep2(e) {
    e.preventDefault();
    step1.style.display = "none";
    step2.style.display = "flex";
}

function backToStep1(e) {
    e.preventDefault();
    step2.style.display = "none";
    step1.style.display = "flex";
}

editButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
closeButton2.addEventListener("click", closeModal);
addPicture.addEventListener("click", goToStep2);
backArrow.addEventListener("click", backToStep1);

// Ajouter du contenu

// Supprimer du contenu