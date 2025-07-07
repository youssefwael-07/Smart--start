// ===== SMARTSTART VIDEO PLATFORM =====

// Global variables
let currentSort = "recent"
let currentFilter = "all"
let currentVideo = null
let currentView = "grid"
let toastQueue = []

// Enhanced video database with YouTube support
const videoDatabase = {
    "Advanced JavaScript Concepts": {
        url: "https://www.youtube.com/watch?v=GM6dQBmc-Xg",
        type: "youtube",
        duration: "4:30",
        views: 1250,
        likes: 89,
        description: "Master advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features. This comprehensive course will take your JavaScript skills to the next level with practical examples and real-world applications.",
        thumbnail: "https://img.youtube.com/vi/GM6dQBmc-Xg/maxresdefault.jpg",
        progress: 75,
        status: "in-progress",
        category: "programming",
        featured: true,
    },
    "React Hooks Deep Dive": {
        url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
        type: "youtube",
        duration: "6:15",
        views: 2100,
        likes: 156,
        description: "Comprehensive guide to React Hooks including useState, useEffect, useContext, and custom hooks. Learn how to build modern React applications with functional components and advanced patterns.",
        thumbnail: "https://img.youtube.com/vi/O6P86uwfdR0/maxresdefault.jpg",
        progress: 100,
        status: "completed",
        category: "programming",
    },
    "Node.js Backend Development": {
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        type: "youtube",
        duration: "3:45",
        views: 890,
        likes: 67,
        description: "Build robust backend applications with Node.js, Express, and MongoDB integration. Learn server-side development from scratch to deployment with best practices and security considerations.",
        thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg",
        progress: 30,
        status: "in-progress",
        category: "programming",
    },
    "CSS Grid & Flexbox Mastery": {
        url: "https://www.youtube.com/watch?v=jV8B24rSN5o",
        type: "youtube",
        duration: "5:20",
        views: 1450,
        likes: 112,
        description: "Master modern CSS layout techniques with Grid and Flexbox for responsive web design. Create beautiful, responsive layouts with ease and learn advanced positioning techniques.",
        thumbnail: "https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg",
        progress: 0,
        status: "not-started",
        category: "design",
    },
    "Python Data Science": {
        url: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        type: "youtube",
        duration: "4:10",
        views: 1780,
        likes: 134,
        description: "Learn data analysis and visualization with Python, Pandas, NumPy, and Matplotlib. Perfect for beginners in data science with hands-on projects and real datasets.",
        thumbnail: "https://img.youtube.com/vi/ua-CiDNNj30/maxresdefault.jpg",
        progress: 60,
        status: "in-progress",
        category: "science",
    },
    "Machine Learning Fundamentals": {
        url: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
        type: "youtube",
        duration: "7:30",
        views: 2340,
        likes: 198,
        description: "Introduction to machine learning algorithms, supervised and unsupervised learning techniques. Start your AI journey here with practical implementations and theory.",
        thumbnail: "https://img.youtube.com/vi/ukzFI9rgwfU/maxresdefault.jpg",
        progress: 0,
        status: "not-started",
        category: "science",
    },
}

// ===== YOUTUBE UTILITIES =====
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
}

