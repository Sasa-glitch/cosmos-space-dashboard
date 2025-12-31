"use strict";
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
const fullResolutionButton = document.querySelector(
    "#apod-image-container button"
);
let fullResolutionSrc = document
    .getElementById("apod-image")
    .getAttribute("src");
// get everything in apod section
const apodImage = document.getElementById("apod-image");
const apodLoading = document.getElementById("apod-loading");
const apodTitle = document.getElementById("apod-title");
const apodDate = document.getElementById("apod-date");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodDateInfo = document.getElementById("apod-date-info");
const apodMediaType = document.getElementById("apod-media-type");

// get date input and its button so we can change it later
const apodDateInput = document.getElementById("apod-date-input");
const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");

// create a time object for today's date
let todaysDate = new Date();
apodDateInput.valueAsDate = todaysDate;

// get all planet cards
const planetCards = document.querySelectorAll(".planet-card");

// 1-00 starting nasa today section

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
    window.open(fullResolutionSrc, "_blank");
});

async function getTodaySpace() {
    try {
        startLoading();
        let response = await fetch(
            "https://api.nasa.gov/planetary/apod?api_key=cuab43PjMvuDWgqtiOa2U2nCGd8NoHVDl02FDtO7"
        );
        if (response.status > 299 || response.status < 199) {
            throw new Error(
                "An error happened please check your internet \n and make sure you choiced a date after 1995-06-16"
            );
        }
        let data = await response.json();
        endLoading();
        handelHtml(data);
        handelDate();
    } catch (error) {
        apodLoading.innerHTML = error;
    }
}

function handelHtml(data) {
    apodImage.setAttribute("src", data.url);
    apodImage.setAttribute("alt", data.title);
    apodTitle.innerText = data.title;
    apodDate.innerText = `Astronomy Picture of the Day - ${new Date(
        data.date
    ).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })}`;
    apodDateDetail.innerText = data.date;
    apodExplanation.innerText = data.explanation;
    data.copyright
        ? (apodCopyright.innerHTML = `&copy; ${data.copyright.trim()}`)
        : `&copy; NASA/JPL`;
    apodDateInfo.innerText = data.date;
    apodMediaType.innerText = data.media_type;
    fullResolutionSrc = data.hdurl;
}

function startLoading() {
    apodLoading.classList.remove("hidden");
    apodImage.classList.add("hidden");
    apodTitle.innerText = "loading....";
    apodDate.innerText = "loading...";
    apodDateDetail.innerText = "loading...";
    apodExplanation.innerText = "loading...";
    apodCopyright.innerText = "loading...";
    apodDateInfo.innerText = "loading...";
}

function endLoading() {
    apodLoading.classList.add("hidden");
    apodImage.classList.remove("hidden");
}

// so when loading we can start with today space from Nasa
getTodaySpace();

function handelDate(theDayDate = todaysDate) {
    document.querySelector(
        "label[for='apod-date-input'] span"
    ).innerText = `${theDayDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;
}

// give load button some magic
loadDateBtn.addEventListener("click", loadDate);

// make load function
async function loadDate() {
    try {
        startLoading();
        let response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=cuab43PjMvuDWgqtiOa2U2nCGd8NoHVDl02FDtO7&date=${apodDateInput.value}`
        );
        if (response.status > 299 || response.status < 199) {
            throw new Error(
                "An error happened please check your internet \n and make sure you choiced a date after 1995-06-16"
            );
        }
        let data = await response.json();
        endLoading();
        handelHtml(data);
    } catch (error) {
        apodLoading.innerHTML = error;
    }
}

// give today button magic
todayApodBtn.addEventListener("click", getTodaySpace);

// make the apodDateInput work
apodDateInput.addEventListener("input", (_) => {
    handelDate(apodDateInput.valueAsDate);
});

// 2-00 upcoming lanuches

// fetch next 10 upcoming trips

