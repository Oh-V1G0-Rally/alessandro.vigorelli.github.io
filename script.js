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

// 1. Dati dei luoghi visitati
const visitedPlaces = [
    // --- ITALIA 🇮🇹 ---
    {
        country: "Italy",
        coords: [42.50, 12.50], 
        cities: [
            {
                name: "Castenedolo (Home/Origins)",
                desc: "2010 - Where it started.",
                img: "assets/images/map/2010_CASTENEDOLO.jpeg"
            },
            {
                name: "Rimini",
                desc: "August 2019",
                img: "assets/images/map/201908_RIMINI.jpg"
            },
            {
                name: "Napoli",
                desc: "August 2020",
                img: "assets/images/map/202008_NAPOLI.png"
            },
            {
                name: "Firenze (Part 1)",
                desc: "June 2021",
                img: "assets/images/map/202106_FIRENZE.jpg"
            },
            {
                name: "Firenze (Part 2)",
                desc: "June 2021",
                img: "assets/images/map/202106_FIRENZE2.jpg"
            },
            {
                name: "Cinque Terre",
                desc: "August 2021",
                img: "assets/images/map/202108_CINQUETERRE.jpg"
            },
            {
                name: "Passo dello Stelvio",
                desc: "September 2021",
                img: "assets/images/map/202109_STELVIO.jpg"
            },
            {
                name: "Bagolino",
                desc: "October 2022",
                img: "assets/images/map/202210_BAGOLINO.JPG"
            },
            {
                name: "Venezia",
                desc: "February 2023",
                img: "assets/images/map/202302_VENEZIA.jpg"
            },
            {
                name: "Puglia",
                desc: "August 2024",
                img: "assets/images/map/202408_PUGLIA.jpg"
            }
        ]
    },

    // --- SPAGNA 🇪🇸 ---
    {
        country: "Spain",
        coords: [40.46, -3.74], 
        cities: [
            {
                name: "Valencia", 
                desc: "October 2022",
                // Ho aggiunto Valencia perché c'era la foto nella tua lista!
                img: "assets/images/map/202210_VALENCIA.JPG"
            },
            {
                name: "Sevilla (April)",
                desc: "April 2024",
                img: "assets/images/map/202404_SEVILLA.jpg"
            },
            {
                name: "Cordoba",
                desc: "May 2024",
                img: "assets/images/map/202405_CORDOBA.jpg"
            },
            {
                name: "Cadice",
                desc: "June 2024",
                img: "assets/images/map/202406_CADICE.jpg"
            },
            {
                name: "Ronda",
                desc: "June 2024",
                img: "assets/images/map/202406_RONDA.jpg"
            },
            {
                name: "Sevilla (June)",
                desc: "June 2024",
                img: "assets/images/map/202406_SEVILLA.jpg"
            }
        ]
    },

    // --- PORTOGALLO 🇵🇹 ---
    {
        country: "Portugal",
        coords: [39.39, -8.22],
        cities: [
            {
                name: "Lisboa (View 1)",
                desc: "March 2023",
                img: "assets/images/map/202303_LISBONA.JPG"
            },
            {
                name: "Lisboa (View 2)",
                desc: "March 2023",
                img: "assets/images/map/202303_LISBONA2.jpeg"
            },
            {
                name: "Covilhã",
                desc: "July 2025",
                img: "assets/images/map/202507_COVILHA.jpg"
            },
            {
                name: "Porto",
                desc: "July 2025",
                img: "assets/images/map/202507_PORTO.jpg"
            }
        ]
    },

    // --- MAROCCO 🇲🇦 ---
    {
        country: "Morocco",
        coords: [31.79, -7.09],
        cities: [
            {
                name: "Chefchaouen",
                desc: "March 2024 - The Blue City",
                // Nota: i nomi file con spazi a volte danno problemi, 
                // se non la vedi rinomina il file in '202403_MAROCCO_CHEFCHAOUEN.JPG'
                img: "assets/images/map/202403_MAROCCO_CHEFCHAOUEN.JPG" 
            },
            {
                name: "Morocco Tour",
                desc: "March 2024",
                img: "assets/images/map/202403_MAROCCO1.jpg"
            }
        ]
    },

    // --- REGNO UNITO 🇬🇧 ---
    {
        country: "UK",
        coords: [51.50, -0.12],
        cities: [
            {
                name: "London",
                desc: "October 2023",
                img: "assets/images/map/202310_LONDRA.jpg"
            }
        ]
    },

    // --- BELGIO 🇧🇪 ---
    {
        country: "Belgium",
        coords: [50.85, 4.35],
        cities: [
            {
                name: "Bruxelles",
                desc: "January 2022",
                img: "assets/images/map/202201_BRUXELLES.JPG"
            }
        ]
    },

    // --- GERMANIA (Monaco di Baviera) ---
    {
        country: "Germany", 
        coords: [48.13, 11.58], 
        cities: [
            {
                name: "Monaco",
                desc: "January 2024",
                img: "assets/images/map/202401_MONACO.jpg"
            }
        ]
    },

    // --- ROMANIA 🇷🇴 ---
    {
        country: "Romania",
        coords: [45.94, 24.96],
        cities: [
            {
                name: "Bucharest",
                desc: "February 2025",
                img: "assets/images/map/202502_BUCHAREST.jpg"
            }
        ]
    },

    // --- OLANDA 🇳🇱 ---
    {
        country: "Netherlands",
        coords: [52.36, 4.90],
        cities: [
            {
                name: "Amsterdam",
                desc: "September 2025",
                img: "assets/images/map/202509_AMSTERDAM.jpg"
            }
        ]
    },

    // --- UNGHERIA 🇭🇺 ---
    {
        country: "Hungary",
        coords: [47.16, 19.50],
        cities: [
            {
                name: "Budapest",
                desc: "October 2024",
                // La data nel nome file è 202410 (Ottobre 2024)
                img: "assets/images/map/202410_BUDAPEST.jpeg"
            },
            {
                name: "Budapest (Return for IFAC)",
                desc: "June 2025",
                // ATTENZIONE: Non c'era una foto '202506_Budapest' nella lista che mi hai dato.
                // Ho rimesso quella del 2024 per non lasciare il buco. Se hai la foto nuova, aggiungila e cambia qui.
                img: "assets/images/map/202506_BUDAPEST_UNI.jpg"
            }
        ]
    }
];

