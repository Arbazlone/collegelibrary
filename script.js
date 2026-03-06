// ========== script.js ==========
// BFCET Library Management Information System
// Baba Farid College of Engineering & Technology
// Interactive features: book catalog, search, filter, student records, counters, dynamic UI

document.addEventListener('DOMContentLoaded', function() {
    // ---------- 1. STICKY NAVBAR WITH DYNAMIC ISLAND SHADOW ----------
    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---------- 2. MOBILE HAMBURGER MENU ----------
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // ---------- 3. ANIMATED COUNTERS (SCROLL REVEAL) ----------
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 100; // smooth increment
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // ---------- 4. SCROLL REVEAL ANIMATION (FADE UP) ----------
    const revealElements = document.querySelectorAll('section:not(.hero)');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });

    // ---------- 5. SMOOTH SCROLL WITH OFFSET FOR FIXED HEADER ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- 6. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function highlightNav() {
        let scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // ---------- 7. BOOK CATALOG DATA & RENDERING ----------
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const deptFilter = document.getElementById('deptFilter');

    // Sample book data (BFCET library)
    const books = [
        { id: 1, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", dept: "AI", cover: "images/ai.jpeg", status: "Available" },
        { id: 2, title: "Introduction to Algorithms", author: "CLRS", dept: "CSE", cover: "images/algorithms.jpeg", status: "Available" },
        { id: 3, title: "Thermodynamics: An Engineering Approach", author: "Yunus Çengel", dept: "ME", cover: "images/thermodynamics.jpeg", status: "Issued" },
        { id: 4, title: "Structure and Interpretation", author: "Harold Abelson", dept: "CSE", cover: "images/sicp.jpeg", status: "Available" },
        { id: 5, title: "Deep Learning", author: "Ian Goodfellow", dept: "AI", cover: "images/deeplearning.jpeg", status: "Available" },
        { id: 6, title: "Gray's Anatomy", author: "Henry Gray", dept: "Medical", cover: "images/anatomy.jpeg", status: "Available" },
        { id: 7, title: "Principles of Physiotherapy", author: "Carolyn Kisner", dept: "Physio", cover: "images/physiotherphy.jpeg", status: "Issued" },
        { id: 8, title: "Radiology for Students", author: "William Herring", dept: "Radio", cover: "images/radiology.jpeg", status: "Available" },
        { id: 9, title: "Strength of Materials", author: "R.K. Bansal", dept: "CE", cover: "images/som.jpeg", status: "Available" },
        { id: 10, title: "Marketing Management", author: "Philip Kotler", dept: "Management", cover: "images/marketing.jpeg", status: "Available" },
        { id: 11, title: "Machine Learning", author: "Tom Mitchell", dept: "AI", cover: "images/ml.jpeg", status: "Issued" },
        { id: 12, title: "Fluid Mechanics", author: "Frank White", dept: "ME", cover: "images/fluid.jpeg", status: "Available" }
    ];

    function renderBooks(filteredBooks) {
        if (!booksGrid) return;
        booksGrid.innerHTML = '';
        filteredBooks.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <img src="${book.cover}" alt="${book.title}" style="width:100%; height:160px; object-fit:cover; border-radius:16px;">
                <h4>${book.title}</h4>
                <p class="book-author">${book.author}</p>
                <span class="book-dept">${book.dept}</span>
                <p class="book-status ${book.status === 'Available' ? 'status-available' : 'status-issued'}">${book.status}</p>
            `;
            booksGrid.appendChild(card);
        });
    }

    // Initial render
    renderBooks(books);

    // Filter and search functionality
    function filterBooks() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const dept = deptFilter ? deptFilter.value : 'all';
        
        const filtered = books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                                 book.author.toLowerCase().includes(searchTerm);
            const matchesDept = dept === 'all' || book.dept === dept;
            return matchesSearch && matchesDept;
        });
        renderBooks(filtered);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterBooks);
    }
    if (deptFilter) {
        deptFilter.addEventListener('change', filterBooks);
    }

    // ---------- 8. STUDENT RECORDS TABLE (SIMULATED) ----------
    const recordsBody = document.getElementById('recordsBody');
    const studentSearch = document.getElementById('studentSearch');

    const studentRecords = [
        { id: "BFCET202401", name: "Ahmed Khan", dept: "AI & ML", book: "Machine Learning Basics", returnDate: "20 Apr 2026" },
        { id: "BFCET202402", name: "Simran Kaur", dept: "CSE", book: "Introduction to Algorithms", returnDate: "22 Apr 2026" },
        { id: "BFCET202403", name: "MD.Kaif", dept: "ME", book: "Thermodynamics", returnDate: "18 Apr 2026" },
        { id: "BFCET202404", name: "Jasleen Kaur", dept: "Medical", book: "Gray's Anatomy", returnDate: "25 Apr 2026" },
        { id: "BFCET202405", name: "nasim khan", dept: "Physio", book: "Principles of Physiotherapy", returnDate: "19 Apr 2026" },
        { id: "BFCET202406", name: "Riya Sharma", dept: "Radio", book: "Radiology for Students", returnDate: "23 Apr 2026" },
        { id: "BFCET202407", name: "Arbaz Hassan", dept: "AI & ML", book: "Deep Learning", returnDate: "21 Apr 2026" },
         { id: "BFCET202408", name: "Navdeep Singh", dept: "CE", book: "Strength of Materials", returnDate: "24 Apr 2026" },
         { id: "BFCET202409", name: "asif ansari", dept: "BCA", book: "Strength of Materials", returnDate: "24 Apr 2026" },
    ]; 

    function renderRecords(records) {
        if (!recordsBody) return;
        recordsBody.innerHTML = '';
        records.forEach(rec => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${rec.id}</td><td>${rec.name}</td><td>${rec.dept}</td><td>${rec.book}</td><td>${rec.returnDate}</td>`;
            recordsBody.appendChild(row);
        });
    }

    renderRecords(studentRecords);

    if (studentSearch) {
        studentSearch.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const filtered = studentRecords.filter(rec => 
                rec.name.toLowerCase().includes(term) || 
                rec.id.toLowerCase().includes(term)
            );
            renderRecords(filtered);
        });
    }

    // ---------- 9. CONTACT FORM (Now uses Formspree for real submissions) ----------
    // Removed simulation code as form now submits to Formspree

    // ---------- 10. DYNAMIC ISLAND CARD HOVER EFFECTS (ENHANCED) ----------
    const cards = document.querySelectorAll('.book-card, .dept-card, .facility-card, .dev-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });

    // ---------- 11. STATS CHECK ON LOAD ----------
    function isElementInViewport(el, threshold = 0.3) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const visiblePart = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const elementHeight = rect.height;
        return visiblePart > elementHeight * threshold;
    }

    window.addEventListener('load', function() {
        if (statsSection && isElementInViewport(statsSection, 0.5)) {
            startCounters();
        }
        
        // Add a small delay to ensure images are loaded
        setTimeout(() => {
            // Re-check counters if stats are visible
            if (statsSection && isElementInViewport(statsSection, 0.5) && !countersStarted) {
                startCounters();
            }
        }, 500);
    });

    // ---------- 12. DEPARTMENT FILTER LINKS (from dept cards) ----------
    document.querySelectorAll('.dept-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const deptCard = this.closest('.dept-card');
                const deptName = deptCard.querySelector('h3').innerText;
                
                // Map department name to filter value
                let filterValue = 'all';
                if (deptName.includes('Computer Science')) filterValue = 'CSE';
                else if (deptName.includes('AI')) filterValue = 'AI';
                else if (deptName.includes('Mechanical')) filterValue = 'ME';
                else if (deptName.includes('Civil')) filterValue = 'CE';
                else if (deptName.includes('Medical')) filterValue = 'Medical';
                else if (deptName.includes('Physio')) filterValue = 'Physio';
                else if (deptName.includes('Radio')) filterValue = 'Radio';
                else if (deptName.includes('Business')) filterValue = 'Management';
                
                if (deptFilter) {
                    deptFilter.value = filterValue;
                    filterBooks();
                }
                
                // Scroll to catalog
                const catalogSection = document.getElementById('catalog');
                if (catalogSection) {
                    const headerOffset = 80;
                    const elementPosition = catalogSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
            // If href is external (starts with http), let the default behavior happen
        });
    });
});