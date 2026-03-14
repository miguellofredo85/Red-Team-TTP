// Animações e interatividade
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de digitação no placeholder
    const emailInput = document.getElementById('email');
    if (emailInput) {
        const placeholders = ['seu@email.com', 'nome@empresa.com', 'usuario@acme.com'];
        let index = 0;
        
        setInterval(() => {
            emailInput.placeholder = placeholders[index];
            index = (index + 1) % placeholders.length;
        }, 3000);
    }
    
    // Validação em tempo real
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function(e) {
            const strength = checkPasswordStrength(e.target.value);
            updatePasswordStrength(strength);
        });
    }
    
    // Smooth scroll para anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
});

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    return strength;
}

function updatePasswordStrength(strength) {
    const indicator = document.querySelector('.password-strength');
    if (!indicator) return;
    
    const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
    const texts = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    
    indicator.style.width = (strength * 20) + '%';
    indicator.style.backgroundColor = colors[strength - 1] || '#ef4444';
    indicator.textContent = texts[strength - 1] || '';
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Simulação de carregamento de dados
function loadUserData() {
    fetch('/api/user/data')
        .then(response => response.json())
        .then(data => {
            console.log('User data loaded:', data);
            updateUIWithUserData(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateUIWithUserData(data) {
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = data.name;
    });
}

// Notificações em tempo real (simulado)
setInterval(() => {
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell && Math.random() > 0.7) {
        notificationBell.classList.add('has-notification');
        
        // Mostra toast notification
        showToast('Nova notificação recebida');
    }
}, 30000);

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Efeito de partículas no background (opcional)
if (document.querySelector('.login-container')) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });
}
