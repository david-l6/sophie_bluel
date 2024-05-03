// Récupération des projets
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}
getWorks();

// Affichage des projets
const gallery = document.querySelector('.gallery');
async function renderWorks() {
    const works = await getWorks();
    works.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.category.name+' - '+work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(workElement);
    });
}
renderWorks();

// Récupération des catégories
async function getFilters() {
    const response = await fetch('http://localhost:5678/api/categories');
    return await response.json();
}
getFilters();

// Affichage des boutons filtres
async function renderFilters() {
    const filters = await getFilters();
    const filterElement = document.querySelector('.filter');
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
            buttonId = e.target.id;
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

// Vérification du token de connexion + mode édition + logout + bouton modifier
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('authToken')) {
        const header = document.querySelector('header');
        header.style.paddingTop = '60px';
        document.querySelector('.edition-banner').style.display = 'block';
        const loginMenuItem = document.querySelector('nav ul li a[href="login.html"]');
        if (loginMenuItem) {
            loginMenuItem.textContent = 'logout';
            loginMenuItem.href = '#';
            loginMenuItem.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            });
        }
        const portfolioSection = document.getElementById('portfolio');
        const filterElement = portfolioSection.querySelector('.filter');
        portfolioSection.removeChild(filterElement);
        const portfolioTitle = document.querySelector('#portfolio h2');
        portfolioTitle.style.marginBottom = '92px';
        const portfolioHeader = document.querySelector('.portfolio-header');
        const editDiv = document.createElement('div');
        editDiv.classList.add('edit');
        editDiv.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <p>modifier</p>
        `;
        portfolioHeader.appendChild(editDiv);
    }
});