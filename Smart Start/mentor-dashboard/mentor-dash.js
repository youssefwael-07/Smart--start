// Enhanced Dashboard functionality
class MentorDashboard {
    constructor() {
        this.currentSection = "overview"
        this.currentMonth = new Date()
        this.earnings = {
            total: 2450,
            sessions: 2100,
            bonus: 250,
            tips: 100,
        }
        this.userPhotos = {
            mentor: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            ahmed: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            fatima: "https://images.unsplash.com/photo-1544005313944-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
            omar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            layla: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            sara: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face",
            youssef: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            nour: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            zaid: "https://images.unsplash.com/photo-1507591064344-472988babdf9?w=150&h=150&fit=crop&crop=face",
            maria: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            hassan: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
            amina: "https://images.unsplash.com/photo-1517841905240-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
        }
        this.init()
        this.setupUserDropdown()
    }

    init() {
        this.setupNavigation()
        this.setupMobileMenu()
        this.setupEarningsCounter()
        this.setupCalendar()
        this.setupCharts()
        this.setupSearch()
        this.setupFilters()
        this.setupInteractiveElements()
        this.animateStats()
        this.setupNotifications()
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById("mobileMenuToggle")
        const sidebar = document.getElementById("sidebar")

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener("click", () => {
                sidebar.classList.toggle("open")
            })

            // Close sidebar when clicking outside on mobile
            document.addEventListener("click", (e) => {
                if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove("open")
                }
            })
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll(".nav-item")
        const sections = document.querySelectorAll(".content-section")

        navItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault()

                // Add loading effect
                this.showLoadingState()