function getYouTubeEmbedUrl(videoId, autoplay = false) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`
}

function getYouTubeThumbnail(videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

function isValidYouTubeUrl(url) {
    return extractYouTubeId(url) !== null
}

// ===== PAGE MANAGEMENT =====
let currentPage = "featured"
const pages = ["featured", "library", "playlists", "history", "bookmarks", "analytics", "settings"]

// Sample data for different pages
const playlistsData = [{
        id: 1,
        title: "JavaScript Mastery",
        count: 8,
        thumbnail: "programming",
    },
    {
        id: 2,
        title: "Design Fundamentals",
        count: 5,
        thumbnail: "design",
    },
    {
        id: 3,
        title: "Data Science Journey",
        count: 12,
        thumbnail: "science",
    },
]

const historyData = [{
        title: "Advanced JavaScript Concepts",
        watchedAt: "2 hours ago",
        duration: "4:30",
        progress: 100,
    },
    {
        title: "React Hooks Deep Dive",
        watchedAt: "Yesterday",
        duration: "6:15",
        progress: 75,
    },
    {
        title: "Node.js Backend Development",
        watchedAt: "2 days ago",
        duration: "3:45",
        progress: 45,
    },
    {
        title: "CSS Grid & Flexbox Mastery",
        watchedAt: "3 days ago",
        duration: "5:20",
        progress: 30,
    },
]

const bookmarksData = ["Advanced JavaScript Concepts", "Python Data Science", "CSS Grid & Flexbox Mastery"]

// ===== PAGE NAVIGATION =====
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll(".page-content").forEach((page) => {
        page.classList.remove("active")
    })

    // Show selected page
    const targetPage = document.getElementById(`${pageId}-page`)
    if (targetPage) {
        targetPage.classList.add("active")
    }

    // Update navigation
    document.querySelectorAll(".nav-item").forEach((nav) => {
        nav.classList.remove("active")
    })

    const activeNav = document.querySelector(`[data-page="${pageId}"]`)
    if (activeNav) {
        activeNav.classList.add("active")
    }

    currentPage = pageId

    // Load page-specific content
    loadPageContent(pageId)

    // Show page transition toast
    const pageNames = {
        featured: "Featured Videos",
        library: "My Library",
        playlists: "Playlists",
        history: "Watch History",
        bookmarks: "Bookmarks",
        analytics: "Analytics",
        settings: "Settings",
    }

    showToast(`📄 Switched to ${pageNames[pageId]}`, "success")
}

function loadPageContent(pageId) {
    switch (pageId) {
        case "featured":
            loadFeaturedVideo()
            renderContinueCards()
            break
        case "library":
            renderVideoGrid()
            break
        case "playlists":
            renderPlaylists()
            break
        case "history":
            renderHistory()
            break
        case "bookmarks":
            renderBookmarksPage()
            break
        case "analytics":
            // Analytics are static for now
            break
        case "settings":
            // Settings are static for now
            break
    }
}

// ===== RENDER FUNCTIONS FOR NEW PAGES =====
function renderPlaylists() {
    const playlistsGrid = document.getElementById("playlists-grid")
    if (!playlistsGrid) return

    playlistsGrid.innerHTML = ""

    playlistsData.forEach((playlist) => {
        const playlistCard = document.createElement("div")
        playlistCard.className = "playlist-card"
        playlistCard.onclick = () => showToast(`📝 Opening ${playlist.title} playlist`, "info")

        const iconMap = {
            programming: "fas fa-code",
            design: "fas fa-paint-brush",
            science: "fas fa-flask",
        }

        playlistCard.innerHTML = `
      <div class="playlist-header">
        <div>
          <div class="playlist-title">${playlist.title}</div>
          <div class="playlist-count">${playlist.count} videos</div>
        </div>
        <button class="btn-icon" onclick="event.stopPropagation(); showToast('⚙️ Playlist options coming soon!', 'info')">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
      <div class="playlist-thumbnail">
        <i class="${iconMap[playlist.thumbnail] || "fas fa-play"}"></i>
      </div>
      <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="event.stopPropagation(); showToast('▶️ Playing ${playlist.title}', 'success')">
        <i class="fas fa-play"></i> Play All
      </button>
    `

        playlistsGrid.appendChild(playlistCard)
    })
}

function renderHistory() {
    const historyTimeline = document.getElementById("history-timeline")
    if (!historyTimeline) return

    historyTimeline.innerHTML = ""

    historyData.forEach((item) => {
        const historyItem = document.createElement("div")
        historyItem.className = "history-item"
        historyItem.onclick = () => showToast(`▶️ Resuming ${item.title}`, "success")

        historyItem.innerHTML = `
      <div class="history-thumbnail"></div>
      <div class="history-info">
        <div class="history-title">${item.title}</div>
        <div class="history-meta">
          <span><i class="fas fa-clock"></i> ${item.duration}</span>
          <span><i class="fas fa-calendar"></i> ${item.watchedAt}</span>
          <span><i class="fas fa-chart-line"></i> ${item.progress}% complete</span>
        </div>
      </div>
      <div class="progress-bar" style="width: 60px; height: 4px; background: #334155; border-radius: 2px;">
        <div class="progress-fill" style="width: ${item.progress}%; height: 100%; background: #0891b2; border-radius: 2px;"></div>
      </div>
    `

        historyTimeline.appendChild(historyItem)
    })
}

function renderBookmarksPage() {
    const bookmarksGrid = document.getElementById("bookmarks-grid")
    if (!bookmarksGrid) return

    bookmarksGrid.innerHTML = ""

    bookmarksData.forEach((videoTitle) => {
        if (videoDatabase[videoTitle]) {
            const videoCard = createVideoCard(videoTitle, videoDatabase[videoTitle])
            videoCard.classList.add("bookmarked")
            bookmarksGrid.appendChild(videoCard)
        }
    })

    if (bookmarksData.length === 0) {
        bookmarksGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #94a3b8;">
        <i class="fas fa-bookmark" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <h3>No bookmarks yet</h3>
        <p>Start bookmarking videos to see them here</p>
      </div>
    `
    }
}

