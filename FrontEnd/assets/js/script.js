/// VARIABLES
let categories = []
let works = []
let categoriesCounter = 0
let worksCounter = 0
const filters = document.querySelector(".filters")
const gallery = document.getElementById("gallery")
const galleryModal = document.getElementById("galleryModal")
const loginButton = document.getElementById("loginButton")
const loginLink = document.getElementById("loginLink")
const token = window.sessionStorage.token
const modal = document.getElementById("modal")
const closeButton = document.querySelector(".close")
const closeButton2 = document.querySelector(".close2")
const addPicture = document.querySelector(".addPicture")
const backArrow = document.querySelector(".goBack")
const step1 = document.querySelector(".step1")
const step2 = document.querySelector(".step2")

// Fetch catégories
try {
    const responseCategories = await fetch("http://localhost:5678/api/categories")
    if (!responseCategories.ok) throw new Error(`CODE ERREUR: ${responseCategories.status}`)
    categories = await responseCategories.json()
    categoriesCounter = categories.length
}
catch (error) {
    console.log("Le serveur est injoignable, impossible de récupérer les catégories.", error)
}

/// FONCTIONS PRINCIPALES
// Reset gallerie
function resetGallery(zone) {
    zone.innerHTML = ""
}
// Récupération des noms des catégories et construction des boutons de filtres
function buildCategories() {
    // ajout du bouton TOUS
    const allCatFilter = document.createElement("button")
    allCatFilter.setAttribute("type","button")
    allCatFilter.setAttribute("id", "selectedFilter")
    allCatFilter.setAttribute("data-categoryId",0)
    allCatFilter.classList.add("filter")
    filters.appendChild(allCatFilter)
    allCatFilter.innerText = "Tous"

    // ajout des autres boutons de filtre en fonction des catégories existantes dans l'API
    for (let i = 0; i < categoriesCounter; i++) {
        const newFilter = document.createElement("button")
        newFilter.setAttribute("type","button")
        newFilter.setAttribute("data-categoryId",categories[i].id)
        newFilter.classList.add("filter")
        filters.appendChild(newFilter)
        newFilter.innerText = categories[i].name
    }
}
// Récupération des travaux et construction de la gallerie
async function buildGallery(id, zone) {
    // Fetch travaux
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works")
        if (!responseWorks.ok) throw new Error(`CODE ERREUR: ${responseWorks.status}`)
        works = await responseWorks.json()
        worksCounter = works.length
    }
    catch (error) {
        console.log("Le serveur est injoignable, impossible de récupérer les travaux.", error)
    }
    // reset de la gallery
    zone === "home" ? resetGallery(gallery) : resetGallery(galleryModal)
    //ajout des projets
    for (let i = 0; i < worksCounter; i++) {
        if( works[i].categoryId === id || id === 0) {
            const newWork = document.createElement("figure")
            const newIMG = document.createElement("img")
            newWork.appendChild(newIMG)
            newIMG.setAttribute("src",works[i].imageUrl)
            newIMG.setAttribute("alt","photo")
            newIMG.classList.add("photo")
            if (zone === "modal") {
                galleryModal.appendChild(newWork)
                const removeButton = document.createElement("img")
                removeButton.classList.add("trash")
                removeButton.id = "trash"+[i+1]
                removeButton.setAttribute("src", "./assets/icons/trash.png")
                newWork.appendChild(removeButton)
                removeButton.addEventListener("click", function() {
                    deleteWork(works[i].id, token)
                });
            }
            else {
                gallery.appendChild(newWork)
                const newFigCaption = document.createElement("figcaption")
                newWork.appendChild(newFigCaption)
                newFigCaption.innerText = works[i].title
            }
        }
    }
}
// Fonction de filtration de la gallerie
filters.addEventListener("click", function (event) {
    const activeFilter = document.getElementById("selectedFilter")
    const target = event.target
    if (target.classList.contains("filter")) {
        activeFilter.removeAttribute("id")
        target.setAttribute("id","selectedFilter")
        buildGallery(Number(target.getAttribute("data-categoryId")), "home")      
    }
})
// Fonction de passage en mode édition
function editModePage() {
    // Création de la bannière
    const editModeBan = document.createElement("banner")
    editModeBan.classList.add("editBan")
    const editIcon = document.createElement("img")
    editIcon.setAttribute("src", "./assets/icons/penWhite.png")
    editIcon.setAttribute("alt", "crayon blanc")
    const banText = document.createElement("p")
    banText.innerText = "Mode édition"
    editModeBan.appendChild(editIcon)
    editModeBan.appendChild(banText)
    const body = document.querySelector("body")
    body.insertBefore(editModeBan, body.childNodes[0])

    // Création du bouton
    const editIconBlack = document.createElement("img")
    editIconBlack.id = "blackPen"
    editIconBlack.setAttribute("src", "./assets/icons/penBlack.png")
    editIconBlack.setAttribute("alt", "crayon noir")
    const manageButton = document.createElement("a")
    manageButton.classList.add("editButton")
    manageButton.setAttribute("href", "#modal")
    manageButton.innerText = "modifier"
    const projectTitle = document.getElementById("titleMenu")
    projectTitle.appendChild(editIconBlack)
    projectTitle.appendChild(manageButton)
    manageButton.addEventListener("click", openModal)

    // Modification du bouton de LOGIN en LOGOUT
    loginLink.innerText ="logout"
    loginLink.setAttribute("href","#")

    // Masquer les filtres
    filters.classList.add("visibilityHidden")

    // LOGOUT - clean sessionStorage (FAIRE UNE FONCTION POUR LA REUTILISER DANS LE IF RETURN)
    loginButton.addEventListener("click", function() {
        window.sessionStorage.removeItem("token")
        filters.classList.remove("visibilityHidden")
        loginLink.innerText ="login"
        loginLink.setAttribute("href","./login.html")
        manageButton.classList.add("visibilityHidden")
        editIconBlack.classList.add("visibilityHidden")
        editModeBan.classList.add("hide")
    })
}

