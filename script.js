// Gestione della Navigazione Attiva
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Se abbiamo scrollato fino a questa sezione (con un margine di 150px)
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});

// --- Observer per le immagini laterali (ingresso/uscita) ---
const sideImgs = document.querySelectorAll('.side-img img');
const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const img = entry.target;
        if (entry.isIntersecting) {
            img.classList.remove('exit');
            img.classList.add('in-view');
        } else {
            img.classList.remove('in-view');
            // aggiungi classe exit solo se era visibile prima
            if (img.classList.contains('in-view') === false) {
                img.classList.add('exit');
            }
            // rimuovi exit dopo animazione per poter riusare l'animazione
            setTimeout(() => img.classList.remove('exit'), 600);
        }
    });
}, { threshold: 0.2 });

sideImgs.forEach(img => imgObserver.observe(img));

// --- Gestione apertura/chiusura Project cards ---
function openProject(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const isExpanded = target.classList.contains('expanded');
    // chiudi tutte
    document.querySelectorAll('.project-card').forEach(card => card.classList.remove('expanded'));
    // apri il target se non era aperto
    if (!isExpanded) {
        target.classList.add('expanded');
        // scroll leggero per portare il contenuto a vista
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
}

// Tabs (About)

function openTab(event) {

    const btn = event.currentTarget;

    const tab = btn.getAttribute('data-tab');

    // toggle active on buttons

    document.querySelectorAll('.tab-card .tab-btn').forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    // show content

    document.querySelectorAll('.tab-card .tab-content').forEach(c => c.classList.remove('active'));

    const content = document.getElementById(tab);

    if (content) content.classList.add('active');

}



// =========================================
// MAPPA INTERATTIVA (Leaflet.js)
// =========================================

// 1. Dati dei luoghi visitati (Modifica qui per aggiungere posti!)
const visitedPlaces = [
    {
        country: "Italy",
        coords: [41.8719, 12.5674], // Latitudine, Longitudine (Centro Italia)
        cities: [
            {
                name: "Milan",
                desc: "Home of innovation and the beautiful Duomo.",
                img: "assets/images/duomo.png" // Assicurati che l'immagine esista!
            },
            {
                name: "Venice",
                desc: "Lost in the canals and history.",
                img: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400" // Esempio link esterno
            }
        ]
    },
    {
        country: "Spain",
        coords: [40.4168, -3.7038], // Madrid
        cities: [
            {
                name: "Barcelona",
                desc: "Architecture by Gaudí and seaside vibes.",
                img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400"
            }
        ]
    }
    // Copia e incolla un blocco {...} per aggiungere altri paesi
];

// 2. Inizializzazione Mappa
// Coordinate [lat, lng], Zoom level (4 = vista Europa/Mondo)
const map = L.map('map', {
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile, 
    tap: !L.Browser.mobile
}).setView([48.0, 10.0], 4);

// 3. Aggiunta del "Tile Layer" (Lo stile grafico della mappa)
// Usiamo CartoDB Positron per un look pulito e minimalista (bianco/grigio)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// 4. Generazione dei Marker
visitedPlaces.forEach(place => {
    // Creiamo l'HTML interno del popup dinamicamente
    let citiesHtml = '';
    
    place.cities.forEach(city => {
        citiesHtml += `
            <div class="city-entry">
                <strong>• ${city.name}</strong>
                <span>${city.desc}</span>
                <img src="${city.img}" alt="${city.name}">
            </div>
        `;
    });

    const popupContent = `
        <div class="popup-container">
            <div class="popup-title">${place.country} 🇮🇹</div>
            ${citiesHtml}
        </div>
    `;

    // Aggiungi marker alla mappa
    L.marker(place.coords)
        .addTo(map)
        .bindPopup(popupContent);
});

// Fix: A volte la mappa non renderizza bene se caricata in una pagina nascosta/scrollata.
// Forziamo un ricalcolo delle dimensioni quando la finestra cambia dimensione.
window.addEventListener('resize', () => {
    map.invalidateSize();
});