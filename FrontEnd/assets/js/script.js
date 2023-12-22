// Déclaration des variables (stockage, comptage, ciblage)
let categories = [];
let works = [];
let categoriesCounter = 0;
let worksCounter = 0;
const filters = document.querySelector(".filters");
const gallery = document.getElementById("gallery");
const galleryModal = document.getElementById("galleryModal");
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
function resetGallery(zone) {
    zone.innerHTML = "";
}

// Récupération des noms des catégories et construction des boutons de filtres
async function buildCategories(zone="home") {
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
async function buildGallery(id, zone) {
        for (let i = 0; i < worksCounter; i++) {
            if( works[i].categoryId === id || id === 0) {
                const newWork = document.createElement("figure");
                const newIMG = document.createElement("img");
                newWork.appendChild(newIMG);
                newIMG.setAttribute("src",works[i].imageUrl);
                newIMG.classList.add("photo");
                if (zone === "modal") {
                    galleryModal.appendChild(newWork);
                    const removeButton = document.createElement("img");
                    removeButton.classList.add("trash");
                    removeButton.id = "trash"+[i+1];
                    removeButton.setAttribute("src", "./assets/icons/trash.png");
                    newWork.appendChild(removeButton);
                    removeButton.addEventListener("click", function() {
                        deleteWork(works[i].id, window.sessionStorage.token);
                    });
                }
                else {
                    gallery.appendChild(newWork);
                    const newFigCaption = document.createElement("figcaption");
                    newWork.appendChild(newFigCaption);
                    newFigCaption.innerText = works[i].title;
                }
            }
        }
}

// Utilisation des fonctions d'initialisation
resetGallery(gallery);
buildCategories();
buildGallery(0, "home");

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

function createCatList() {
    for (let i = 0; i < categoriesCounter; i++) {
        const optionList = document.getElementById("workCategory");
        const option = document.createElement("option");
        option.setAttribute("value",categories[i].id);
        option.innerText = categories[i].name;
        optionList.appendChild(option);
    }
}
createCatList();

function openModal(e) {
    e.preventDefault();
    resetGallery(galleryModal);
    buildGallery(0, "modal");
    modal.style.display = "flex";
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

if (window.sessionStorage.token) {
    editButton.addEventListener("click", openModal);
}

closeButton.addEventListener("click", closeModal);
closeButton2.addEventListener("click", closeModal);
addPicture.addEventListener("click", goToStep2);
backArrow.addEventListener("click", backToStep1);

/// Ajouter du contenu
//preview new upload image in form
let newImgUpload = document.getElementById("submitPic");

newImgUpload.onchange = evt => {
    const [file] = newImgUpload.files;
    if (file) {
        previewUpload.src = URL.createObjectURL(file);
        document.getElementById("newPic").style.display = "none";
        document.querySelector(".customInput").style.display = "none";
        document.getElementById("uploadInfo").style.display = "none";
        document.getElementById("previewUpload").style.display = "flex";
    }
}

//authorize submit only when form is not empty
document.getElementById("workCategory").onchange = evt => {
    const title = document.getElementById("workTitle").value;
    const category = document.getElementById("workCategory").value;
    const submitButton = document.getElementById("uploadValidationForm");

    if(title && category>0) {
        submitButton.removeAttribute("id");
        submitButton.classList.add("validPicture");
    }
    else if (category<1 || !title) {
        alert("Veuillez renseigner les champs du formulaire");
    }
}

let newWorkLocal = {};
let newWork = {};

function addWork() {
    const id = Number(document.getElementById("workCategory").value);

    newWork = {        
        "image": newImgUpload.files[0],
        "title": document.getElementById("workTitle").value,
        "category": id,
    }
console.log(newWork)
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization":`Bearer ${window.sessionStorage.token}`
        },
        body: JSON.stringify(newWork),
    });
/*-
    newWorkLocal = {
        "id": Number(works.length+1),
        "title": document.getElementById("workTitle").value,
        "imageUrl": previewUpload.src,
        "categoryId": id,
        "userId": 1,
        "category": {
            "id": id,
            "name": document.getElementById("workCategory").options[document.getElementById("workCategory").selectedIndex].text
        }
    };
    works.push(newWorkLocal); // pour sauvegarde locale
-*/
    newWorkLocal = {};
    newWork = {};
    previewUpload.src = "#";

    document.getElementById("newPic").removeAttribute("style");
    document.querySelector(".customInput").removeAttribute("style");
    document.getElementById("uploadInfo").removeAttribute("style");
    document.getElementById("previewUpload").style.display ="none";
    document.querySelector(".validPicture").setAttribute("id", "uploadValidationForm");
    document.querySelector(".validPicture").classList.remove("validPicture");
    document.getElementById("workTitle").value = "";
    document.getElementById("workCategory").value = "";

    step2.style.display = "none";
    step1.style.display = "flex";
    modal.style.display = "none";

    console.table(works);
};

document.getElementById("uploadValidationForm").addEventListener("click", addWork);

// Supprimer du contenu
function deleteWork(id, token) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${window.sessionStorage.token}`
        },
    });
}