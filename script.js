/**
 * ============================================
 * FAROL HUB - JavaScript
 * ============================================
 * 
 * Scripts leves para melhorar a experiência do usuário.
 * Funcionalidades:
 * - Efeito de luz seguindo o mouse nos cards
 * - Animação suave de entrada
 * - Melhorias de acessibilidade
 * 
 * O site funciona 100% sem JavaScript.
 * Estes scripts são apenas melhorias progressivas.
 */

(function() {
    'use strict';

    /**
     * Aguarda o DOM estar pronto
     */
    document.addEventListener('DOMContentLoaded', init);
    
    // Remove loading state
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });

    /**
     * Inicializa todas as funcionalidades
     */
    function init() {
        initCardHoverEffect();
        initSmoothAppear();
        initParallaxEffect();
        init3DTiltEffect();
        initLighthouseInteraction();
        initRippleEffect();
        initKeyboardNavigation();
    }

    /**
     * Efeito ripple ao clicar em cards (mobile)
     */
    function initRippleEffect() {
        const cards = document.querySelectorAll('.link-card');
        
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    /**
     * Navegação por teclado melhorada
     */
    function initKeyboardNavigation() {
        const cards = document.querySelectorAll('.link-card');
        
        cards.forEach((card, index) => {
            card.addEventListener('keydown', (e) => {
                let targetIndex = index;
                
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        targetIndex = (index + 1) % cards.length;
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        targetIndex = (index - 1 + cards.length) % cards.length;
                        e.preventDefault();
                        break;
                    default:
                        return;
                }
                
                cards[targetIndex].focus();
            });
        });
    }

    /**
     * Efeito de luz seguindo o mouse nos cards
     * Cria a sensação de um feixe de luz iluminando o card
     */
    function initCardHoverEffect() {
        const cards = document.querySelectorAll('.link-card');
        
        cards.forEach(card => {
            const glow = card.querySelector('.card-glow');
            
            if (!glow) return;

            // Atualiza posição do brilho conforme o mouse se move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Move o gradiente radial para seguir o cursor
                glow.style.background = `radial-gradient(
                    600px circle at ${x}px ${y}px,
                    rgba(255, 213, 79, 0.15) 0%,
                    transparent 50%
                )`;
            });

            // Reset ao sair do card
            card.addEventListener('mouseleave', () => {
                glow.style.background = `radial-gradient(
                    circle at center,
                    rgba(255, 213, 79, 0.15) 0%,
                    transparent 50%
                )`;
            });
        });
    }

    /**
     * Observa cards entrando na viewport para animação
     * Útil se houver scroll (caso sejam adicionados mais links)
     */
    function initSmoothAppear() {
        // Verifica suporte ao IntersectionObserver
        if (!('IntersectionObserver' in window)) return;

        const cards = document.querySelectorAll('.link-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            // Prepara estado inicial apenas se animação é suportada
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                observer.observe(card);
            }
        });
    }

    /**
     * Efeito parallax suave no scroll
     */
    function initParallaxEffect() {
        // Apenas em desktop
        if (window.innerWidth < 768) return;
        
        const beam = document.querySelector('.lighthouse-beam');
        const header = document.querySelector('.header');
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    
                    if (beam) {
                        beam.style.transform = `translateX(-50%) rotate(${scrolled * 0.05}deg)`;
                    }
                    
                    if (header) {
                        header.style.transform = `translateY(${scrolled * 0.3}px)`;
                        header.style.opacity = 1 - (scrolled * 0.003);
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }

    /**
     * Efeito de inclinação 3D nos cards
     */
    function init3DTiltEffect() {
        // Apenas em desktop
        if (window.innerWidth < 768) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const cards = document.querySelectorAll('.link-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    translateY(-8px) 
                    scale(1.02)
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Interação com o ícone do farol
     */
    function initLighthouseInteraction() {
        const lighthouse = document.querySelector('.lighthouse-icon');
        const light = document.querySelector('.lighthouse-light');
        
        if (!lighthouse || !light) return;
        
        let clickCount = 0;
        
        lighthouse.addEventListener('click', () => {
            clickCount++;
            
            // Efeito de flash na luz
            light.style.animation = 'none';
            setTimeout(() => {
                light.style.animation = 'lightPulse 0.3s ease-in-out 3';
            }, 10);
            
            // Easter egg: 5 cliques ativa modo festa
            if (clickCount === 5) {
                activatePartyMode();
                clickCount = 0;
            }
        });
    }

    /**
     * Modo festa escondido (Easter egg)
     */
    function activatePartyMode() {
        const cards = document.querySelectorAll('.link-card');
        const originalColors = [];
        
        cards.forEach((card, index) => {
            const hue = (index * 360 / cards.length);
            card.style.transition = 'all 0.3s ease';
            
            const interval = setInterval(() => {
                card.style.filter = `hue-rotate(${hue + Date.now() / 10}deg)`;
            }, 50);
            
            setTimeout(() => {
                clearInterval(interval);
                card.style.filter = '';
            }, 3000);
        });
        
        // Feedback visual
        document.body.style.animation = 'rainbow 3s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }

    /**
     * Utilitário: Detecta se é dispositivo touch
     * Pode ser usado para ajustar comportamentos
     */
    function isTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    /**
     * Adiciona classe ao body se for touch device
     * Permite estilos CSS específicos se necessário
     */
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }

})();
