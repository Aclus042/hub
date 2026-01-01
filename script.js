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

    /**
     * Inicializa todas as funcionalidades
     */
    function init() {
        initCardHoverEffect();
        initSmoothAppear();
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
