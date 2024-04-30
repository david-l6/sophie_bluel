// Ajout des filtres
const filterSection = document.createElement('div');
filterSection.className = 'filter';
filterSection.innerHTML = `
    <button class="actif">Tous</button>
    <button class="inactif">Objets</button>
    <button class="inactif">Appartements</button>
    <button class="inactif">Hotels & restaurants</button>
`;
const portfolioSection = document.getElementById('portfolio');
const titleElement = portfolioSection.querySelector('h2');
portfolioSection.insertBefore(filterSection, titleElement.nextSibling);

// Récupération des projets
const gallery = document.querySelector('.gallery');
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}
getWorks();

// Affichage des projets
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

// Filtrage des projets
const filterButtons = filterSection.querySelectorAll('button');
filterButtons.forEach(button => {
    button.addEventListener('click', async () => {
        filterButtons.forEach(btn => btn.className = 'inactif');
        button.className = 'actif';
        gallery.innerHTML = '';
        const works = await getWorks();
        works.forEach(work => {
            if (button.textContent === 'Tous' || button.textContent === work.category.name) {
                const workElement = document.createElement('figure');
                workElement.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.category.name+' - '+work.title}">
                    <figcaption>${work.title}</figcaption>
                `;
                gallery.appendChild(workElement);
            }
        });
    });
});