/// FONCTIONS DE GESTION DE LA MODAL
// Ouverture, Fermeture, Navigation et Formulaire
function createCatList() {
    for (let i = 0; i < categoriesCounter; i++) {
        const optionList = document.getElementById("workCategory")
        const option = document.createElement("option")
        option.setAttribute("value",categories[i].id)
        option.setAttribute("label",categories[i].name)
        optionList.appendChild(option)
    }
}
// Ouverture de la modal
function openModal(e) {
    e.preventDefault()
    buildGallery(0, "modal")
    modal.classList.remove("hide")
    modal.classList.add("show")
}
// Navigation vers l'étape 2 de la modal
function goToStep2(e) {
    e.preventDefault()
    step1.classList.remove("show")
    step1.classList.add("hide")
    step2.classList.remove("hide")
    step2.classList.add("show")
}
// Navigation pour retour à l'étape 1 de la modal
function backToStep1(e) {
    e.preventDefault()
    resetForm()
    step2.classList.remove("show")
    step2.classList.add("hide")
    step1.classList.remove("hide")
    step1.classList.add("show")
}
// Fermeture de la modal
function closeModal(e) {
    resetForm()
    if(e) e.preventDefault()
    step2.classList.remove("show")
    step2.classList.add("hide")
    step1.classList.remove("hide")
    step1.classList.add("show")
    modal.classList.remove("show")
    modal.classList.add("hide")
}

// reset form
function resetForm() {
    previewUpload.src = ""
    document.getElementById("newPic").classList.remove("hide")
    document.querySelector(".customInput").classList.remove("hide")
    document.getElementById("uploadInfo").classList.remove("hide")
    document.getElementById("previewUpload").classList.remove("show")
    document.getElementById("previewUpload").classList.add("hide")
    document.getElementById("workTitle").value = ""
    document.getElementById("workCategory").value = ""
}

/// UTILISATION DES FONCTIONS
// Initialisation
buildCategories()
buildGallery(0, "home")

