const photo             = document.querySelector('.photo');
const btn               = document.querySelector('#ajout_photo');
const modal1            = document.querySelector('#modal1');
const modal2            = document.querySelector('#modal2');
const arrow             = document.querySelector('.fa-arrow-left');
const select            = document.querySelector('select');
const photoChoisi       = document.querySelector('.photo_choisie');
const ajoutPhoto        = document.querySelector('.ajout_photo');
const input             = document.querySelector('input[type="file"]');
const form              = document.querySelector('form');
const btnValider        = document.querySelector('#valider');
const photoAjoute       = document.querySelector('#photo');
const titre             = document.querySelector('#titre');
const categorie         = document.querySelector('#categorie');

// Ouverture et fermeture de la modale
document.addEventListener("DOMContentLoaded", () => {
    const editButton    = document.querySelector(".edit");
    const modal         = document.querySelector(".modal");
    const closeButtons  = document.querySelectorAll(".fa-xmark");
    const modal1        = document.querySelector('#modal1');
    const modal2        = document.querySelector('#modal2');
    if (!editButton) {
        return;
    }
    editButton.addEventListener("click", () => {
        modal.classList.add("block");
        modal1.classList.remove("none");
        modal1.classList.add("block");
        modal2.classList.remove("block");
        modal2.classList.add("none");
    });
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            modal.classList.add("modal_animation");
            setTimeout(() => {
                modal.classList.remove("block");
                modal.classList.remove("modal_animation");
            }, 400);
        });
    });
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.classList.add("modal_animation");
            setTimeout(() => {
                modal.classList.remove("block");
                modal.classList.remove("modal_animation");
            }, 400);
        }
    });
});

// Récupération des photos
async function getModalWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        // Vérification de la réponse pour les erreurs HTTP
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des travaux :', error);
    }
}

// Affichage des photos avec l'icone poubelle
async function renderModalWorks() {
    const works = await getModalWorks();
    photo.innerHTML = "";
    works.forEach(work => {
        photo.innerHTML += `
        <figure data-id ="${work.id}">
            <img src="${work.imageUrl}" alt="${work.category.name+' - '+work.title}">
            <i class="fa-solid fa-trash-can"></i>
        </figure>`;
    });
}
if (localStorage.getItem('authToken')) {
    renderModalWorks();
}

// Suppression d'une photo avec l'icone poubelle
document.querySelector('.photo').addEventListener('click', async (event) => {
    // Vérifie si l'élément cliqué contient la classe 'fa-trash-can'
    if (event.target.classList.contains('fa-trash-can')) {
        // Récupère l'élément figure le plus proche et son ID
        const figureElement = event.target.closest('figure');
        const workId = figureElement.dataset.id;

        try {
            // Envoie une requête DELETE à l'API pour supprimer l'élément
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            // Vérifie si la suppression a été réussie
            if (response.ok) {
                // Supprime l'élément figure du DOM
                figureElement.remove();
                // alert('Projet supprimé avec succès !');
                
                // Rafraîchit les travaux dans la modal et sur la page
                await getModalWorks();
                await getWorks();
                renderWorks();
            } else {
                // Gère les erreurs de la réponse
                console.error(`Erreur lors de la suppression: ${response.statusText}`);
            }
        } catch (error) {
            // Gère les erreurs de réseau ou autres exceptions
            console.error('Erreur lors de la requête de suppression:', error);
        }
    }
});

// Navigation entre les modales
btn.addEventListener('click', () => {
    modal1.classList.remove('block');
    modal1.classList.add('none');
    modal2.classList.remove('none');
    modal2.classList.add('block');
});
arrow.addEventListener('click', () => {
    modal1.classList.remove('none');
    modal1.classList.add('block');
    modal2.classList.remove('block');
    modal2.classList.add('none');
});

// Chargement des catégorie dans le formulaire
async function getCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

// Affichage des catégories dans le formulaire
async function renderCategories() {
    const categories = await getCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category.name;
        option.value = category.id;
        select.appendChild(option);
    });
}
if (localStorage.getItem('authToken')) {
    renderCategories();
}

// Affichage de la photo selectionné depuis mon ordinateur dans la div .photo_choisi
input.addEventListener('change', () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        photoChoisi.classList.remove('none');
        photoChoisi.classList.add('block');
        photoChoisi.innerHTML = `<img src="${reader.result}" alt="photo">`;
        ajoutPhoto.classList.remove('flex');
        ajoutPhoto.classList.add('none');
    };
    reader.readAsDataURL(file);
});

// Si tout les champs du formulaire sont remplis, alors activé le bouton "Valider"
btnValider.disabled = true;
form.addEventListener('input', () => {
    if (titre.value !== "" && categorie.value > 0 && photoAjoute.value !== "") {
        btnValider.disabled = false;
        btnValider.classList.add('bouton_actif');
    } else {
        btnValider.disabled = true;
        btnValider.classList.remove('bouton_actif');
    }
});

// Envoie du formulaire pour ajouter une photo lors du click sur le bouton "Valider"
btnValider.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        // Préparation des données du formulaire
        let data = new FormData();
        data.append('image', input.files[0]);
        data.append('title', titre.value);
        data.append('category', categorie.value);
        
        // Envoie de la requête POST
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: data
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // alert('Projet ajouté avec succès !');

        // Réinitialisation du formulaire et des éléments d'interface
        titre.value = "";
        categorie.value = 0;
        input.value = "";
        photoChoisi.classList.remove('block');
        photoChoisi.classList.add('none');
        ajoutPhoto.classList.remove('none');
        ajoutPhoto.classList.add('flex');
        btnValider.disabled = true;
        btnValider.classList.remove('bouton_actif');

        // Mise à jour de l'interface utilisateur
        await Promise.all([renderWorks(), renderModalWorks()]);

    } catch (error) {
        console.error('Error:', error);
    }
});