// Enhanced Mentor Comparison JavaScript with Premium Loading Screen
class MentorComparison {
    constructor() {
        this.mentors = [{
                id: "1",
                name: "Sarah Chen",
                title: "Senior Product Manager",
                company: "Google • Meta",
                rating: 4.9,
                reviews: 127,
                price: 85,
                responseTime: "< 2h response",
                availability: "Available today",
                languages: ["English", "Mandarin"],
                skills: ["Product Strategy", "User Research", "Agile", "Leadership"],
                experience: 8,
                sessionTypes: ["1-on-1 Coaching", "Portfolio Review", "Career Planning"],
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format",
                badge: "featured",
                isOnline: true,
            },
            {
                id: "2",
                name: "Marcus Rodriguez",
                title: "Tech Lead & Architect",
                company: "Netflix • Spotify",
                rating: 4.8,
                reviews: 89,
                price: 95,
                responseTime: "< 4h response",
                availability: "Next week",
                languages: ["English", "Spanish"],
                skills: ["System Design", "React", "Node.js", "AWS"],
                experience: 12,
                sessionTypes: ["Code Review", "System Design", "Interview Prep"],
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
                badge: "expert",
                isOnline: false,
            },
            {
                id: "3",
                name: "Emily Johnson",
                title: "UX Director",
                company: "Apple • Airbnb",
                rating: 4.7,
                reviews: 156,
                price: 90,
                responseTime: "< 3h response",
                availability: "Available today",
                languages: ["English", "French"],
                skills: ["UX Design", "Design Systems", "User Testing", "Figma"],
                experience: 10,
                sessionTypes: ["Design Review", "Portfolio Feedback", "Career Guidance"],
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
                badge: null,
                isOnline: true,
            },
        ]

        this.favorites = ["1", "2", "3"]
        this.comparison = ["1", "2"]
        this.viewMode = "cards"
        this.sortBy = "rating"
        this.isLoading = true

        this.init()
    }

    async init() {
        document.body.style.overflow = "auto";
        document.body.style.overflow = "auto";
        await Promise.resolve()
        this.bindEvents()
        this.updateFavoritesCount()
        this.renderComparison()
        this.animateOnScroll()
        this.handleNavbarScroll()
        this.preloadImages()
    }

    async disabled_showLoadingScreen() {
        const loadingScreen = document.getElementById("loadingScreen")
        const progressFill = document.getElementById("progressFill")
        const loadingText = document.getElementById("loadingText")
        const loadingPercentage = document.getElementById("loadingPercentage")

        const loadingSteps = [
            { text: "Initializing platform...", duration: 100 },
            { text: "Loading mentor profiles...", duration: 100 },
            { text: "Setting up comparison tools...", duration: 100 },
            { text: "Preparing recommendations...", duration: 30 },
            { text: "Finalizing interface...", duration: 20 },
            { text: "Ready to launch!", duration: 10 },
        ]

        let currentProgress = 0
        const totalSteps = loadingSteps.length

        for (let i = 0; i < loadingSteps.length; i++) {
            const step = loadingSteps[i]
            loadingText.textContent = step.text

            const targetProgress = ((i + 1) / totalSteps) * 100

            // Animate progress bar
            await this.animateProgress(progressFill, loadingPercentage, currentProgress, targetProgress, step.duration)
            currentProgress = targetProgress
        }

        // Hide loading screen with fade out
        setTimeout(() => {
            loadingScreen.classList.add("hidden")
            document.body.style.overflow = ""
            this.isLoading = false
        }, 500)
    }

    animateProgress(progressFill, percentageElement, startProgress, endProgress, duration) {
        return new Promise((resolve) => {
            const startTime = Date.now()
            const progressDiff = endProgress - startProgress

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3)
                const currentProgress = startProgress + progressDiff * easeOutCubic

                progressFill.style.width = `${currentProgress}%`
                percentageElement.textContent = `${Math.round(currentProgress)}%`

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    resolve()
                }
            }