// Activation du mode édition
if (token) {
    editModePage()
    createCatList()

    // Fermer la modal avec la touche ECHAP
    window.addEventListener('keydown', function(e) {
        if (e.key === "Escape" || e.key === "Esc") closeModal(e)
    })

    // Fermer la modal en cliquant sur le layer
    modal.addEventListener("click", function(e) {
        closeModal(e);
    })

    // Empêcher la fermeture de la modal si le click est dans la fenêtre modal
    const stopPropagation = function(e) {
        e.stopPropagation()
    }

    document.querySelector(".modalWrapper").addEventListener("click", function(e) {
        stopPropagation(e)
    })

    closeButton.addEventListener("click", closeModal)
    closeButton2.addEventListener("click", closeModal)
    addPicture.addEventListener("click", goToStep2)
    backArrow.addEventListener("click", backToStep1)

    // Vérifier le formulaire pour autoriser le submit
    const title = document.getElementById("workTitle")
    const imgToUpload = document.getElementById("submitPic")
    const categorieSelect = document.getElementById("workCategory")
    const submitButton = document.getElementById("uploadValidationForm")

    function checkFields() {
        const isTitleOk = title.value?true:false
        const [file] = imgToUpload.files
        let isPictureOk = file && file.size<32000000 && (file.type==="image/jpg" || file.type==="image/png")?true:false
        let isCategorieOk = categorieSelect.value>0?true:false
        if (isTitleOk && isCategorieOk && isPictureOk) submitButton.removeAttribute("disabled")
        else submitButton.setAttribute("disabled",true)
    }

    imgToUpload.addEventListener("change", checkFields)
    title.addEventListener("input", checkFields)
    categorieSelect.addEventListener("change", checkFields)
    
    // Vérifier l'input file
    imgToUpload.onchange = evt => {
        const [file] = imgToUpload.files
        // Créer la miniature de l'image ajouté
        if (file && file.size<32000000 && (file.type==="image/jpg" || file.type==="image/png")) {
            previewUpload.src = URL.createObjectURL(file)
            document.getElementById("newPic").classList.add("hide")
            document.querySelector(".customInput").classList.add("hide")
            document.getElementById("uploadInfo").classList.add("hide")
            document.getElementById("previewUpload").classList.remove("hide")
            document.getElementById("previewUpload").classList.add("show")
            if (document.querySelector(".uploadError")) {
                document.querySelector(".uploadError").classList.remove("show")
                document.querySelector(".uploadError").classList.add("hide")
            }
        }
        // Afficher un message d'erreur
        else {
            if (!document.querySelector(".uploadError")) {
                const uploadError = document.createElement("span")
                uploadError.classList.add("uploadError")
                document.querySelector(".addingBox").appendChild(uploadError)
                uploadError.innerHTML = "Format incorrect ou trop lourd."
                document.querySelector(".uploadError").classList.add("show")
            }
        }
    };

    // Ajouter du contenu
    async function addWork() {
        const id = Number(categorieSelect.value)

        const formData = new FormData()
        formData.append("image", imgToUpload.files[0])
        formData.append("title", title.value)
        formData.append("category", id)

        let add;
        try {
            add = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            })

            if (!add.ok) throw new Error(`CODE ${add.status}`)

            alert("Nouvel élément ajouté avec succès !")
        }
        catch (error) {
            if (add.status===400) console.log(error+" Mauvaise Requête")
            if (add.status===401) alert(error+" Accès Refusé")
            if (add.status===500) console.log(error+" Serveur Indisponible")
        }

        closeModal()
        buildGallery(0, "home")

    }

    submitButton.addEventListener("click", addWork)
}

// Supprimer du contenu
async function deleteWork(id, token) {
    let deleted;
    try {
        deleted = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${token}`
            },
        })

        if (!deleted.ok) throw new Error(`CODE ${deleted.status}`)

        alert("Élément supprimé avec succès !")
    }
    catch (error) {
        if (deleted.status===401) console.log(error+" Accès Refusé")
        if (deleted.status===500) console.log(error+" Serveur Indisponible")
    }
    buildGallery(0, "home")
}