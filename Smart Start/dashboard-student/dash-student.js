// ===== DASHBOARD MANAGER =====
class DashboardManager {
    constructor() {
        this.currentUser = {
            name: "Alex Johnson",
            completedConsultations: 12,
            upcomingAppointments: 3,
            rating: 4.8,
        }

        this.init()
    }

    init() {
        this.setupEventListeners()
        this.animateElements()
        this.initializeInteractiveFeatures()

        // Show welcome notification
        setTimeout(() => {
            this.showNotification("Welcome back! You have 3 upcoming appointments.", "info")
        }, 1000)
    }

    setupEventListeners() {
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
        const hamburger = document.getElementById("hamburger")
        const navMenu = document.getElementById("navMenu")

        if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
                navMenu.classList.toggle("active")
                hamburger.classList.toggle("active")
            })
        }

        // Modal events
        const modal = document.getElementById("bookingModal")
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    this.closeBookingModal()
                }
            })
        }

        // Search mentors button
        const searchBtn = document.getElementById("searchMentorsBtn")
        if (searchBtn) {
            searchBtn.addEventListener("click", (e) => {
                e.preventDefault()
                if (this.validateBookingForm()) {
                    this.showNotification("Searching for available mentors...", "success")
                    this.closeBookingModal()
                }
            })
        }

        // Appointment actions
        this.setupAppointmentActions()

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeBookingModal()
            }
        })
    }

    setupAppointmentActions() {
        const appointmentItems = document.querySelectorAll(".appointment-item")

        appointmentItems.forEach((item, index) => {
            const rescheduleBtn = item.querySelector(".btn-outline")
            const joinBtn = item.querySelector(".btn-primary")

            if (rescheduleBtn) {
                rescheduleBtn.addEventListener("click", (e) => {
                    e.stopPropagation()
                    this.rescheduleAppointment(item.dataset.appointmentId || `app-${index + 1}`)
                })
            }

            if (joinBtn && !joinBtn.disabled) {
                joinBtn.addEventListener("click", (e) => {
                    e.stopPropagation()
                    this.joinAppointment(item.dataset.appointmentId || `app-${index + 1}`)
                })
            }
        })
    }

    animateElements() {
        // Stagger animation for cards
        const cards = document.querySelectorAll(".card")
        cards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"

            setTimeout(() => {
                card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
                card.style.opacity = "1"
                card.style.transform = "translateY(0)"
            }, index * 100)
        })

        // Animate stats
        this.animateStats()

        // Animate progress bars
        setTimeout(() => this.animateProgressBars(), 500)
    }

    animateStats() {
        const statNumbers = document.querySelectorAll(".stat-number")

        statNumbers.forEach((stat) => {
            const finalValue = Number.parseFloat(stat.textContent)
            let currentValue = 0
            const increment = finalValue / 50

            const counter = setInterval(() => {
                currentValue += increment
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue % 1 === 0 ? finalValue : finalValue.toFixed(1)
                    clearInterval(counter)
                } else {
                    stat.textContent = currentValue % 1 === 0 ? Math.floor(currentValue) : currentValue.toFixed(1)
                }
            }, 30)
        })
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll(".progress-fill-career")

        progressBars.forEach((bar) => {
            const width = bar.style.width
            bar.style.width = "0"

            setTimeout(() => {
                bar.style.width = width
            }, 200)
        })
    }

    initializeInteractiveFeatures() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll(".btn")
        buttons.forEach((button) => {
            button.addEventListener("click", this.createRippleEffect)
        })

        // Add hover effects to cards
        const cards = document.querySelectorAll(".card")
        cards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-8px)"
            })

            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0)"
            })
        })
    }

    createRippleEffect(e) {
        const button = e.currentTarget
        const ripple = document.createElement("span")
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `

        button.style.position = "relative"
        button.style.overflow = "hidden"
        button.appendChild(ripple)

        setTimeout(() => ripple.remove(), 600)
    }

    // Modal functions
    openBookingModal() {
        const modal = document.getElementById("bookingModal")
        if (modal) {
            modal.classList.add("active")
            document.body.style.overflow = "hidden"
        }
    }

    closeBookingModal() {
        const modal = document.getElementById("bookingModal")
        if (modal) {
            modal.classList.remove("active")
            document.body.style.overflow = "auto"
        }
    }

    // Action methods
    rescheduleAppointment(appointmentId) {
        this.showNotification(`Rescheduling appointment ${appointmentId}`, "info")
        console.log(`Rescheduling appointment: ${appointmentId}`)
    }

    joinAppointment(appointmentId) {
        this.showNotification(`Joining appointment ${appointmentId}...`, "success")
        console.log(`Joining appointment: ${appointmentId}`)
    }

    viewMentorProfile(mentorId) {
        const mentorNames = {
            1: "Dr. Leila Hassan",
            2: "Prof. Fatima Ali",
        }

        this.showNotification(`Viewing ${mentorNames[mentorId] || "mentor"}'s profile`, "info")
        console.log(`Viewing mentor profile: ${mentorId}`)
    }

    validateBookingForm() {
        const specialty = document.querySelector("select").value
        const consultationType = document.querySelector('input[name="consultationType"]:checked')
        const description = document.querySelector("textarea").value.trim()

        if (!specialty) {
            this.showNotification("Please select a field", "error")
            return false
        }

        if (!consultationType) {
            this.showNotification("Please select a consultation type", "error")
            return false
        }

        if (!description) {
            this.showNotification("Please provide a brief description", "error")
            return false
        }

        return true
    }

    showNotification(message, type = "info") {
        const container = document.getElementById("notificationsContainer")
        if (!container) return

        const notification = document.createElement("div")
        notification.className = `notification notification-${type}`

        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

        container.appendChild(notification)

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = "slideOut 0.3s ease forwards"
                setTimeout(() => notification.remove(), 300)
            }
        }, 5000)
    }
}

// ===== GLOBAL FUNCTIONS =====
function openBookingModal() {
    if (window.dashboardManager) {
        window.dashboardManager.openBookingModal()
    }
}

function closeBookingModal() {
    if (window.dashboardManager) {
        window.dashboardManager.closeBookingModal()
    }
}

function viewMentorProfile(mentorId) {
    if (window.dashboardManager) {
        window.dashboardManager.viewMentorProfile(mentorId)
    }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    // Add CSS animations
    const style = document.createElement("style")
    style.textContent = `
        @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
        }
        
        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background-color: var(--background-light);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                transition: left 0.3s ease;
                padding-top: 2rem;
                border-top: 1px solid var(--border);
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
        }
    `
    document.head.appendChild(style)

    // Initialize dashboard manager
    window.dashboardManager = new DashboardManager()
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && window.dashboardManager) {
        window.dashboardManager.animateElements()
    }
})