// !!! IMPORTANTE !!!
// Visto che ora usiamo immagini locali, la funzione "convertToDirectLink" 
// e il blocco che la usa nel forEach (convertToDirectLink(city.img)) 
// NON SERVONO PIÙ. Puoi rimuoverli per pulire il codice.
// Usa il loop standard qui sotto:

// ================================================
// GENERAZIONE MARKER E POPUP (Standard)
// ================================================

const map = L.map('map', {
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile, 
    tap: !L.Browser.mobile
}).setView([48.0, 10.0], 4); 

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

visitedPlaces.forEach(place => {
    let citiesHtml = '';
    
    place.cities.forEach(city => {
        // Niente più funzione di conversione, usiamo il link diretto
        citiesHtml += `
            <div class="city-entry">
                <strong>• ${city.name}</strong>
                <span>${city.desc}</span>
                <img src="${city.img}" alt="${city.name}" onerror="this.style.display='none'">
            </div>
        `;
    });

    const popupContent = `
        <div class="popup-container">
            <div class="popup-title">${place.country}</div>
            ${citiesHtml}
        </div>
    `;

    L.marker(place.coords)
        .addTo(map)
        .bindPopup(popupContent);
});

window.addEventListener('resize', () => {
    map.invalidateSize();
});

// // ================================================
// // FUNZIONE DI SUPPORTO PER IMMAGINI DRIVE
// // Trasforma "drive.google.com/.../view" in un link diretto visualizzabile
// // ================================================
// function convertToDirectLink(url) {
//     if (!url) return "";
//     // Se è un link di Google Drive e contiene l'ID
//     if (url.includes("drive.google.com") && url.includes("/d/")) {
//         try {
//             // Estrae l'ID tra "/d/" e "/view"
//             const id = url.split('/d/')[1].split('/')[0];
//             return `https://drive.google.com/uc?export=view&id=${id}`;
//         } catch (e) {
//             console.error("Errore conversione link Drive:", url);
//             return url; // Ritorna l'originale se fallisce
//         }
//     }
//     return url; // Se è un link normale (non Drive), lo lascia così
// }

// ================================================
// GENERAZIONE MARKER E POPUP
// ================================================

// // Inizializzazione Mappa
// const map = L.map('map', {
//     scrollWheelZoom: false,
//     dragging: !L.Browser.mobile, 
//     tap: !L.Browser.mobile
// }).setView([48.0, 10.0], 4); 

// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//     attribution: '&copy; OpenStreetMap &copy; CARTO',
//     subdomains: 'abcd',
//     maxZoom: 19
// }).addTo(map);

// visitedPlaces.forEach(place => {
//     let citiesHtml = '';
    
//     place.cities.forEach(city => {
//         // QUI USIAMO LA FUNZIONE DI CONVERSIONE AUTOMATICA
//         const directImgUrl = convertToDirectLink(city.img);

//         citiesHtml += `
//             <div class="city-entry">
//                 <strong>• ${city.name}</strong>
//                 <span>${city.desc}</span>
//                 <img src="${directImgUrl}" alt="${city.name}" onerror="this.style.display='none'">
//             </div>
//         `;
//     });

//     const popupContent = `
//         <div class="popup-container">
//             <div class="popup-title">${place.country}</div>
//             ${citiesHtml}
//         </div>
//     `;

//     L.marker(place.coords)
//         .addTo(map)
//         .bindPopup(popupContent);
// });

window.addEventListener('resize', () => {
    map.invalidateSize();
});