// ===== MAIN INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    // Initialize app directly without loading screen
    initializeApp()
})

function initializeApp() {
    // Initialize components
    createToastContainer()
    setupEventListeners()

    // Load initial page content
    loadPageContent("featured")

    // Add loaded class for animations
    const appContainer = document.getElementById("app-container")
    const sidebar = document.getElementById("sidebar")
    const mainContent = document.getElementById("main-content")

    if (appContainer) appContainer.classList.add("loaded")
    if (sidebar) sidebar.classList.add("loaded")
    if (mainContent) mainContent.classList.add("loaded")

    // Welcome messages
    setTimeout(() => {
        showToast("🎬 Welcome to SmartStart Video Platform!", "success")
    }, 1000)

    setTimeout(() => {
        showToast("📱 Navigate between pages using the sidebar!", "info")
    }, 2500)
}

// ===== FEATURED VIDEO FUNCTIONS =====
function loadFeaturedVideo() {
    const featuredEntry =
        Object.entries(videoDatabase).find(([_, video]) => video.featured) || Object.entries(videoDatabase)[0]

    if (!featuredEntry) return

    const [title, video] = featuredEntry
    const videoId = extractYouTubeId(video.url)

    if (!videoId) return

    // Update featured video info
    const featuredTitle = document.getElementById("featured-title")
    const featuredDescription = document.getElementById("featured-description")
    const featuredDuration = document.getElementById("featured-duration")
    const featuredViews = document.getElementById("featured-views")

    if (featuredTitle) featuredTitle.textContent = title
    if (featuredDescription) featuredDescription.textContent = video.description
    if (featuredDuration) featuredDuration.textContent = video.duration
    if (featuredViews) featuredViews.textContent = video.views.toLocaleString()

    // Store current featured video
    window.featuredVideo = { title, video, videoId }
}

function playFeaturedVideo() {
    if (!window.featuredVideo) return

    const { title, video, videoId } = window.featuredVideo
    const heroIframe = document.getElementById("hero-iframe")
    const heroOverlay = document.getElementById("hero-overlay")

    if (heroIframe && videoId) {
        heroIframe.src = getYouTubeEmbedUrl(videoId, true)
    }

    if (heroOverlay) {
        heroOverlay.classList.add("hidden")
    }

    // Update view count
    videoDatabase[title].views++
        const featuredViews = document.getElementById("featured-views")
    if (featuredViews) {
        featuredViews.textContent = videoDatabase[title].views.toLocaleString()
    }

    showToast(`🎬 Now playing: ${title}`, "success")
}

// ===== TOAST SYSTEM =====
function createToastContainer() {
    const existingContainer = document.querySelector(".toast-container")
    if (existingContainer) {
        existingContainer.remove()
    }

    const toastContainer = document.createElement("div")
    toastContainer.className = "toast-container"
    toastContainer.id = "toast-container"
    document.body.appendChild(toastContainer)
}

function showToast(message, type = "success", duration = 4000) {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const toastContent = document.createElement("div")
    toastContent.className = "toast-content"

    const icon = document.createElement("div")
    icon.className = "toast-icon"
    const iconMap = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    }
    icon.textContent = iconMap[type] || "•"

    const messageEl = document.createElement("div")
    messageEl.className = "toast-message"
    messageEl.textContent = message

    const closeBtn = document.createElement("button")
    closeBtn.className = "toast-close"
    closeBtn.innerHTML = "×"
    closeBtn.onclick = () => removeToast(toast)

    toastContent.appendChild(icon)
    toastContent.appendChild(messageEl)
    toastContent.appendChild(closeBtn)
    toast.appendChild(toastContent)

    const toastContainer = document.getElementById("toast-container")
    if (toastContainer) {
        toastContainer.appendChild(toast)

        requestAnimationFrame(() => {
            toast.classList.add("show")
        })

        setTimeout(() => {
            removeToast(toast)
        }, duration)

        toastQueue.push(toast)
        if (toastQueue.length > 5) {
            removeToast(toastQueue[0])
        }
    }

    return toast
}

