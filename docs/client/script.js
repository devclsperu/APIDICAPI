// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Copy to clipboard functionality
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const button = element.parentElement.querySelector('.copy-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#48bb78';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '#667eea';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Intersection Observer for active navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '-20% 0px -70% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Add mobile menu button if needed
if (window.innerWidth <= 768) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.onclick = toggleMobileMenu;
    
    document.querySelector('.content-header').prepend(mobileMenuBtn);
}

// Syntax highlighting for code blocks
document.addEventListener('DOMContentLoaded', function() {
    // Add syntax highlighting classes
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(block => {
        block.innerHTML = block.innerHTML
            .replace(/"([^"]+)":/g, '<span class="property">"$1"</span>:')
            .replace(/: "([^"]+)"/g, ': <span class="string">"$1"</span>')
            .replace(/: (\d+)/g, ': <span class="number">$1</span>')
            .replace(/: (true|false)/g, ': <span class="boolean">$1</span>')
            .replace(/\b(GET|POST|PUT|DELETE)\b/g, '<span class="method">$1</span>');
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for additional styling
const additionalStyles = `
    .property { color: #9cdcfe; }
    .string { color: #ce9178; }
    .number { color: #b5cea8; }
    .boolean { color: #569cd6; }
    .method { color: #dcdcaa; }
    
    .mobile-menu-btn {
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        z-index: 1000;
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
    }
    
    body.loaded .section {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update document language
            document.documentElement.lang = selectedLang;
            
            // Update all translatable elements
            updateLanguage(selectedLang);
            
            // Save preference
            localStorage.setItem('preferred-language', selectedLang);
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
        const savedButton = document.querySelector(`[data-lang="${savedLang}"]`);
        if (savedButton) {
            langButtons.forEach(btn => btn.classList.remove('active'));
            savedButton.classList.add('active');
            document.documentElement.lang = savedLang;
            updateLanguage(savedLang);
        }
    }
});

function updateLanguage(lang) {
    const translatableElements = document.querySelectorAll('[data-es][data-en]');
    
    translatableElements.forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            element.textContent = translation;
        }
    });
} 