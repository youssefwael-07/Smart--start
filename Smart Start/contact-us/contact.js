// ===== CONTACT FORM MANAGER =====
class ContactFormManager {
    constructor() {
        this.contactForm = document.getElementById("contactForm")
        this.successMessage = document.getElementById("successMessage")
        this.submitBtn = this.contactForm.querySelector(".submit-btn")
        this.btnText = this.submitBtn.querySelector(".btn-text")
        this.btnLoading = this.submitBtn.querySelector(".btn-loading")

        if (!this.contactForm || !this.submitBtn) {
            console.error("Required form elements not found!")
            return
        }

        this.init()
    }

    init() {
        this.setupEventListeners()
        this.setupFormValidation()
        this.animateFormElements()
    }

    setupEventListeners() {
        // Form submission
        this.contactForm.addEventListener("submit", (e) => this.handleFormSubmit(e))

        // User profile dropdown
        const userProfile = document.getElementById("userProfile")
        const dropdown = document.getElementById("dropdown")

        if (userProfile && dropdown) {
            userProfile.addEventListener("click", (e) => {
                e.stopPropagation()
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"
            })

            document.addEventListener("click", () => {
                dropdown.style.display = "none"
            })
        }

        // Mobile menu toggle
        const hamburger = document.getElementById("hamburger2")
        const navMenu = document.getElementById("navMenu2")

        if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
                navMenu.classList.toggle("active")
            })
        }

        // Chat button
        const chatBtn = document.querySelector(".chat-btn")
        if (chatBtn) {
            chatBtn.addEventListener("click", () => {
                this.showNotification("Live chat will be available soon!", "info")
            })
        }
    }

    setupFormValidation() {
        const inputs = this.contactForm.querySelectorAll("input, select, textarea")

        inputs.forEach((input) => {
            input.addEventListener("blur", () => this.validateField(input))
            input.addEventListener("input", () => this.clearFieldError(input))
        })
    }

    validateField(field) {
        const formGroup = field.closest(".form-group")
        const errorElement = formGroup.querySelector(".error-message")
        let isValid = true
        let errorMessage = ""

        // Required field validation
        if (field.hasAttribute("required") && !field.value.trim()) {
            isValid = false
            errorMessage = "This field is required"
        }

        // Email validation
        if (field.type === "email" && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(field.value.trim())) {
                isValid = false
                errorMessage = "Please enter a valid email address"
            }
        }

        // Update UI
        if (isValid) {
            formGroup.classList.remove("error")
            formGroup.classList.add("success")
            errorElement.textContent = ""
        } else {
            formGroup.classList.remove("success")
            formGroup.classList.add("error")
            errorElement.textContent = errorMessage
        }

        return isValid
    }

    clearFieldError(field) {
        const formGroup = field.closest(".form-group")
        formGroup.classList.remove("error")

        const errorElement = formGroup.querySelector(".error-message")
        errorElement.textContent = ""
    }

    async handleFormSubmit(e) {
        e.preventDefault()

        // Validate all fields
        const inputs = this.contactForm.querySelectorAll("input[required], select[required], textarea[required]")
        let isFormValid = true

        inputs.forEach((input) => {
            if (!this.validateField(input)) {
                isFormValid = false
            }
        })

        if (!isFormValid) {
            this.showNotification("Please fill in all required fields correctly", "error")
            return
        }

        // Show loading state
        this.setLoadingState(true)

        try {
            // Simulate form submission
            await this.simulateFormSubmission()

            // Show success
            this.contactForm.style.display = "none"
            if (this.successMessage) {
                this.successMessage.style.display = "block"
                this.successMessage.scrollIntoView({ behavior: "smooth" })
            }

            this.showNotification("Message sent successfully!", "success")
        } catch (error) {
            console.error("Form submission error:", error)
            this.showNotification("Failed to send message. Please try again.", "error")
        } finally {
            this.setLoadingState(false)
        }
    }

    async simulateFormSubmission() {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000)
        })
    }

    setLoadingState(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading
        }

        if (this.btnText) {
            this.btnText.style.display = isLoading ? "none" : "inline"
        }

        if (this.btnLoading) {
            this.btnLoading.style.display = isLoading ? "inline" : "none"
        }
    }

    animateFormElements() {
        // Animate form groups
        const formGroups = this.contactForm.querySelectorAll(".form-group")
        formGroups.forEach((group, index) => {
            group.style.opacity = "0"
            group.style.transform = "translateY(20px)"

            setTimeout(() => {
                group.style.transition = "opacity 0.6s ease, transform 0.6s ease"
                group.style.opacity = "1"
                group.style.transform = "translateY(0)"
            }, index * 100)
        })

        // Animate info cards
        const infoCards = document.querySelectorAll(".info-card")
        infoCards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateX(20px)"

            setTimeout(
                () => {
                    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
                    card.style.opacity = "1"
                    card.style.transform = "translateX(0)"
                },
                (index + 5) * 100,
            )
        })
    }

    showNotification(message, type = "info") {
        // Create notification container if it doesn't exist
        let container = document.getElementById("notificationContainer")
        if (!container) {
            container = document.createElement("div")
            container.id = "notificationContainer"
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `
            document.body.appendChild(container)
        }

        // Create notification
        const notification = document.createElement("div")
        notification.style.cssText = `
            background: var(--card);
            border: 1px solid var(--border);
            border-left: 4px solid var(--${type === "error" ? "error" : type === "success" ? "success" : "accent"});
            border-radius: 8px;
            padding: 1rem;
            color: var(--foreground);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            animation: slideInNotification 0.3s ease forwards;
            cursor: pointer;
        `

        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button style="background: none; border: none; color: var(--foreground-muted); cursor: pointer; font-size: 1.2rem; margin-left: 1rem;">×</button>
            </div>
        `

        // Add click to dismiss
        notification.addEventListener("click", () => {
            notification.style.animation = "slideOutNotification 0.3s ease forwards"
            setTimeout(() => notification.remove(), 300)
        })

        container.appendChild(notification)

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = "slideOutNotification 0.3s ease forwards"
                setTimeout(() => notification.remove(), 300)
            }
        }, 5000)
    }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    // Add CSS animations
    const style = document.createElement("style")
    style.textContent = `
        @keyframes rippleExpand {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(25); opacity: 0; }
        }
        
        @keyframes sparkleAnimation {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        
        @keyframes slideInNotification {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutNotification {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `
    document.head.appendChild(style)

    // Initialize loading screen
    const loadingScreen = new LoadingScreenManager({
        duration: 2000, // 2 seconds
        onComplete: () => {
            console.log("Contact page loaded successfully!")
        },
    })
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        // Re-animate elements when page becomes visible
        const formGroups = document.querySelectorAll(".form-group")
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.style.transform = "translateY(-5px)"
                setTimeout(() => {
                    group.style.transform = "translateY(0)"
                }, 200)
            }, index * 50)
        })
    }
})