const gallery           = document.querySelector('.gallery');
const filterElement     = document.querySelector('.filter');
const header            = document.querySelector('header');
const loginMenuItem     = document.querySelector('nav ul li a[href="login.html"]');
const portfolioSection  = document.getElementById('portfolio');
const portfolioTitle    = document.querySelector('#portfolio h2');
const portfolioHeader   = document.querySelector('.portfolio-header');

// Récupération des projets
async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        // Vérification que la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
        throw error;  // Relance l'erreur pour la gestion en amont
    }
}
getWorks();

// Affichage des projets
async function renderWorks() {
    const works = await getWorks();
    gallery.innerHTML = '';
    works.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.category.name+' - '+work.title}">
            <figcaption>${work.title}</figcaption>`;
        gallery.appendChild(workElement);
    });
}
renderWorks();

// Récupération des catégories
async function getFilters() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Pas besoin d'utiliser await ici, return suffit
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return null; // Ou une valeur par défaut appropriée
    }
}
if (!localStorage.getItem('authToken')) {
    getFilters();
}

// Affichage des boutons filtres
async function renderFilters() {
    const filters = await getFilters();
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.id = '0';
    allButton.classList.add('actif');
    filterElement.insertBefore(allButton, filterElement.firstChild);
    filters.forEach(filter => {
        const filterButton = document.createElement('button');
        filterButton.textContent = filter.name;
        filterButton.id = filter.id;
        filterButton.classList.add('inactif');
        filterElement.appendChild(filterButton);
    });
    const buttons = document.querySelectorAll('.filter button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => {
                btn.classList.remove('actif');
                btn.classList.add('inactif');
            });
            button.classList.remove('inactif');
            button.classList.add('actif');
        });
    });
}
if (!localStorage.getItem('authToken')) {
    renderFilters();
}

// Filtrage des projets
async function filterWorks() {
    const projects = await getWorks();
    const button = document.querySelectorAll('.filter button');
    button.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonId = e.target.id;
            gallery.innerHTML = '';
            projects.forEach(project => {
                if (project.category.id == buttonId) {
                    const workElement = document.createElement('figure');
                    workElement.innerHTML = `
                        <img src="${project.imageUrl}" alt="${project.category.name+' - '+project.title}">
                        <figcaption>${project.title}</figcaption>
                    `;
                    gallery.appendChild(workElement);
                }
                else if (buttonId == 0) {
                    const workElement = document.createElement('figure');
                    workElement.innerHTML = `
                        <img src="${project.imageUrl}" alt="${project.category.name+' - '+project.title}">
                        <figcaption>${project.title}</figcaption>
                    `;
                    gallery.appendChild(workElement);
                }
            });
        });
    });
}
if (!localStorage.getItem('authToken')) {
    filterWorks();
}

// Vérification du token de connexion + affichage bannière, logout et bouton modifier
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('authToken')) {
        header.classList.add('header_padding');
        document.querySelector('.edition-banner').classList.add('block');
        if (loginMenuItem) {
            loginMenuItem.textContent = 'logout';
            loginMenuItem.href = '#';
            loginMenuItem.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
            });
        }
        portfolioSection.removeChild(filterElement);
        portfolioTitle.classList.add('marginBottom_h2');
        const editDiv = document.createElement('div');
        editDiv.classList.add('edit');
        editDiv.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <p>modifier</p>
        `;
        portfolioHeader.appendChild(editDiv);
    }
});