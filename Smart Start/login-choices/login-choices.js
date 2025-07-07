// Add ripple effect to buttons
        function createRipple(event) {
            const button = event.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // Add event listeners for ripple effect
        document.querySelectorAll('.login-btn').forEach(button => {
            button.addEventListener('click', createRipple);
        });

        // Handle login button clicks
        function handleLogin(type) {
            const button = event.currentTarget;
            
            // Add loading state
            button.style.transform = 'scale(0.95)';
            button.style.opacity = '0.8';
            
            // Simulate login process
            setTimeout(() => {
                button.style.transform = '';
                button.style.opacity = '';
                
                // Show success animation
                button.style.background = type === 'mentor' 
                    ? 'linear-gradient(135deg, var(--success), #10b981)' 
                    : 'linear-gradient(135deg, var(--success), #10b981)';
                
                // Reset after animation
                setTimeout(() => {
                    button.style.background = '';
                    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} login clicked! Redirecting...`);
                }, 1000);
            }, 200);
        }

        // Add floating particles effect
        function createFloatingParticle() {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `rgba(${Math.random() > 0.5 ? '8, 145, 178' : '37, 77, 112'}, 0.3)`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            
            document.body.appendChild(particle);
            
            const animation = particle.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 0 },
                { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 1 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'linear'
            });
            
            animation.onfinish = () => particle.remove();
        }

        // Create floating particles periodically
        setInterval(createFloatingParticle, 2000);

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('login-btn')) {
                    focusedElement.click();
                }
            }
        });

        // Add focus styles for accessibility
        document.querySelectorAll('.login-btn').forEach(button => {
            button.addEventListener('focus', () => {
                button.style.outline = '2px solid var(--accent-light)';
                button.style.outlineOffset = '2px';
            });
            
            button.addEventListener('blur', () => {
                button.style.outline = 'none';
            });
        });