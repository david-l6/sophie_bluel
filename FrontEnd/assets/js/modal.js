// Ouverture et fermeture de la modale
document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.querySelector(".edit");
    const modal = document.querySelector(".modal");
    const closeButtons = document.querySelectorAll(".fa-xmark");
    const modal1 = document.querySelector('#modal1');
    const modal2 = document.querySelector('#modal2');
    
    if (!editButton) {
        return;
    }
    
    editButton.addEventListener("click", () => {
        modal.style.display = "block";
        modal1.style.display = "block";
        modal2.style.display = "none";
    });

    closeButtons.forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            modal.style.animation = "fadeOut 0.4s both";
            setTimeout(() => {
                modal.style.display = "none";
                modal.style.animation = ""; 
            }, 400);
        });
    });
    
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.animation = "fadeOut 0.4s both";
            setTimeout(() => {
                modal.style.display = "none";
                modal.style.animation = ""; 
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
        photo.innerHTML += `
        <figure data-id ="${work.id}">
            <img src="${work.imageUrl}" alt="${work.category.name+' - '+work.title}">
            <i class="fa-solid fa-trash-can"></i>
        </figure>`;
    });
}
renderWorks();

//Suppression d'une photo avec l'icone poubelle
const photo = document.querySelector('.photo');
photo.addEventListener('click', async (event) => {
    if (event.target.classList.contains('fa-trash-can')) {
        const figure = event.target.closest('figure');
        const id = figure.dataset.id;
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (response.status === 200) {
            figure.remove();
        }
    }
});
// Trouver comment empecher que la page s'actualise après la suppression d'une photo

// Ajout d'une photo via un formulaire
// Fait un Event listener sur le bouton "Ajouter une photo" et revenir en arrière
const btn = document.querySelector('#ajout_photo');
const modal1 = document.querySelector('#modal1');
const modal2 = document.querySelector('#modal2');
const arrow = document.querySelector('.fa-arrow-left');
btn.addEventListener('click', () => {
    modal1.style.display = 'none';
    modal2.style.display = 'block';
});
arrow.addEventListener('click', () => {
    modal1.style.display = 'block';
    modal2.style.display = 'none';
});

// Chargement des catégorie dans le formulaire
async function getCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    return await response.json();
}
getCategories();

// Affichage des catégories dans le formulaire
const select = document.querySelector('select');
async function renderCategories() {
    const categories = await getCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category.name;
        option.value = category.id;
        select.appendChild(option);
    });
}
renderCategories();

// Affichage de la photo selectionné depuis mon ordinateur dans la div .photo_choisi
const input = document.querySelector('input[type="file"]');
const photoChoisi = document.querySelector('.photo_choisi');
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = () => {
        photoChoisi.innerHTML = `<img src="${reader.result}" alt="photo_choisi">`;
    };
    reader.readAsDataURL(input.files[0]);
});