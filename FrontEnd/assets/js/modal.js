// Ouverture et fermeture de la modale
document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.querySelector(".edit");
    const modal = document.querySelector(".modal");
    const closeButton = modal.querySelector(".fa-xmark");
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