                setTimeout(() => {
                    // Remove active class from all nav items and sections
                    navItems.forEach((nav) => nav.classList.remove("active"))
                    sections.forEach((section) => section.classList.remove("active"))

                    // Add active class to clicked nav item
                    item.classList.add("active")

                    // Show corresponding section with animation
                    const sectionId = item.dataset.section + "-section"
                    const targetSection = document.getElementById(sectionId)
                    if (targetSection) {
                        targetSection.classList.add("active")
                        this.animateSection(targetSection)
                    }

                    // Update page title
                    this.updatePageTitle(item.dataset.section)

                    // Update current section
                    this.currentSection = item.dataset.section

                    // Hide loading state
                    this.hideLoadingState()
                }, 300)
            })
        })
    }

    showLoadingState() {
        const activeSection = document.querySelector(".content-section.active")
        if (activeSection) {
            activeSection.style.opacity = "0.5"
            activeSection.style.pointerEvents = "none"
        }
    }

    hideLoadingState() {
        const activeSection = document.querySelector(".content-section.active")
        if (activeSection) {
            activeSection.style.opacity = "1"
            activeSection.style.pointerEvents = "auto"
        }
    }

    animateSection(section) {
        section.style.opacity = "0"
        section.style.transform = "translateY(20px)"

        requestAnimationFrame(() => {
            section.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            section.style.opacity = "1"
            section.style.transform = "translateY(0)"
        })
    }

    updatePageTitle(section) {
        const titles = {
            overview: "Dashboard Overview",
            earnings: "Earnings & Revenue",
            sessions: "Session Management",
            students: "My Students",
            feedback: "Student Feedback",
            profile: "Profile Settings",
        }

        const subtitles = {
            overview: "Welcome back, Dr. Sarah Johnson",
            earnings: "Track your income and payments",
            sessions: "Manage your consultation schedule",
            students: "Connect with your mentees",
            feedback: "Reviews and ratings from students",
            profile: "Update your mentor profile",
        }

        const titleElement = document.getElementById("page-title")
        const subtitleElement = document.getElementById("page-subtitle")

        if (titleElement && subtitleElement) {
            // Animate title change
            titleElement.style.opacity = "0"
            subtitleElement.style.opacity = "0"

            setTimeout(() => {
                titleElement.textContent = titles[section] || "Dashboard"
                subtitleElement.textContent = subtitles[section] || ""
                titleElement.style.opacity = "1"
                subtitleElement.style.opacity = "1"
            }, 200)
        }
    }

    setupEarningsCounter() {
        const totalEarningsElement = document.getElementById("totalEarnings")
        if (totalEarningsElement) {
            this.animateCounter(totalEarningsElement, 0, this.earnings.total, 2000)
        }

        // Setup earnings filter
        const earningsFilter = document.getElementById("earningsFilter")
        if (earningsFilter) {
            earningsFilter.addEventListener("change", (e) => {
                this.updateEarningsDisplay(e.target.value)
            })
        }
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now()
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Use easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const current = Math.floor(start + (end - start) * easeOutQuart)

            element.textContent = current.toLocaleString()

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }

    updateEarningsDisplay(period) {
        const earnings = {
            month: { total: 2450, sessions: 2100, bonus: 250, tips: 100 },
            quarter: { total: 7200, sessions: 6300, bonus: 600, tips: 300 },
            year: { total: 28800, sessions: 25200, bonus: 2400, tips: 1200 },
        }

        const data = earnings[period]
        if (data) {
            this.animateCounter(document.getElementById("totalEarnings"), 0, data.total, 1000)

            // Update breakdown cards with staggered animation
            const breakdownCards = document.querySelectorAll(".breakdown-amount")
            if (breakdownCards.length >= 3) {
                setTimeout(() => this.animateCounter(breakdownCards[0], 0, data.sessions, 1000), 100)
                setTimeout(() => this.animateCounter(breakdownCards[1], 0, data.bonus, 1000), 200)
                setTimeout(() => this.animateCounter(breakdownCards[2], 0, data.tips, 1000), 300)
            }
        }
    }

    setupCalendar() {
        const prevButton = document.getElementById("prevMonth")
        const nextButton = document.getElementById("nextMonth")
        const currentMonthElement = document.getElementById("currentMonth")
        const calendarGrid = document.getElementById("calendarGrid")

        if (prevButton && nextButton && currentMonthElement && calendarGrid) {
            prevButton.addEventListener("click", () => {
                this.currentMonth.setMonth(this.currentMonth.getMonth() - 1)
                this.renderCalendar()
            })

            nextButton.addEventListener("click", () => {
                this.currentMonth.setMonth(this.currentMonth.getMonth() + 1)
                this.renderCalendar()
            })

            this.renderCalendar()
        }
    }

    renderCalendar() {
        const currentMonthElement = document.getElementById("currentMonth")
        const calendarGrid = document.getElementById("calendarGrid")

        if (!currentMonthElement || !calendarGrid) return

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]

        // Animate month change
        currentMonthElement.style.opacity = "0"
        setTimeout(() => {
            currentMonthElement.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`
            currentMonthElement.style.opacity = "1"
        }, 150)

        // Clear calendar with fade out
        calendarGrid.style.opacity = "0"

        setTimeout(() => {
            calendarGrid.innerHTML = ""

            // Add day headers
            const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            dayHeaders.forEach((day) => {
                const dayHeader = document.createElement("div")
                dayHeader.textContent = day
                dayHeader.style.fontWeight = "bold"
                dayHeader.style.textAlign = "center"
                dayHeader.style.padding = "0.5rem"
                dayHeader.style.color = "var(--foreground-muted)"
                calendarGrid.appendChild(dayHeader)
            })

            // Get first day of month and number of days
            const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1)
            const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0)
            const startDate = firstDay.getDay()
            const daysInMonth = lastDay.getDate()

            // Add empty cells for days before month starts
            for (let i = 0; i < startDate; i++) {
                const emptyDay = document.createElement("div")
                emptyDay.className = "calendar-day"
                calendarGrid.appendChild(emptyDay)
            }

            // Add days of month with animation
            const sessionsData = [5, 12, 18, 25] // Sample session days
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement("div")
                dayElement.className = "calendar-day"
                dayElement.textContent = day
                dayElement.style.opacity = "0"
                dayElement.style.transform = "scale(0.8)"

                if (sessionsData.includes(day)) {
                    dayElement.classList.add("has-session")
                    dayElement.title = "You have sessions on this day"
                }

                dayElement.addEventListener("click", (e) => {
                    this.selectCalendarDay(day, e.target)
                })

                calendarGrid.appendChild(dayElement)

                // Animate day appearance
                setTimeout(() => {
                    dayElement.style.transition = "all 0.3s ease"
                    dayElement.style.opacity = "1"
                    dayElement.style.transform = "scale(1)"
                }, day * 20)
            }

            // Fade in calendar
            calendarGrid.style.opacity = "1"
        }, 200)
    }

    selectCalendarDay(day, element) {
        // Remove previous selection
        document.querySelectorAll(".calendar-day.selected").forEach((el) => {
            el.classList.remove("selected")
        })

        // Add selection to clicked day with animation
        element.classList.add("selected")
        element.style.transform = "scale(1.1)"
        setTimeout(() => {
            element.style.transform = "scale(1)"
        }, 200)

        this.showNotification(`Selected ${this.currentMonth.toLocaleDateString("en-US", { month: "long" })} ${day}`, "info")
    }

    setupCharts() {
        // Enhanced chart implementation with animations
        this.createEarningsChart()
        this.createSessionsChart()
    }

    createEarningsChart() {
        const canvas = document.getElementById("earningsChart")
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio)
        const height = (canvas.height = 200 * window.devicePixelRatio)
        canvas.style.width = canvas.offsetWidth + "px"
        canvas.style.height = "200px"
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        // Sample data for the last 6 months
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const earnings = [1800, 2100, 1950, 2300, 2200, 2450]
        const maxEarning = Math.max(...earnings)
        const canvasWidth = canvas.offsetWidth
        const canvasHeight = 200

        // Animate chart drawing
        let animationProgress = 0
        const animateChart = () => {
            animationProgress += 0.02
            if (animationProgress > 1) animationProgress = 1

            // Clear canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
            gradient.addColorStop(0, "#0891b2")
            gradient.addColorStop(1, "#22d3ee")

            // Set styles
            ctx.strokeStyle = gradient
            ctx.fillStyle = "#0891b2"
            ctx.lineWidth = 3
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            // Draw animated line chart
            ctx.beginPath()
            earnings.forEach((earning, index) => {
                const x = (index / (earnings.length - 1)) * (canvasWidth - 40) + 20
                const y = canvasHeight - 40 - (earning / maxEarning) * (canvasHeight - 80)

                if (index <= earnings.length * animationProgress) {
                    if (index === 0) {
                        ctx.moveTo(x, y)
                    } else {
                        ctx.lineTo(x, y)
                    }

                    // Draw animated points
                    ctx.save()
                    ctx.fillStyle = "#ffffff"
                    ctx.beginPath()
                    ctx.arc(x, y, 4, 0, 2 * Math.PI)
                    ctx.fill()
                    ctx.strokeStyle = "#0891b2"
                    ctx.lineWidth = 2
                    ctx.stroke()
                    ctx.restore()
                }
            })
            ctx.stroke()

            // Draw labels
            ctx.fillStyle = "#cbd5e1"
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            months.forEach((month, index) => {
                if (index <= months.length * animationProgress) {
                    const x = (index / (months.length - 1)) * (canvasWidth - 40) + 20
                    ctx.fillText(month, x, canvasHeight - 10)
                }
            })

            if (animationProgress < 1) {
                requestAnimationFrame(animateChart)
            }
        }

        // Start animation after a delay
        setTimeout(() => {
            requestAnimationFrame(animateChart)
        }, 500)
    }

    createSessionsChart() {
        const canvas = document.getElementById("sessionsChart")
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio)
        const height = (canvas.height = 200 * window.devicePixelRatio)
        canvas.style.width = canvas.offsetWidth + "px"
        canvas.style.height = "200px"
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        // Sample data
        const sessionTypes = ["Career Guidance", "Resume Review", "Interview Prep", "Skill Development"]
        const sessionCounts = [45, 32, 28, 42]
        const colors = ["#254d70", "#0891b2", "#3a6d9a", "#22d3ee"]
        const total = sessionCounts.reduce((a, b) => a + b, 0)
        const canvasWidth = canvas.offsetWidth
        const canvasHeight = 200

        // Animate pie chart
        let animationProgress = 0
        const animatePieChart = () => {
            animationProgress += 0.02
            if (animationProgress > 1) animationProgress = 1

            // Clear canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)

            // Draw animated pie chart
            const centerX = canvasWidth / 2
            const centerY = canvasHeight / 2
            const radius = Math.min(canvasWidth, canvasHeight) / 2 - 40

            let currentAngle = -Math.PI / 2

            sessionCounts.forEach((count, index) => {
                const sliceAngle = (count / total) * 2 * Math.PI * animationProgress

                ctx.beginPath()
                ctx.moveTo(centerX, centerY)
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
                ctx.closePath()
                ctx.fillStyle = colors[index]
                ctx.fill()

                // Add subtle shadow
                ctx.shadowColor = "rgba(0,0,0,0.1)"
                ctx.shadowBlur = 5
                ctx.shadowOffsetX = 2
                ctx.shadowOffsetY = 2

                currentAngle += sliceAngle
            })

            // Reset shadow
            ctx.shadowColor = "transparent"
            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0

            // Draw center circle for donut effect
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
            ctx.fillStyle = "#1e293b"
            ctx.fill()

            if (animationProgress < 1) {
                requestAnimationFrame(animatePieChart)
            }
        }

        // Start animation after a delay
        setTimeout(() => {
            requestAnimationFrame(animatePieChart)
        }, 800)
    }

    setupSearch() {
        const searchInput = document.getElementById("studentSearch")
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.filterStudents(e.target.value)
            })
        }
    }

    filterStudents(searchTerm) {
        const studentCards = document.querySelectorAll(".student-card")
        const term = searchTerm.toLowerCase()

        studentCards.forEach((card) => {
            const studentName = card.querySelector("h4").textContent.toLowerCase()
            const studentField = card.querySelector("p").textContent.toLowerCase()

            if (studentName.includes(term) || studentField.includes(term)) {
                card.style.display = "flex"
                card.style.animation = "fadeInUp 0.3s ease-out"
            } else {
                card.style.display = "none"
            }
        })
    }

    setupFilters() {
        // Add filter functionality for different sections
        const filterButtons = document.querySelectorAll("[data-filter]")
        filterButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const filterType = e.target.dataset.filter
                this.applyFilter(filterType)
            })
        })
    }

    applyFilter(filterType) {
        // Implementation for filtering different content types
        console.log(`Applying filter: ${filterType}`)
    }

    setupInteractiveElements() {
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll(".stat-card, .chart-card, .student-card, .activity-item")
        cards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-8px)"
                card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)"
            })

            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0)"
                card.style.boxShadow = ""
            })
        })

        // Setup profile form
        const profileForm = document.getElementById("profileForm")
        if (profileForm) {
            profileForm.addEventListener("submit", (e) => {
                e.preventDefault()
                this.saveProfile()
            })
        }

        // Setup floating action button
        const floatingAction = document.querySelector(".floating-action")
        if (floatingAction) {
            floatingAction.addEventListener("click", () => {
                this.showQuickActions()
            })
        }
    }

    saveProfile() {
        // Simulate saving profile with loading state
        const submitButton = document.querySelector('#profileForm button[type="submit"]')
        const originalText = submitButton.textContent

        submitButton.textContent = "Saving..."
        submitButton.disabled = true

        setTimeout(() => {
            submitButton.textContent = "Saved!"
            submitButton.style.background = "var(--success)"

            setTimeout(() => {
                submitButton.textContent = originalText
                submitButton.disabled = false
                submitButton.style.background = ""
            }, 2000)

            this.showNotification("Profile updated successfully!", "success")
        }, 1500)
    }

    showQuickActions() {
        // Create and show quick actions modal
        const modal = document.createElement("div")
        modal.className = "quick-actions-modal"
        modal.innerHTML = `
      <div class="modal-content">
        <h3>Quick Actions</h3>
        <div class="quick-actions-grid">
          <button class="quick-action-btn" data-action="schedule">
            <i class="fas fa-calendar-plus"></i>
            Schedule Session
          </button>
          <button class="quick-action-btn" data-action="message">
            <i class="fas fa-envelope"></i>
            Send Message
          </button>
          <button class="quick-action-btn" data-action="report">
            <i class="fas fa-chart-bar"></i>
            Generate Report
          </button>
          <button class="quick-action-btn" data-action="settings">
            <i class="fas fa-cog"></i>
            Settings
          </button>
        </div>
        <button class="close-modal">Close</button>
      </div>
    `

        modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `

        document.body.appendChild(modal)

        // Animate modal appearance
        requestAnimationFrame(() => {
            modal.style.opacity = "1"
        })

        // Setup modal interactions
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("close-modal")) {
                this.closeModal(modal)
            }

            if (e.target.classList.contains("quick-action-btn")) {
                const action = e.target.dataset.action
                this.executeQuickAction(action)
                this.closeModal(modal)
            }
        })
    }

    closeModal(modal) {
        modal.style.opacity = "0"
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal)
            }
        }, 300)
    }

    executeQuickAction(action) {
        const actions = {
            schedule: "Opening scheduling interface...",
            message: "Opening message composer...",
            report: "Generating analytics report...",
            settings: "Opening settings panel...",
        }

        this.showNotification(actions[action] || "Action executed!", "info")
    }

    animateStats() {
        // Animate stat cards on page load
        const statCards = document.querySelectorAll(".stat-card")
        statCards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateY(30px)"

            setTimeout(() => {
                card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                card.style.opacity = "1"
                card.style.transform = "translateY(0)"
            }, index * 100)
        })
    }

    setupNotifications() {
        // Setup notification bell functionality
        const notificationBell = document.querySelector(".notification-bell")
        if (notificationBell) {
            notificationBell.addEventListener("click", () => {
                this.showNotifications()
            })
        }
    }

    showNotifications() {
            const notifications = [
                { type: "session", message: "New session request from Ahmed Hassan", time: "5 min ago" },
                { type: "payment", message: "Payment received: $25", time: "1 hour ago" },
                { type: "review", message: "New 5-star review from Fatima", time: "2 hours ago" },
            ]

            // Create notifications dropdown
            const dropdown = document.createElement("div")
            dropdown.className = "notifications-dropdown"
            dropdown.innerHTML = `
      <div class="notifications-header">
        <h4>Notifications</h4>
        <span class="notification-count">${notifications.length}</span>
      </div>
      <div class="notifications-list">
        ${notifications
          .map(
            (notif) => `
          <div class="notification-item">
            <div class="notification-icon">
              <i class="fas fa-${notif.type === "session" ? "calendar" : notif.type === "payment" ? "dollar-sign" : "star"}"></i>
            </div>
            <div class="notification-content">
              <p>${notif.message}</p>
              <span class="notification-time">${notif.time}</span>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="notifications-footer">
        <button class="view-all-btn">View All Notifications</button>
      </div>
    `

    // Position and show dropdown
    const bell = document.querySelector(".notification-bell")
    const rect = bell.getBoundingClientRect()
    dropdown.style.cssText = `
      position: fixed;
      top: ${rect.bottom + 10}px;
      right: ${window.innerWidth - rect.right}px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1rem;
      min-width: 300px;
      max-height: 400px;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    `

    document.body.appendChild(dropdown)

    // Animate dropdown
    requestAnimationFrame(() => {
      dropdown.style.opacity = "1"
      dropdown.style.transform = "translateY(0)"
    })

    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target) && !bell.contains(e.target)) {
        dropdown.style.opacity = "0"
        dropdown.style.transform = "translateY(-10px)"
        setTimeout(() => {
          if (document.body.contains(dropdown)) {
            document.body.removeChild(dropdown)
          }
        }, 300)
        document.removeEventListener("click", closeDropdown)
      }
    }

    setTimeout(() => {
      document.addEventListener("click", closeDropdown)
    }, 100)
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`

    const icons = {
      info: "fas fa-info-circle",
      success: "fas fa-check-circle",
      warning: "fas fa-exclamation-triangle",
      error: "fas fa-times-circle",
    }

    notification.innerHTML = `
      <div class="notification-content">
        <i class="${icons[type]}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 10001;
      transform: translateX(400px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `

    // Add type-specific styling
    const typeColors = {
      info: "#0891b2",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
    }

    notification.style.borderLeftColor = typeColors[type]
    notification.style.borderLeftWidth = "4px"

    document.body.appendChild(notification)

    // Animate notification in
    requestAnimationFrame(() => {
      notification.style.transform = "translateX(0)"
    })

    // Setup close button
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      this.closeNotification(notification)
    })

    // Auto-close after 5 seconds
    setTimeout(() => {
      this.closeNotification(notification)
    }, 5000)
  }

  closeNotification(notification) {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dashboard = new MentorDashboard()

  // Add some CSS for dynamic elements
  const style = document.createElement("style")
  style.textContent = `
    .quick-actions-modal .modal-content {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .quick-action-btn {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .quick-action-btn:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(37, 77, 112, 0.3);
    }

    .close-modal {
      background: var(--border);
      color: var(--foreground);
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s ease;
    }

    .close-modal:hover {
      background: var(--card-hover);
    }

    .notifications-dropdown {
      color: var(--foreground);
    }

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .notification-count {
      background: var(--accent);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.8rem;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border);
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-icon {
      background: var(--accent);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-content p {
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .notification-time {
      color: var(--foreground-muted);
      font-size: 0.8rem;
    }

    .view-all-btn {
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem;
      width: 100%;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.3s ease;
    }

    .view-all-btn:hover {
      background: var(--primary-light);
    }

    .notification {
      color: var(--foreground);
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .notification-close {
      background: none;
      border: none;
      color: var(--foreground-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }

    .notification-close:hover {
      background: var(--card-hover);
      color: var(--foreground);
    }
  `
  document.head.appendChild(style)

  console.log("🚀 Enhanced Mentor Dashboard initialized successfully!")
})

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = MentorDashboard
}