async function fetchUpcoming() {
    const response = await fetch(
        "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
    );
    const data = await response.json();
    document.getElementById(
        "featured-launch"
    ).innerHTML = `<div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
    <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                        <i class="fas fa-star"></i>
                        Featured Launch
                    </span>
                    <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                        ${data.results[0].status.abbrev}
                    </span>
                </div>

                <h3 class="text-3xl font-bold mb-3 leading-tight">
                    ${data.results[0].name}
                </h3>

                <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${
                            data.results[0].launch_service_provider.name
                        }</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${
                            data.results[0].rocket.configuration.name
                        }</span>
                    </div>
                </div>

                <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                    <i class="fas fa-clock text-2xl text-blue-400"></i>
                    <div>
                        <p class="text-2xl font-bold text-blue-400">
                            ${Math.max(
                                0,
                                Math.ceil(
                                    (new Date(data.results[0].net) -
                                        new Date()) /
                                        (1000 * 60 * 60 * 24)
                                )
                            )}
                        </p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                    </div>
                </div>

                <div class="grid xl:grid-cols-2 gap-4 mb-6">
                    <div class="bg-slate-900/50 rounded-xl p-4">
                        <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                            <i class="fas fa-calendar"></i>
                            Launch Date
                        </p>
                        <p class="font-semibold">
                            ${new Date(data.results[0].net).toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>

                    <div class="bg-slate-900/50 rounded-xl p-4">
                        <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                            <i class="fas fa-clock"></i>
                            Launch Time
                        </p>
                        <p class="font-semibold">
                            ${new Date(data.results[0].net).toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "UTC",
                                    timeZoneName: "short",
                                }
                            )}
                        </p>
                    </div>

                    <div class="bg-slate-900/50 rounded-xl p-4">
                        <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                            <i class="fas fa-map-marker-alt"></i>
                            Location
                        </p>
                        <p class="font-semibold text-sm">
                            ${data.results[0].pad.location.name}
                        </p>
                    </div>

                    <div class="bg-slate-900/50 rounded-xl p-4">
                        <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                            <i class="fas fa-globe"></i>
                            Country
                        </p>
                        <p class="font-semibold">
                            ${data.results[0].pad.country.name}
                        </p>
                    </div>
                </div>

                <p class="text-slate-300 leading-relaxed mb-6">
                    ${
                        data.results[0].mission?.description ||
                        "No mission description available."
                    }
                </p>
            </div>

            <div class="flex flex-col md:flex-row gap-3">
                <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                    <i class="fas fa-info-circle"></i>
                    View Full Details
                </button>

                <div class="icons self-end md:self-center flex gap-2">
                    <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                        <i class="fas fa-bell"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="relative">
            <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                <img
                    src="${
                        data.results[0].image ||
                        "./assets/images/launch-placeholder.png"
                    }"
                    alt="${data.results[0].name}"
                    class="w-full h-full object-cover"
                    onerror="this.onerror=null; this.src='./assets/images/launch-placeholder.png';"
                />
                <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
        </div>
    </div>
</div>
    `;
    let htmlMarkup = data.results.slice(1).map((rocket) => {
        return `
<div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
    <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        <img
            src="${
                rocket.image.image_url ||
                "./assets/images/launch-placeholder.png"
            }"
            alt="${rocket.name}"
            class="w-full h-full object-cover"
            onerror="this.onerror=null; this.src='./assets/images/launch-placeholder.png';"
        />
        <div class="absolute top-3 right-3">
            <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                ${rocket.status.abbrev || "Go"}
            </span>
        </div>
    </div>
    <div class="p-5">
        <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                ${rocket.name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
                <i class="fas fa-building text-xs"></i>
                ${rocket.launch_service_provider.name}
            </p>
        </div>
        <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-calendar text-slate-500 w-4"></i>
                <span class="text-slate-300">
                    ${new Date(rocket.net).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-clock text-slate-500 w-4"></i>
                <span class="text-slate-300">
                    ${new Date(rocket.net).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "UTC",
                        timeZoneName: "short",
                    })}
                </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-rocket text-slate-500 w-4"></i>
                <span class="text-slate-300">${
                    rocket.rocket.configuration.name
                }</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                <span class="text-slate-300 line-clamp-1">
                    ${rocket.pad.location.name}
                </span>
            </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                Details
            </button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
            </button>
        </div>
    </div>
</div>
            `;
    });
    document.getElementById("launches-grid").innerHTML = htmlMarkup.join(" ");
}