            animate()
        })
    }

    preloadImages() {
        // Preload mentor avatars for better performance
        this.mentors.forEach((mentor) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.src = mentor.avatar
        })
    }

    bindEvents() {
        // Favorites panel
        document.getElementById("showFavoritesBtn").addEventListener("click", () => this.showFavorites())
        document.getElementById("closeFavoritesBtn").addEventListener("click", () => this.hideFavorites())
        document.getElementById("clearComparisonBtn").addEventListener("click", () => this.clearComparison())

        // View toggle
        document.querySelectorAll(".toggle-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => this.toggleView(e.target.dataset.view))
        })

        // Sort select
        document.getElementById("sortSelect").addEventListener("change", (e) => this.sortMentors(e.target.value))

        // AI Recommendation
        document.getElementById("aiRecommendationBtn").addEventListener("click", () => this.getAIRecommendation())

        // Close favorites panel when clicking outside
        document.getElementById("favoritesPanel").addEventListener("click", (e) => {
            if (e.target.id === "favoritesPanel") {
                this.hideFavorites()
            }
        })

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => this.handleKeyboard(e))

        // Mobile menu
        document.getElementById("hamburger").addEventListener("click", () => this.toggleMobileMenu())

        // Prevent loading screen interactions
        document.getElementById("loadingScreen").addEventListener("click", (e) => {
            if (this.isLoading) {
                e.preventDefault()
                e.stopPropagation()
            }
        })
    }

    showFavorites() {
        const panel = document.getElementById("favoritesPanel")
        panel.classList.add("active")
        this.renderFavorites()
        document.body.style.overflow = "auto"
    }

    hideFavorites() {
        const panel = document.getElementById("favoritesPanel")
        panel.classList.remove("active")
        document.body.style.overflow = ""
    }

    renderFavorites() {
        const grid = document.getElementById("favoritesGrid")
        const favoriteMentors = this.mentors.filter((mentor) => this.favorites.includes(mentor.id))

        grid.innerHTML = favoriteMentors
            .map(
                (mentor, index) => `
            <div class="favorite-item" data-mentor-id="${mentor.id}" style="animation-delay: ${index * 0.1}s">
                <div class="favorite-avatar">
                    <img src="${mentor.avatar}" alt="${mentor.name}">
                </div>
                <div class="favorite-info">
                    <h4>${mentor.name}</h4>
                    <p>${mentor.title}</p>
                    <div class="favorite-rating">
                        <span class="stars">${this.generateStars(mentor.rating)}</span>
                        <span>${mentor.rating}</span>
                    </div>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-sm btn-accent add-to-compare" data-mentor-id="${mentor.id}">
                        <i class="fas fa-plus"></i>
                        Compare
                    </button>
                    <button class="btn btn-sm btn-outline remove-favorite" data-mentor-id="${mentor.id}">
                        <i class="fas fa-heart-broken"></i>
                    </button>
                </div>
            </div>
        `,
            )
            .join("")

        // Bind events for favorite items
        grid.querySelectorAll(".add-to-compare").forEach((btn) => {
            btn.addEventListener("click", (e) => this.addToComparison(e.target.dataset.mentorId))
        })

        grid.querySelectorAll(".remove-favorite").forEach((btn) => {
            btn.addEventListener("click", (e) => this.removeFromFavorites(e.target.dataset.mentorId))
        })
    }

    renderComparison() {
        const comparisonMentors = this.mentors.filter((mentor) => this.comparison.includes(mentor.id))
        const sortedMentors = this.sortMentorsList(comparisonMentors)

        if (this.viewMode === "cards") {
            this.renderCards(sortedMentors)
        } else {
            this.renderTable(sortedMentors)
        }
    }

    renderCards(mentors) {
            const container = document.getElementById("cardsView")

            const cardsHTML = mentors
                .map(
                    (mentor, index) => `
            <div class="mentor-card in-comparison" data-mentor-id="${mentor.id}" style="animation-delay: ${index * 0.1}s">
                <div class="card-header">
                    <div class="mentor-badges">
                        ${
                          mentor.badge
                            ? `
                            <span class="badge ${mentor.badge}">
                                <i class="fas fa-${mentor.badge === "featured" ? "crown" : "medal"}"></i>
                                ${mentor.badge === "featured" ? "Top Rated" : "Expert"}
                            </span>
                        `
                            : ""
                        }
                        <button class="favorite-btn ${this.favorites.includes(mentor.id) ? "active" : ""}" data-mentor-id="${mentor.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="mentor-avatar">
                        <img src="${mentor.avatar}" alt="${mentor.name}">
                        <div class="online-status ${mentor.isOnline ? "online" : "busy"}"></div>
                    </div>
                    <div class="mentor-info">
                        <h3>${mentor.name}</h3>
                        <p class="title">${mentor.title}</p>
                        <div class="company">
                            <i class="fab fa-google"></i>
                            ${mentor.company}
                        </div>
                        <div class="rating">
                            <div class="stars">${this.generateStars(mentor.rating)}</div>
                            <span class="score">${mentor.rating}</span>
                            <span class="reviews">(${mentor.reviews} reviews)</span>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="price-section">
                        <div class="price">$${mentor.price}<span>/hour</span></div>
                        <div class="price-label ${mentor.price < 90 ? "" : "premium"}">${mentor.price < 90 ? "Best Value" : "Premium"}</div>
                    </div>

                    <div class="quick-stats">
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <span>${mentor.responseTime}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-calendar-${mentor.availability.includes("today") ? "check" : "times"}"></i>
                            <span>${mentor.availability}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-globe"></i>
                            <span>${mentor.languages.join(", ")}</span>
                        </div>
                    </div>

                    <div class="skills">
                        <h4>Expertise</h4>
                        <div class="skill-tags">
                            ${mentor.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                        </div>
                    </div>

                    <div class="experience">
                        <h4>Experience</h4>
                        <div class="experience-bar">
                            <div class="bar-fill" data-width="${(mentor.experience / 15) * 100}%"></div>
                        </div>
                        <span class="experience-years">${mentor.experience}+ years</span>
                    </div>

                    <div class="session-types">
                        <h4>Session Types</h4>
                        <ul>
                            ${mentor.sessionTypes
                              .map(
                                (type) => `
                                <li><i class="fas fa-${this.getSessionIcon(type)}"></i> ${type}</li>
                            `,
                              )
                              .join("")}
                        </ul>
                    </div>
                </div>

                <div class="card-footer">
                    <button class="btn btn-primary btn-full book-session" data-mentor-id="${mentor.id}">
                        <i class="fas fa-calendar-plus"></i>
                        Book Session
                    </button>
                    <div class="secondary-actions">
                        <button class="btn btn-outline btn-sm">
                            <i class="fas fa-user"></i>
                        </button>
                        <button class="btn btn-outline btn-sm">
                            <i class="fas fa-comments"></i>
                        </button>
                        <button class="btn btn-outline btn-sm remove-from-comparison" data-mentor-id="${mentor.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    const addMentorCard = `
            <div class="add-mentor-card">
                <div class="add-mentor-content">
                    <i class="fas fa-plus-circle"></i>
                    <h3>Add Another Mentor</h3>
                    <p>Compare up to 4 mentors at once</p>
                    <button class="btn btn-accent" id="addMentorBtn">
                        <i class="fas fa-search"></i>
                        Browse Mentors
                    </button>
                </div>
            </div>
        `

    container.innerHTML = cardsHTML + addMentorCard

    // Animate progress bars
    setTimeout(() => {
      container.querySelectorAll(".bar-fill").forEach((bar) => {
        const width = bar.dataset.width
        bar.style.width = width
      })
    }, 500)

    // Bind events
    this.bindCardEvents(container)
  }

  renderTable(mentors) {
    const container = document.getElementById("tableView")

    const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${mentors
                          .map(
                            (mentor) => `
                            <th>
                                <div class="mentor-header">
                                    <img src="${mentor.avatar}" alt="${mentor.name}">
                                    <div>
                                        <h4>${mentor.name}</h4>
                                        <p>${mentor.title}</p>
                                    </div>
                                </div>
                            </th>
                        `,
                          )
                          .join("")}
                        <th class="add-column">
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-plus"></i>
                                Add Mentor
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="feature-cell">Rating</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td>
                                <div class="rating-cell">
                                    <span class="stars">${this.generateStars(mentor.rating)}</span>
                                    <span>${mentor.rating} (${mentor.reviews})</span>
                                </div>
                            </td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                    <tr>
                        <td class="feature-cell">Price</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td><span class="price-cell">$${mentor.price}/hour</span></td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                    <tr>
                        <td class="feature-cell">Experience</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td>${mentor.experience}+ years</td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                    <tr>
                        <td class="feature-cell">Response Time</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td><span class="response-${mentor.responseTime.includes("2h") ? "fast" : "medium"}">${mentor.responseTime}</span></td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                    <tr>
                        <td class="feature-cell">Availability</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td><span class="${mentor.availability.includes("today") ? "available" : "busy"}">${mentor.availability}</span></td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                    <tr>
                        <td class="feature-cell">Languages</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td>${mentor.languages.join(", ")}</td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                    <tr>
                        <td class="feature-cell">Actions</td>
                        ${mentors
                          .map(
                            (mentor) => `
                            <td>
                                <button class="btn btn-primary btn-sm book-session" data-mentor-id="${mentor.id}">Book Now</button>
                            </td>
                        `,
                          )
                          .join("")}
                        <td></td>
                    </tr>
                </tbody>
            </table>
        `

    container.innerHTML = tableHTML
    this.bindTableEvents(container)
  }

  bindCardEvents(container) {
    // Favorite buttons
    container.querySelectorAll(".favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        this.toggleFavorite(btn.dataset.mentorId)
        btn.classList.toggle("active")
      })
    })

    // Remove from comparison
    container.querySelectorAll(".remove-from-comparison").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        this.removeFromComparison(btn.dataset.mentorId)
      })
    })

    // Book session
    container.querySelectorAll(".book-session").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        this.bookSession(btn.dataset.mentorId, btn)
      })
    })

    // Add mentor button
    const addBtn = container.querySelector("#addMentorBtn")
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        this.showNotification("Browse mentors feature coming soon!", "info")
      })
    }
  }

  bindTableEvents(container) {
    // Book session buttons in table
    container.querySelectorAll(".book-session").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        this.bookSession(btn.dataset.mentorId, btn)
      })
    })
  }

  toggleView(view) {
    this.viewMode = view

    // Update toggle buttons
    document.querySelectorAll(".toggle-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view)
    })

    // Show/hide views
    const cardsView = document.getElementById("cardsView")
    const tableView = document.getElementById("tableView")

    if (view === "cards") {
      cardsView.style.display = "grid"
      tableView.style.display = "none"
    } else {
      cardsView.style.display = "none"
      tableView.style.display = "block"
    }

    this.renderComparison()
    this.showNotification(`Switched to ${view} view`, "info")
  }

  sortMentors(criteria) {
    this.sortBy = criteria
    this.renderComparison()
    this.showNotification(`Sorted by ${criteria}`, "info")
  }

  sortMentorsList(mentors) {
    return [...mentors].sort((a, b) => {
      switch (this.sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price":
          return a.price - b.price
        case "experience":
          return b.experience - a.experience
        default:
          return 0
      }
    })
  }

  toggleFavorite(mentorId) {
    const index = this.favorites.indexOf(mentorId)
    if (index > -1) {
      this.favorites.splice(index, 1)
      this.showNotification("Removed from favorites", "info")
    } else {
      this.favorites.push(mentorId)
      this.showNotification("Added to favorites", "success")
    }
    this.updateFavoritesCount()
  }

  addToComparison(mentorId) {
    if (this.comparison.length >= 4) {
      this.showNotification("You can compare up to 4 mentors at once", "warning")
      return
    }

    if (!this.comparison.includes(mentorId)) {
      this.comparison.push(mentorId)
      this.renderComparison()
      this.showNotification("Added to comparison", "success")
      this.hideFavorites()
    }
  }

  removeFromComparison(mentorId) {
    const index = this.comparison.indexOf(mentorId)
    if (index > -1) {
      this.comparison.splice(index, 1)
      this.renderComparison()
      this.showNotification("Removed from comparison", "info")
    }
  }

  removeFromFavorites(mentorId) {
    const index = this.favorites.indexOf(mentorId)
    if (index > -1) {
      this.favorites.splice(index, 1)
      this.updateFavoritesCount()

      // Remove from DOM with animation
      const item = document.querySelector(`[data-mentor-id="${mentorId}"]`)
      if (item) {
        item.style.animation = "fadeOut 0.3s ease-out forwards"
        setTimeout(() => {
          if (item.parentNode) {
            item.parentNode.removeChild(item)
          }
        }, 300)
      }

      this.showNotification("Removed from favorites", "info")
    }
  }

  clearComparison() {
    if (this.comparison.length === 0) return

    this.comparison = []
    this.renderComparison()
    this.showNotification("Comparison cleared", "info")
  }

  updateFavoritesCount() {
    const countElement = document.getElementById("favoritesCount")
    if (countElement) {
      countElement.textContent = this.favorites.length
    }

    // Update clear button state
    const clearBtn = document.getElementById("clearComparisonBtn")
    if (clearBtn) {
      clearBtn.disabled = this.comparison.length === 0
      clearBtn.style.opacity = this.comparison.length === 0 ? "0.5" : "1"
    }
  }

  bookSession(mentorId, button) {
    const mentor = this.mentors.find((m) => m.id === mentorId)
    const originalText = button.innerHTML

    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...'
    button.disabled = true
    button.classList.add("loading")

    // Simulate booking process
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-check"></i> Session Booked!'
      button.style.background = "var(--success)"
      button.classList.remove("loading")

      this.showNotification(`Session booked with ${mentor.name}!`, "success")

      // Reset button after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalText
        button.disabled = false
        button.style.background = ""
      }, 2000)
    }, 1500)
  }

  getAIRecommendation() {
    const button = document.getElementById("aiRecommendationBtn")
    const originalText = button.innerHTML

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...'
    button.disabled = true

    setTimeout(() => {
      const recommendations = [
        "Based on your preferences, Sarah Chen is perfect for product management guidance.",
        "Marcus Rodriguez would be ideal for technical leadership and system design.",
        "Emily Johnson is recommended for UX design and user research expertise.",
      ]

      const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)]
      this.showNotification(randomRecommendation, "info")

      button.innerHTML = originalText
      button.disabled = false
    }, 2000)
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    let stars = ""

    for (let i = 0; i < fullStars; i++) {
      stars += "★"
    }

    if (hasHalfStar) {
      stars += "☆"
    }

    while (stars.length < 5) {
      stars += "☆"
    }

    return stars
  }

  getSessionIcon(sessionType) {
    const iconMap = {
      "1-on-1 Coaching": "user",
      "Portfolio Review": "folder-open",
      "Career Planning": "route",
      "Code Review": "code",
      "System Design": "sitemap",
      "Interview Prep": "clipboard-check",
      "Design Review": "palette",
      "Portfolio Feedback": "star",
      "Career Guidance": "compass",
    }
    return iconMap[sessionType] || "circle"
  }

  showNotification(message, type = "info") {
    const container = document.getElementById("notificationContainer")
    const notification = document.createElement("div")

    notification.className = `notification ${type}`
    notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `

    container.appendChild(notification)

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOut 0.3s ease-out forwards"
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 300)
      }
    }, 800)
  }

  animateOnScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")

            // Animate progress bars
            const progressBars = entry.target.querySelectorAll(".bar-fill")
            progressBars.forEach((bar) => {
              const width = bar.dataset.width
              if (width) {
                setTimeout(() => {
                  bar.style.width = width
                }, 200)
              }
            })
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe elements for animation
    document.querySelectorAll(".mentor-card, .recommendation-card, .section-header h2").forEach((el) => {
      observer.observe(el)
    })
  }

  handleNavbarScroll() {
    let lastScrollTop = 0
    const navbar = document.getElementById("navbar")

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Add scrolled class for styling
      if (scrollTop > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }

      // Hide/show navbar on scroll
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = "translateY(-100%)"
      } else {
        navbar.style.transform = "translateY(0)"
      }

      lastScrollTop = scrollTop
    })
  }

  handleKeyboard(e) {
    // Close favorites panel with Escape
    if (e.key === "Escape") {
      this.hideFavorites()
    }

    // Toggle view with Ctrl+V
    if (e.ctrlKey && e.key === "v") {
      e.preventDefault()
      const newView = this.viewMode === "cards" ? "table" : "cards"
      this.toggleView(newView)
    }

    // Clear comparison with Ctrl+C
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault()
      this.clearComparison()
    }
  }

  toggleMobileMenu() {
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("navMenu")

    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Prevent body scroll during loading
  document.body.style.overflow = "auto"

  // Initialize the mentor comparison app
  new MentorComparison()
})

// Performance optimization: Lazy load images
const lazyLoadImages = () => {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading when DOM is ready
document.addEventListener("DOMContentLoaded", lazyLoadImages)