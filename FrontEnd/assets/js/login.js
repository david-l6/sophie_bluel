document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    function validateEmail(email) {
        let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z0-9._-]+");
        return emailRegExp.test(email);
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!validateEmail(email)) {
            const errorMessage = document.querySelector('#login form p');
            errorMessage.textContent = 'Adresse e-mail invalide. Veuillez réessayer.';
            errorMessage.style.color = 'red';
            return;
        }

        console.log('Envoi des données:', { email, password });

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
            console.log('Réponse du serveur:', data);
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } else {
                const errorMessage = document.querySelector('#login form p');
                errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe.';
                errorMessage.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la requête:', error);
        });
    });
});