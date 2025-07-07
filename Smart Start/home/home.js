// ===== NAVIGATION CLASS =====
class Navigation {
    constructor() {
        this.navbar = document.querySelector(".navbar")
        this.hamburger = document.getElementById("hamburger")
        this.navMenu = document.getElementById("navMenu")
        this.userProfile = document.getElementById("userProfile")
        this.dropdown = document.getElementById("dropdown")
        this.init()
    }

    init() {
        this.setupEventListeners()
        this.setupAccessibility()
    }

    setupEventListeners() {
        if (this.hamburger) {
            this.hamburger.addEventListener("click", this.toggleMobileMenu.bind(this))
        }

        if (this.userProfile) {
            const avatarBtn = this.userProfile.querySelector(".user-avatar-btn")
            if (avatarBtn) {
                avatarBtn.addEventListener("click", this.toggleUserDropdown.bind(this))
            }
        }

        document.addEventListener("click", this.handleOutsideClick.bind(this))
        window.addEventListener("resize", this.handleResize.bind(this))
        document.addEventListener("keydown", this.handleKeyboardNav.bind(this))
    }

    setupAccessibility() {
        if (this.hamburger) {
            this.hamburger.setAttribute("aria-expanded", "false")
        }
        if (this.dropdown) {
            this.dropdown.setAttribute("aria-hidden", "true")
        }
        this.setupFocusManagement()
    }

    toggleMobileMenu() {
        const isOpen = this.navMenu.classList.contains("active")
        if (isOpen) {
            this.closeMobileMenu()
        } else {
            this.openMobileMenu()
        }
    }

