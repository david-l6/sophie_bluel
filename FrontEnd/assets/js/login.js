const loginForm     = document.querySelector('form');
const errorMessage  = document.querySelector('#login form p');

// Validation de l'adresse e-mail
function validateEmail(email) {
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z0-9._-]+");
    return emailRegExp.test(email);
}

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!validateEmail(email)) {
        errorMessage.textContent = 'Adresse e-mail invalide. Veuillez réessayer.';
        errorMessage.classList.add('login_error');
        return;
    }
    // Envoi des données de connexion au serveur
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Stockage du token de connexion
            localStorage.setItem('authToken', data.token);
            // Redirection vers la page d'accueil
            window.location.href = 'index.html';
        } else {
            // Affichage d'un message d'erreur si l'identifiant ou le mot de passe est incorrect
            errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe.';
            errorMessage.classList.add('login_error');
        }
    })
    .catch(error => {
        // Affichage d'un message d'erreur si la requête a échoué
        console.error('Erreur lors de la requête:', error);
    });
});