function removeToast(toast) {
    if (toast && toast.parentNode) {
        toast.classList.remove("show")
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast)
            }
            toastQueue = toastQueue.filter((t) => t !== toast)
        }, 300)
    }
}

// ===== RENDER FUNCTIONS =====
function renderVideoGrid() {
    const videoGrid = document.getElementById("video-grid")
    if (!videoGrid) return

    videoGrid.innerHTML = ""

    Object.entries(videoDatabase).forEach(([title, video]) => {
        const videoCard = createVideoCard(title, video)
        videoGrid.appendChild(videoCard)
    })
}

function createVideoCard(title, video) {
    const videoCard = document.createElement("div")
    videoCard.className = "video-card"
    videoCard.dataset.title = title
    videoCard.dataset.status = video.status
    videoCard.dataset.progress = video.progress
    videoCard.dataset.category = video.category || "other"

    const videoId = extractYouTubeId(video.url)
    const thumbnail = video.thumbnail || getYouTubeThumbnail(videoId)

    videoCard.innerHTML = `
    <div class="video-thumbnail" onclick="playVideoInModal('${title}')">
      <img src="${thumbnail}" alt="${title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxSZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMWEyOTNiIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
      <div class="video-play-overlay">
        <i class="fas fa-play-circle"></i>
      </div>
      <div class="video-progress-indicator" style="width: ${video.progress}%"></div>
      <div class="video-duration-badge">${video.duration}</div>
      ${video.progress === 0 ? '<div class="video-status-badge new">NEW</div>' : ""}
      ${video.status === "completed" ? '<div class="video-status-badge completed">COMPLETED</div>' : ""}
    </div>
    <div class="video-card-content">
      <h3 class="video-card-title">${title}</h3>
      <div class="video-card-meta">
        <span><i class="fas fa-clock"></i> ${video.duration}</span>
        <span><i class="fas fa-eye"></i> ${video.views.toLocaleString()}</span>
        <span><i class="fas fa-star"></i> 4.8</span>
      </div>
      <p class="video-card-description">${video.description}</p>
      <div class="video-card-actions">
        <div class="video-progress-text ${video.status === "completed" ? "completed" : video.status === "not-started" ? "not-started" : ""}">
          ${video.status === "completed" ? "Completed" : video.status === "not-started" ? "Not started" : `${video.progress}% completed`}
        </div>
        <button class="video-card-btn" onclick="handleVideoAction(event, '${title}')">
          ${video.status === "completed" ? "Review" : video.status === "not-started" ? "Start" : "Resume"} 
          <i class="fas fa-${video.status === "completed" ? "redo" : "arrow-right"}"></i>
        </button>
      </div>
    </div>
  `

  return videoCard
}

