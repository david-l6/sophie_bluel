// Ouverture et fermeture de la modale
document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.querySelector(".edit");
    const modal = document.querySelector(".modal");
    const closeButton = modal.querySelector(".fa-xmark");
    if (!editButton) {
        return;
    }
    editButton.addEventListener("click", () => {
        modal.style.display = "block";
    });
    closeButton.addEventListener("click", () => {
        modal.style.animation = "fadeOut 0.4s both";
        setTimeout(() => {
            modal.style.display = "none";
            modal.style.animation = ""; // 
        }, 400);
    });
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.animation = "fadeOut 0.4s both";
            setTimeout(() => {
                modal.style.display = "none";
                modal.style.animation = ""; // 
            }, 400);
        }
    });
});

// Récupération des photos
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}
getWorks();

// Affichage des photos avec l'icone poubelle
async function renderWorks() {
    const works = await getWorks();
    const photo = document.querySelector('.photo');
    works.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.category.name+' - '+work.title}">
            <i class="fa-solid fa-trash-can"></i>
        `;
        photo.appendChild(workElement);
    });
}
renderWorks();

//Suppression d'une photo avec l'icone poubelle http://localhost:5678/api/works/{id}
