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

// Funzione semplice per aprire i popup della mappa
function openMapPopup(countryId) {
    // Chiudi tutti gli altri prima
    document.querySelectorAll('.map-popup').forEach(el => el.classList.add('hidden'));
    
    // Apri quello specifico
    const popup = document.getElementById(countryId + '-popup');
    if(popup) {
        popup.classList.remove('hidden');
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

// Chiudi i popup della mappa se clicchi fuori dalla finestra popup
document.addEventListener('click', function(event) {
    // Se il click è dentro la popup o sul marker, non chiudere
    if (event.target.closest('.map-popup') || event.target.closest('.map-marker')) {
        return;
    }
    // altrimenti chiudi tutte le popup
    document.querySelectorAll('.map-popup').forEach(el => el.classList.add('hidden'));
});