function renderContinueCards() {
  const continueCards = document.getElementById("continue-cards")
  if (!continueCards) return

  continueCards.innerHTML = ""

  const inProgressVideos = Object.entries(videoDatabase)
    .filter(([_, video]) => video.status === "in-progress")
    .slice(0, 3)

  inProgressVideos.forEach(([title, video]) => {
    const card = document.createElement("div")
    card.className = "continue-card"

    const moduleNumber = Math.floor((video.progress / 100) * 12) + 1

    card.innerHTML = `
      <div class="continue-header">
        <h4>${title}</h4>
        <span class="module-indicator">Module ${moduleNumber} of 12</span>
      </div>
      <div class="continue-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${video.progress}%"></div>
        </div>
        <span>${video.progress}%</span>
      </div>
      <button class="btn-continue" onclick="playVideoInModal('${title}')">
        <i class="fas fa-play"></i> Continue
      </button>
    `

    continueCards.appendChild(card)
  })
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", handleNavigation)
  })

  // Featured video controls
  const heroPlayBtn = document.getElementById("hero-play-btn")
  const watchNowBtn = document.getElementById("watch-now-btn")
  const addPlaylistBtn = document.getElementById("add-playlist-btn")
  const shareBtn = document.getElementById("share-btn")
  const bookmarkBtn = document.getElementById("bookmark-btn")

  if (heroPlayBtn) heroPlayBtn.addEventListener("click", playFeaturedVideo)
  if (watchNowBtn) watchNowBtn.addEventListener("click", playFeaturedVideo)
  if (addPlaylistBtn)
    addPlaylistBtn.addEventListener("click", () => showToast("📝 Playlist feature coming soon!", "info"))
  if (shareBtn) shareBtn.addEventListener("click", () => shareFeaturedVideo())
  if (bookmarkBtn) bookmarkBtn.addEventListener("click", () => toggleFeaturedBookmark())

  // View controls
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", handleViewChange)
  })

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleFilter)
  })

  // Sort dropdown
  const sortBtn = document.getElementById("sort-btn")
  const sortMenu = document.getElementById("sort-menu")

  if (sortBtn && sortMenu) {
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      sortMenu.classList.toggle("show")
    })

    document.addEventListener("click", (e) => {
      if (!sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
        sortMenu.classList.remove("show")
      }
    })
  }

  // Search functionality
  const searchInput = document.getElementById("search-input")
  if (searchInput) {
    let searchTimeout
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        filterVideos()
        if (e.target.value.length > 0) {
          showToast(`🔍 Searching for "${e.target.value}"`, "info", 1500)
        }
      }, 300)
    })
  }

  // Quick actions
  const addVideoBtn = document.getElementById("add-video-btn")
  const createPlaylistBtn = document.getElementById("create-playlist-btn")
  const createNewPlaylistBtn = document.getElementById("create-new-playlist")
  const clearHistoryBtn = document.getElementById("clear-history")

  if (addVideoBtn) addVideoBtn.addEventListener("click", showAddVideoModal)
  if (createPlaylistBtn)
    createPlaylistBtn.addEventListener("click", () => showToast("📁 Playlist creation coming soon!", "info"))
  if (createNewPlaylistBtn)
    createNewPlaylistBtn.addEventListener("click", () => showToast("📁 Creating new playlist...", "info"))
  if (clearHistoryBtn)
    clearHistoryBtn.addEventListener("click", () => {
      showToast("🗑️ History cleared!", "warning")
      document.getElementById("history-timeline").innerHTML =
        '<div style="text-align: center; padding: 3rem; color: #94a3b8;"><i class="fas fa-history" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i><h3>No history yet</h3><p>Your watch history will appear here</p></div>'
    })

  // Add video modal
  const addVideoModal = document.getElementById("add-video-modal")
  const closeAddModal = document.getElementById("close-add-modal")
  const cancelAddBtn = document.getElementById("cancel-add-btn")
  const confirmAddBtn = document.getElementById("confirm-add-btn")

  if (closeAddModal) closeAddModal.addEventListener("click", hideAddVideoModal)
  if (cancelAddBtn) cancelAddBtn.addEventListener("click", hideAddVideoModal)
  if (confirmAddBtn) confirmAddBtn.addEventListener("click", addNewVideo)

  if (addVideoModal) {
    addVideoModal.addEventListener("click", function (e) {
      if (e.target === this) {
        hideAddVideoModal()
      }
    })
  }

  // Video modal controls
  const closeVideoModal = document.getElementById("close-video-modal")
  const likeBtn = document.getElementById("like-btn")
  const bookmarkModalBtn = document.getElementById("bookmark-modal-btn")
  const shareModalBtn = document.getElementById("share-modal-btn")
  const downloadBtn = document.getElementById("download-btn")

  if (closeVideoModal) closeVideoModal.addEventListener("click", hideVideoModal)
  if (likeBtn) likeBtn.addEventListener("click", toggleVideoLike)
  if (bookmarkModalBtn) bookmarkModalBtn.addEventListener("click", toggleVideoBookmark)
  if (shareModalBtn) shareModalBtn.addEventListener("click", shareCurrentVideo)
  if (downloadBtn) downloadBtn.addEventListener("click", downloadCurrentVideo)

  // Modal interactions
  const videoModal = document.getElementById("video-modal")
  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === this) {
        hideVideoModal()
      }
    })
  }

  // Sort options
  document.querySelectorAll(".sort-option").forEach((option) => {
    option.addEventListener("click", handleSort)
  })

  // User profile
  const userProfile = document.querySelector(".user-profile")
  if (userProfile) {
    userProfile.addEventListener("click", () => {
      switchPage("settings")
    })
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts)

  // Settings form handlers
  setupSettingsHandlers()
}

function setupSettingsHandlers() {
  // Settings save button
  const saveBtn = document.querySelector(".settings-actions .btn-primary")
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      showToast("💾 Settings saved successfully!", "success")
    })
  }

  // Settings reset button
  const resetBtn = document.querySelector(".settings-actions .btn-secondary")
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      showToast("🔄 Settings reset to default!", "warning")
    })
  }

  // Delete account button
  const deleteBtn = document.querySelector(".settings-actions .btn-danger")
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        showToast("❌ Account deletion initiated!", "error")
      }
    })
  }
}