fetchUpcoming();

// 3-00 plantes section

// fetching the data and adding it to a variable so we don't need to fetch it again
async function pepareData() {
    const planetsData = await fetchPlanets();
    planetCards.forEach((card) => {
        card.addEventListener("click", (e) => {
            planetsData.bodies.forEach((planet) => {
                if (planet.id === card.getAttribute("data-planet-id")) {
                    handelPlanetHtml(planet);
                    return;
                }
            });
        });
    });
    handelPlanetHtml(planetsData.bodies[6]);
}

pepareData();

async function fetchPlanets() {
    try {
        const response = await fetch(
            "https://solar-system-opendata-proxy.vercel.app/api/planets"
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

function handelPlanetHtml(planet) {
    document.getElementById("planet-detail-image").src =
        planet.image || "./assets/images/planet-placeholder.png";
    document.getElementById(
        "planet-detail-image"
    ).alt = `${planet.englishName} planet detailed realistic render`;

    // name
    document.getElementById("planet-detail-name").innerText =
        planet.englishName;

    // description
    document.getElementById("planet-detail-description").innerText =
        planet.description;

    // stats
    document.getElementById("planet-distance").innerText = `${(
        planet.semimajorAxis / 1000000
    ).toFixed(1)}M Km`;
    document.getElementById(
        "planet-radius"
    ).innerText = `${planet.meanRadius} km`;
    document.getElementById(
        "planet-mass"
    ).innerText = `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;
    document.getElementById(
        "planet-density"
    ).innerText = `${planet.density} g/cm³`;
    document.getElementById(
        "planet-orbital-period"
    ).innerText = `${planet.sideralOrbit.toFixed(2)} days`;
    document.getElementById(
        "planet-rotation"
    ).innerText = `${planet.sideralRotation} hours`;
    document.getElementById("planet-moons").innerText = planet.moons
        ? planet.moons.length
        : 0;
    document.getElementById(
        "planet-gravity"
    ).innerText = `${planet.gravity} m/s²`;

    // discovry info
    document.getElementById("planet-discoverer").innerText =
        planet.discoveredBy || "Known since antiquity";
    document.getElementById("planet-discovery-date").innerText =
        planet.discoveryDate || "Ancient times";
    document.getElementById("planet-body-type").innerText =
        planet.bodyType || "Unknown";
    document.getElementById("planet-volume").innerText = planet.vol
        ? `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`
        : "N/A";
    // quick facts
    const factsList = document.getElementById("planet-facts");
    factsList.innerHTML = `
    <li class="flex items-start">
        <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
        <span class="text-slate-300">Mass:
            ${planet.mass.massValue} × 10^${planet.mass.massExponent} Kg
        </span>
    </li>
    <li class="flex items-start">
        <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
        <span class="text-slate-300">Surface gravity: ${planet.gravity} m/s²</span>
    </li>
    <li class="flex items-start">
        <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
        <span class="text-slate-300">Density: ${planet.density} g/cm³</span>
    </li>
    <li class="flex items-start">
        <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
        <span class="text-slate-300">Axial tilt: ${planet.axialTilt}°</span>
    </li>
    `;

    // orbital characterstics
    document.getElementById("planet-perihelion").innerText = `${(
        planet.perihelion / 1000000
    ).toFixed(1)}M km`;
    document.getElementById("planet-aphelion").innerText = `${(
        planet.aphelion / 1000000
    ).toFixed(1)}M km`;
    document.getElementById("planet-eccentricity").innerText =
        planet.eccentricity;
    document.getElementById(
        "planet-inclination"
    ).innerText = `${planet.inclination}°`;
    document.getElementById(
        "planet-axial-tilt"
    ).innerText = `${planet.axialTilt}°`;
    document.getElementById("planet-temp").innerText = `${planet.avgTemp}°C`;
    document.getElementById("planet-escape").innerText = `${(
        planet.escape / 1000
    ).toFixed(2)} km/s`;
}
