// =========================
// OFFICIAL SITE POPUP
// =========================

const popupOverlay = document.getElementById("officialPopupOverlay");
const popupClose = document.getElementById("popupClose");

// CHANGE THIS LATER
const redirectURL = "https://example.com";

// Popup only once per visit
if (!sessionStorage.getItem("officialPopupShown")) {

    window.addEventListener("load", () => {

        setTimeout(() => {
            popupOverlay.classList.add("show");
        }, 700);

        sessionStorage.setItem("officialPopupShown", "true");

    });

}

// Close popup
popupClose.addEventListener("click", () => {
    popupOverlay.classList.remove("show");
});

// OPTIONAL AUTO REDIRECT
// Uncomment later when official site launches

/*
setTimeout(() => {
    window.location.href = redirectURL;
}, 10000);
*/