// ===== NAVIGATION HANDLERS =====
function handleNavigation() {
  const pageId = this.dataset.page
  switchPage(pageId)
}

function handleViewChange() {
  document.querySelectorAll(".view-btn").forEach((btn) => btn.classList.remove("active"))
  this.classList.add("active")

  currentView = this.dataset.view
  const videoGrid = document.getElementById("video-grid")

  if (videoGrid) {
    if (currentView === "list") {
      videoGrid.style.gridTemplateColumns = "1fr"
      showToast("📋 Switched to list view", "info")
    } else {
      videoGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(320px, 1fr))"
      showToast("⊞ Switched to grid view", "info")
    }
  }
}

function handleFilter() {
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
  this.classList.add("active")

  currentFilter = this.dataset.filter
  filterVideos()

  const filterMessages = {
    all: "📋 Showing all videos",
    "in-progress": "⏳ Showing videos in progress",
    completed: "✅ Showing completed videos",
    new: "🆕 Showing new videos",
  }

  showToast(filterMessages[currentFilter] || "📋 Filter applied", "info")
}

function handleSort() {
  document.querySelectorAll(".sort-option").forEach((opt) => opt.classList.remove("active"))
  this.classList.add("active")

  currentSort = this.dataset.sort
  const sortBtn = document.getElementById("sort-btn")
  const sortMenu = document.getElementById("sort-menu")

  if (sortBtn)
    sortBtn.innerHTML = `<i class="fas fa-sort"></i> Sort: ${this.textContent} <i class="fas fa-chevron-down"></i>`
  if (sortMenu) sortMenu.classList.remove("show")

  sortVideos()

  const sortMessages = {
    recent: "🕒 Sorted by most recent",
    alphabetical: "🔤 Sorted alphabetically",
    progress: "📊 Sorted by progress",
    duration: "⏱️ Sorted by duration",
  }

  showToast(sortMessages[currentSort] || "📊 Sorting applied", "success")
}