    openMobileMenu() {
        this.navMenu.classList.add("active")
        this.hamburger.setAttribute("aria-expanded", "true")
        document.body.style.overflow = "hidden"
        const firstMenuItem = this.navMenu.querySelector(".nav-link")
        if (firstMenuItem) {
            firstMenuItem.focus()
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove("active")
        this.hamburger.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
        this.hamburger.focus()
    }

    toggleUserDropdown(e) {
        e.stopPropagation()
        const isOpen = this.dropdown.getAttribute("aria-hidden") === "false"
        if (isOpen) {
            this.closeUserDropdown()
        } else {
            this.openUserDropdown()
        }
    }

    openUserDropdown() {
        this.dropdown.setAttribute("aria-hidden", "false")
        const avatarBtn = this.userProfile.querySelector(".user-avatar-btn")
        avatarBtn.setAttribute("aria-expanded", "true")
        const firstItem = this.dropdown.querySelector("a")
        if (firstItem) {
            setTimeout(() => firstItem.focus(), 100)
        }
    }

    closeUserDropdown() {
        this.dropdown.setAttribute("aria-hidden", "true")
        const avatarBtn = this.userProfile.querySelector(".user-avatar-btn")
        avatarBtn.setAttribute("aria-expanded", "false")
    }

    handleOutsideClick(e) {
        if (
            this.navMenu.classList.contains("active") &&
            !this.navMenu.contains(e.target) &&
            !this.hamburger.contains(e.target)
        ) {
            this.closeMobileMenu()
        }

        if (this.dropdown.getAttribute("aria-hidden") === "false" && !this.userProfile.contains(e.target)) {
            this.closeUserDropdown()
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.navMenu.classList.contains("active")) {
            this.closeMobileMenu()
        }
    }

    handleKeyboardNav(e) {
        if (e.key === "Escape") {
            if (this.navMenu.classList.contains("active")) {
                this.closeMobileMenu()
            }
            if (this.dropdown.getAttribute("aria-hidden") === "false") {
                this.closeUserDropdown()
            }
        }

        if (this.dropdown.getAttribute("aria-hidden") === "false") {
            this.handleDropdownArrowKeys(e)
        }

        if (this.navMenu.classList.contains("active")) {
            this.handleMobileMenuArrowKeys(e)
        }
    }

    handleDropdownArrowKeys(e) {
        const items = Array.from(this.dropdown.querySelectorAll("a"))
        const currentIndex = items.indexOf(document.activeElement)

        if (e.key === "ArrowDown") {
            e.preventDefault()
            const nextIndex = (currentIndex + 1) % items.length
            items[nextIndex].focus()
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
            items[prevIndex].focus()
        }
    }

    handleMobileMenuArrowKeys(e) {
        const items = Array.from(this.navMenu.querySelectorAll(".nav-link"))
        const currentIndex = items.indexOf(document.activeElement)

        if (e.key === "ArrowDown") {
            e.preventDefault()
            const nextIndex = (currentIndex + 1) % items.length
            items[nextIndex].focus()
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
            items[prevIndex].focus()
        }
    }

    setupFocusManagement() {
        this.navMenu.addEventListener("keydown", (e) => {
            if (!this.navMenu.classList.contains("active")) return

            if (e.key === "Tab") {
                const focusableElements = this.navMenu.querySelectorAll(".nav-link")
                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        })

        this.dropdown.addEventListener("keydown", (e) => {
            if (this.dropdown.getAttribute("aria-hidden") === "true") return

            if (e.key === "Tab") {
                const focusableElements = this.dropdown.querySelectorAll("a")
                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        })
    }
}

// ===== MAIN WEBSITE CLASS =====
class SmartStartWebsite {
    constructor() {
        this.init()
    }

    init() {
        this.setupEventListeners()
        this.setupIntersectionObserver()
        this.setupFormValidation()
        this.setupSmoothScrolling()
        this.setupStatsAnimation()
        this.setupNavbarScroll()
    }

    setupEventListeners() {
        const contactForm = document.getElementById("contact-form")
        if (contactForm) {
            contactForm.addEventListener("submit", this.handleContactForm.bind(this))
        }

        const newsletterForm = document.getElementById("newsletter-form")
        if (newsletterForm) {
            newsletterForm.addEventListener("submit", this.handleNewsletterForm.bind(this))
        }

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", this.handleSmoothScroll.bind(this))
        })

        document.addEventListener("keydown", this.handleKeyboardNavigation.bind(this))
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in-up")
                    this.updateActiveNavLink(entry.target.id)
                }
            })
        }, observerOptions)

        document.querySelectorAll("section[id]").forEach((section) => {
            observer.observe(section)
        })
    }

    updateActiveNavLink(sectionId) {
        document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.remove("active")
        })

        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)
        if (activeLink) {
            activeLink.classList.add("active")
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll("form")
        forms.forEach((form) => {
            const inputs = form.querySelectorAll("input, textarea, select")
            inputs.forEach((input) => {
                input.addEventListener("blur", () => this.validateField(input))
                input.addEventListener("input", () => this.clearFieldError(input))
            })
        })
    }

    validateField(field) {
        const value = field.value.trim()
        const fieldName = field.name
        let isValid = true
        let errorMessage = ""

        this.clearFieldError(field)

        if (field.hasAttribute("required") && !value) {
            isValid = false
            errorMessage = `${this.getFieldLabel(fieldName)} is required`
        }

        if (field.type === "email" && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                isValid = false
                errorMessage = "Please enter a valid email address"
            }
        }

        if (field.type === "tel" && value) {
            const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
            if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
                isValid = false
                errorMessage = "Please enter a valid phone number"
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage)
        }

        return isValid
    }

    showFieldError(field, message) {
        const formGroup = field.closest(".form-group")
        const errorElement = formGroup.querySelector(".error-message")

        formGroup.classList.add("error")
        if (errorElement) {
            errorElement.textContent = message
        }

        field.setAttribute("aria-invalid", "true")
        field.setAttribute("aria-describedby", `${field.id}-error`)
    }

    clearFieldError(field) {
        const formGroup = field.closest(".form-group")
        const errorElement = formGroup.querySelector(".error-message")

        formGroup.classList.remove("error")
        if (errorElement) {
            errorElement.textContent = ""
        }

        field.removeAttribute("aria-invalid")
        field.removeAttribute("aria-describedby")
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: "Name",
            email: "Email",
            phone: "Phone",
            service: "Service",
            message: "Message",
        }
        return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }

    async handleContactForm(e) {
        e.preventDefault()

        const form = e.target
        const submitButton = form.querySelector('button[type="submit"]')
        const buttonText = submitButton.querySelector(".btn-text")
        const buttonLoading = submitButton.querySelector(".btn-loading")

        const inputs = form.querySelectorAll("input, textarea, select")
        let isFormValid = true

        inputs.forEach((input) => {
            if (!this.validateField(input)) {
                isFormValid = false
            }
        })

        if (!isFormValid) {
            this.showNotification("Please correct the errors above", "error")
            return
        }

        submitButton.disabled = true
        buttonText.style.display = "none"
        buttonLoading.style.display = "inline"

        try {
            await this.simulateAPICall(2000)
            this.showNotification("Message sent successfully! We'll get back to you soon.", "success")
            form.reset()
        } catch (error) {
            this.showNotification("Failed to send message. Please try again.", "error")
        } finally {
            submitButton.disabled = false
            buttonText.style.display = "inline"
            buttonLoading.style.display = "none"
        }
    }

    async handleNewsletterForm(e) {
        e.preventDefault()

        const form = e.target
        const emailInput = form.querySelector('input[type="email"]')
        const submitButton = form.querySelector('button[type="submit"]')

        if (!this.validateField(emailInput)) {
            return
        }

        const originalText = submitButton.textContent
        submitButton.textContent = "Subscribing..."
        submitButton.disabled = true

        try {
            await this.simulateAPICall(1500)
            this.showNotification("Successfully subscribed to newsletter!", "success")
            form.reset()
        } catch (error) {
            this.showNotification("Failed to subscribe. Please try again.", "error")
        } finally {
            submitButton.textContent = originalText
            submitButton.disabled = false
        }
    }

    simulateAPICall(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve()
                } else {
                    reject(new Error("API Error"))
                }
            }, delay)
        })
    }

    showNotification(message, type = "info") {
        const existingNotifications = document.querySelectorAll(".notification")
        existingNotifications.forEach((notification) => notification.remove())

        const notification = document.createElement("div")
        notification.className = `notification notification-${type}`
        notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
    `

        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "var(--success)" : type === "error" ? "var(--error)" : "var(--accent)"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform var(--transition-normal);
      max-width: 400px;
    `

        document.body.appendChild(notification)

        setTimeout(() => {
            notification.style.transform = "translateX(0)"
        }, 100)

        setTimeout(() => {
            this.removeNotification(notification)
        }, 5000)

        const closeButton = notification.querySelector(".notification-close")
        closeButton.addEventListener("click", () => {
            this.removeNotification(notification)
        })
    }

    removeNotification(notification) {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 300)
    }

    setupSmoothScrolling() {
        if (!("scrollBehavior" in document.documentElement.style)) {
            this.polyfillSmoothScrolling()
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault()
        const targetId = e.currentTarget.getAttribute("href")
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
            const navbarHeight = document.querySelector(".navbar").offsetHeight
            const targetPosition = targetSection.offsetTop - navbarHeight - 20

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            })
        }
    }

    setupStatsAnimation() {
        const statsNumbers = document.querySelectorAll(".stat-number")

        const animateStats = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = Number.parseInt(entry.target.dataset.target)
                    this.animateNumber(entry.target, target)
                    observer.unobserve(entry.target)
                }
            })
        }

        const statsObserver = new IntersectionObserver(animateStats, {
            threshold: 0.5,
        })

        statsNumbers.forEach((stat) => {
            statsObserver.observe(stat)
        })
    }

    animateNumber(element, target) {
        let current = 0
        const increment = target / 50
        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                current = target
                clearInterval(timer)
            }
            element.textContent = Math.floor(current)
        }, 40)
    }

    setupNavbarScroll() {
        const navbar = document.querySelector(".navbar")
        const progressBar = document.getElementById("nav-progress")

        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY

            if (currentScrollY > 50) {
                navbar.classList.add("scrolled")
            } else {
                navbar.classList.remove("scrolled")
            }

            const scrollProgress = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            if (progressBar) {
                progressBar.style.width = `${Math.min(scrollProgress, 100)}%`
            }
        })
    }

    handleKeyboardNavigation(e) {
        if (e.key === "Escape") {
            const openDropdowns = document.querySelectorAll('.dropdown[aria-hidden="false"]')
            openDropdowns.forEach((dropdown) => {
                dropdown.setAttribute("aria-hidden", "true")
                const trigger = dropdown.previousElementSibling
                if (trigger) {
                    trigger.setAttribute("aria-expanded", "false")
                    trigger.focus()
                }
            })
        }

        if (e.key === "Tab") {
            const activeDropdown = document.querySelector('.dropdown[aria-hidden="false"]')
            if (activeDropdown) {
                const focusableElements = activeDropdown.querySelectorAll("a, button, input, select, textarea")
                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }
    }

    polyfillSmoothScrolling() {
        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2
            if (t < 1) return (c / 2) * t * t + b
            t--
            return (-c / 2) * (t * (t - 2) - 1) + b
        }

        const smoothScrollTo = (to, duration) => {
            const start = window.pageYOffset
            const change = to - start
            const startTime = performance.now()

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime
                const newPosition = easeInOutQuad(elapsed, start, change, duration)

                window.scrollTo(0, newPosition)

                if (elapsed < duration) {
                    requestAnimationFrame(animateScroll)
                }
            }

            requestAnimationFrame(animateScroll)
        }

        window.scrollTo = (x, y) => {
            if (typeof x === "object" && x.behavior === "smooth") {
                smoothScrollTo(x.top, 500)
            } else {
                window.scroll(x, y)
            }
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    // Initialize loading screen
    const fastLoader = new FastPremiumLoadingScreen({
        duration: 3000,
        onComplete: () => {
            console.log("⚡ Fast premium loading complete!")
        },
    })

    // Skip loading on repeat visits
    if (sessionStorage.getItem("hasVisited")) {
        fastLoader.skipToEnd()
    } else {
        sessionStorage.setItem("hasVisited", "true")
    }

    // Initialize navigation
    new Navigation()

    // Initialize main website functionality
    new SmartStartWebsite()
})

// ===== PERFORMANCE MONITORING =====
if ("performance" in window) {
    window.addEventListener("load", () => {
        const perfData = performance.getEntriesByType("navigation")[0]
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`)
    })
}

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
    console.error("JavaScript error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason)
    e.preventDefault()
})

// ===== EXPORT FOR EXTERNAL USE =====
if (typeof module !== "undefined" && module.exports) {
    module.exports = { FastPremiumLoadingScreen, Navigation, SmartStartWebsite }
}