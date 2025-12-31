"use strict"
// my nasa api key cuab43PjMvuDWgqtiOa2U2nCGd8NoHVDl02FDtO7
// WRITE YOUR JS CODE HERE
// get buttons so we can control pages
const launchesButton = document.querySelector("a[data-section='launches']");
const planetsButton = document.querySelector("a[data-section='planets']");
const todayInSpaceButton = document.querySelector(
    "a[data-section='today-in-space']"
);

const buttons = [launchesButton, planetsButton, todayInSpaceButton];

// get pages so we can show and hide them

const launchesPage = document.getElementById("launches");
const planetsPage = document.getElementById("planets");
const todayInSpacePage = document.getElementById("today-in-space");

const pages = [launchesPage, planetsPage, todayInSpacePage];

// get full resolution button
const fullResolutionButton = document.querySelector("#apod-image-container button");
let fullResolutionSrc = document.getElementById("apod-image").getAttribute("src");
// get everything in apod section
const apodImage = document.getElementById("apod-image");
const apodLoading = document.getElementById("apod-loading");
const apodTitle = document.getElementById("apod-title");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodDateInfo = document.getElementById("apod-date-info")
const apodMediaType = document.getElementById("apod-media-type")

// give nav button some magic
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        handelPages(e.currentTarget);
        handelButtons(e.currentTarget);
    });
});

// handel the page that will be visible and hide the others
function handelPages(button) {
    pages.forEach((page) => {
        let condition =
            button.getAttribute("data-section") === page.getAttribute("id");
        page.classList.toggle("hidden", !condition);
    });
}

// change the button regarding which one is active
function handelButtons(button) {
    button.classList.replace("text-slate-300", "bg-blue-500/10");
    button.classList.replace("hover:bg-slate-8000", "text-blue-400");
    buttons.forEach((innerButton) => {
        if (innerButton !== button) {
            innerButton.classList.replace("bg-blue-500/10", "text-slate-300");
            innerButton.classList.replace(
                "text-blue-400",
                "hover:bg-slate-8000"
            );
        }
    });
}

// give full resolution button some magic
fullResolutionButton.addEventListener("click", (e) => {
    console.log(apodImage);
})

async function getTodaySpace() {
    apodLoading.classList.remove("hidden");
    apodImage.classList.add("hidden");
    let reponse = await fetch("https://api.nasa.gov/planetary/apod?api_key=cuab43PjMvuDWgqtiOa2U2nCGd8NoHVDl02FDtO7");
    let data = await reponse.json();
    apodLoading.classList.add("hidden");
    apodImage.setAttribute("src", data.url);
    apodImage.classList.remove("hidden");
    apodTitle.innerText = data.title;
    apodDateDetail.innerText = data.date;
    apodExplanation.innerText = data.explanation;
    apodCopyright.innerHTML = `&copy; ${data.copyright.trim()}`;
    apodDateInfo.innerText = data.date;
    apodMediaType.innerText = data.media_type;
    fullResolutionSrc = data.hdurl;
}

getTodaySpace();