// ===== VIDEO FUNCTIONS =====
function playVideoInModal(title) {
  if (!videoDatabase[title]) {
    showToast("❌ Video not available", "error")
    return
  }

  currentVideo = title
  const videoInfo = videoDatabase[title]
  const videoId = extractYouTubeId(videoInfo.url)

  if (!videoId) {
    showToast("❌ Invalid YouTube video", "error")
    return
  }

  // Update modal content
  const modalVideoTitle = document.getElementById("modal-video-title")
  const modalDuration = document.getElementById("modal-duration")
  const modalViews = document.getElementById("modal-views")
  const modalLikes = document.getElementById("modal-likes")
  const modalDescription = document.getElementById("modal-description")

  if (modalVideoTitle) modalVideoTitle.textContent = title
  if (modalDuration) modalDuration.textContent = videoInfo.duration
  if (modalViews) modalViews.textContent = videoInfo.views.toLocaleString()
  if (modalLikes) modalLikes.textContent = videoInfo.likes
  if (modalDescription) modalDescription.textContent = videoInfo.description

  // Create YouTube iframe
  const modalIframe = document.getElementById("modal-iframe")
  if (modalIframe && videoId) {
    modalIframe.src = getYouTubeEmbedUrl(videoId, true)
  }

  // Show modal
  const modal = document.getElementById("video-modal")
  if (modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  // Update view count
  videoDatabase[title].views++
  if (modalViews) {
    modalViews.textContent = videoDatabase[title].views.toLocaleString()
  }

  showToast(`🎬 Now playing: ${title}`, "success")
}

function hideVideoModal() {
  const modal = document.getElementById("video-modal")
  const modalIframe = document.getElementById("modal-iframe")

  if (modalIframe) {
    modalIframe.src = ""
  }

  if (modal) {
    modal.classList.remove("show")
  }

  document.body.style.overflow = "auto"

  if (currentVideo) {
    showToast(`👋 Thanks for watching: ${currentVideo}`, "info")
  }

  currentVideo = null

  // Reset button states
  const likeBtn = document.getElementById("like-btn")
  const bookmarkModalBtn = document.getElementById("bookmark-modal-btn")

  if (likeBtn) likeBtn.classList.remove("active")
  if (bookmarkModalBtn) bookmarkModalBtn.classList.remove("active")
}

function handleVideoAction(event, title) {
  event.stopPropagation()

  const videoInfo = videoDatabase[title]
  if (!videoInfo) return

  const progress = videoInfo.progress || 0
  const status = videoInfo.status

  if (status === "completed") {
    showToast(`📚 Reviewing: ${title}`, "info")
    playVideoInModal(title)
  } else if (status === "not-started") {
    showToast(`🚀 Starting course: ${title}`, "success")
    updateVideoProgress(title, 5)
    setTimeout(() => playVideoInModal(title), 1000)
  } else {
    showToast(`▶️ Resuming: ${title} (${progress}% complete)`, "info")
    playVideoInModal(title)
    setTimeout(() => {
      updateVideoProgress(title, Math.min(progress + 5, 100))
      showToast("📈 Progress updated!", "success")
    }, 2000)
  }
}

function updateVideoProgress(videoTitle, newProgress) {
  if (videoDatabase[videoTitle]) {
    videoDatabase[videoTitle].progress = newProgress

    if (newProgress >= 100) {
      videoDatabase[videoTitle].status = "completed"
    } else if (newProgress > 0) {
      videoDatabase[videoTitle].status = "in-progress"
    }
  }

  renderVideoGrid()
  renderContinueCards()

  if (newProgress >= 100) {
    showToast(`🎉 Congratulations! You completed ${videoTitle}!`, "success")
  }
}

// ===== MODAL FUNCTIONS =====
function showAddVideoModal() {
  const modal = document.getElementById("add-video-modal")
  if (modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"

    // Clear form
    const videoUrl = document.getElementById("video-url")
    const videoTitle = document.getElementById("video-title")
    const videoDesc = document.getElementById("video-desc")
    const videoCategory = document.getElementById("video-category")

    if (videoUrl) videoUrl.value = ""
    if (videoTitle) videoTitle.value = ""
    if (videoDesc) videoDesc.value = ""
    if (videoCategory) videoCategory.value = "programming"
  }
}

function hideAddVideoModal() {
  const modal = document.getElementById("add-video-modal")
  if (modal) {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
  }
}

function addNewVideo() {
  const urlInput = document.getElementById("video-url")
  const titleInput = document.getElementById("video-title")
  const descInput = document.getElementById("video-desc")
  const categoryInput = document.getElementById("video-category")

  const url = urlInput?.value.trim() || ""
  const title = titleInput?.value.trim() || ""
  const description = descInput?.value.trim() || ""
  const category = categoryInput?.value || "programming"

  if (!url || !title) {
    showToast("❌ Please fill in URL and title fields", "error")
    return
  }

  if (!isValidYouTubeUrl(url)) {
    showToast("❌ Please enter a valid YouTube URL", "error")
    return
  }

  if (videoDatabase[title]) {
    showToast("❌ A video with this title already exists", "error")
    return
  }

  const videoId = extractYouTubeId(url)

  videoDatabase[title] = {
    url: url,
    type: "youtube",
    duration: "Unknown",
    views: 0,
    likes: 0,
    description: description || "No description provided",
    thumbnail: getYouTubeThumbnail(videoId),
    progress: 0,
    status: "not-started",
    category: category,
  }

  renderVideoGrid()
  renderContinueCards()
  hideAddVideoModal()

  showToast(`✅ Added "${title}" successfully!`, "success")
}

// ===== FILTER AND SORT FUNCTIONS =====
function filterVideos() {
  const searchInput = document.getElementById("search-input")
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

  const videoCards = document.querySelectorAll(".video-card")

  videoCards.forEach((card) => {
    const title = card.dataset.title.toLowerCase()
    const status = card.dataset.status
    const category = card.dataset.category

    let showCard = true

    // Filter by search term
    if (searchTerm && !title.includes(searchTerm)) {
      showCard = false
    }

    // Filter by status
    if (currentFilter !== "all") {
      if (currentFilter === "new" && status !== "not-started") {
        showCard = false
      } else if (currentFilter !== "new" && status !== currentFilter) {
        showCard = false
      }
    }

    card.style.display = showCard ? "block" : "none"
  })
}

function sortVideos() {
  const videoGrid = document.getElementById("video-grid")
  if (!videoGrid) return

  const videoCards = Array.from(videoGrid.children)

  videoCards.sort((a, b) => {
    const titleA = a.dataset.title
    const titleB = b.dataset.title
    const progressA = Number.parseInt(a.dataset.progress) || 0
    const progressB = Number.parseInt(b.dataset.progress) || 0

    switch (currentSort) {
      case "alphabetical":
        return titleA.localeCompare(titleB)
      case "progress":
        return progressB - progressA
      case "duration":
        // Simple duration comparison (would need more complex parsing for real implementation)
        return titleA.localeCompare(titleB)
      case "recent":
      default:
        return 0 // Keep original order for recent
    }
  })

  // Re-append sorted cards
  videoCards.forEach((card) => videoGrid.appendChild(card))
}

// ===== ACTION FUNCTIONS =====
function shareFeaturedVideo() {
  if (!window.featuredVideo) return

  const { title, video } = window.featuredVideo

  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: `Check out this amazing video: ${title}`,
        url: video.url,
      })
      .then(() => {
        showToast("📤 Video shared successfully!", "success")
      })
      .catch(() => {
        fallbackShare(video.url)
      })
  } else {
    fallbackShare(video.url)
  }
}

function toggleFeaturedBookmark() {
  const bookmarkBtn = document.getElementById("bookmark-btn")
  if (!bookmarkBtn) return

  if (bookmarkBtn.classList.contains("active")) {
    bookmarkBtn.classList.remove("active")
    showToast("🔖 Removed from bookmarks", "warning")
  } else {
    bookmarkBtn.classList.add("active")
    showToast("📌 Added to bookmarks!", "success")
  }
}

function toggleVideoLike() {
  const likeBtn = document.getElementById("like-btn")
  const modalLikes = document.getElementById("modal-likes")

  if (currentVideo && videoDatabase[currentVideo] && likeBtn && modalLikes) {
    if (likeBtn.classList.contains("active")) {
      likeBtn.classList.remove("active")
      videoDatabase[currentVideo].likes--
      showToast("💔 Removed from liked videos", "warning")
    } else {
      likeBtn.classList.add("active")
      videoDatabase[currentVideo].likes++
      showToast("❤️ Added to liked videos!", "success")
    }
    modalLikes.textContent = videoDatabase[currentVideo].likes
  }
}

function toggleVideoBookmark() {
  const bookmarkBtn = document.getElementById("bookmark-modal-btn")
  if (!bookmarkBtn) return

  if (bookmarkBtn.classList.contains("active")) {
    bookmarkBtn.classList.remove("active")
    showToast("🔖 Removed from bookmarks", "warning")
  } else {
    bookmarkBtn.classList.add("active")
    showToast("📌 Added to bookmarks!", "success")
  }
}

function shareCurrentVideo() {
  if (!currentVideo) return

  const videoInfo = videoDatabase[currentVideo]

  if (navigator.share) {
    navigator
      .share({
        title: currentVideo,
        text: `Check out this amazing video: ${currentVideo}`,
        url: videoInfo.url,
      })
      .then(() => {
        showToast("📤 Video shared successfully!", "success")
      })
      .catch(() => {
        fallbackShare(videoInfo.url)
      })
  } else {
    fallbackShare(videoInfo.url)
  }
}

function downloadCurrentVideo() {
  if (!currentVideo) return
  showToast("📥 Download feature coming soon!", "info")
}

function fallbackShare(url) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      showToast("📋 Video link copied to clipboard!", "success")
    })
    .catch(() => {
      showToast("❌ Unable to copy link", "error")
    })
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

  switch (e.code) {
    case "Space":
      e.preventDefault()
      if (currentPage === "featured" && window.featuredVideo) {
        playFeaturedVideo()
      }
      break
    case "KeyS":
      e.preventDefault()
      const searchInput = document.getElementById("search-input")
      if (searchInput && currentPage === "library") {
        searchInput.focus()
      }
      break
    case "Escape":
      e.preventDefault()
      const videoModal = document.getElementById("video-modal")
      const addVideoModal = document.getElementById("add-video-modal")

      if (videoModal && videoModal.classList.contains("show")) {
        hideVideoModal()
      } else if (addVideoModal && addVideoModal.classList.contains("show")) {
        hideAddVideoModal()
      }
      break
    case "Digit1":
      e.preventDefault()
      switchPage("featured")
      break
    case "Digit2":
      e.preventDefault()
      switchPage("library")
      break
    case "Digit3":
      e.preventDefault()
      switchPage("playlists")
      break
    case "Digit4":
      e.preventDefault()
      switchPage("history")
      break
    case "Digit5":
      e.preventDefault()
      switchPage("bookmarks")
      break
    case "Digit6":
      e.preventDefault()
      switchPage("analytics")
      break
    case "Digit7":
      e.preventDefault()
      switchPage("settings")
      break
  }
}

// ===== UTILITY FUNCTIONS =====
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

// Initialize search with debounce
const debouncedSearch = debounce(filterVideos, 300)