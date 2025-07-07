// Sample student data
const studentsData = [{
        id: 1,
        name: "Sarah Chen",
        title: "Computer Science Student",
        level: "Intermediate",
        avatar: "../image/C:/xampp/htdocs/Smart Start/image/164-1642470_girl-hd-png-download.png",
        goals: "Looking to transition into full-stack development and build real-world projects",
        skills: ["JavaScript", "React", "Python", "Git"],
        interests: ["Web Development", "Machine Learning", "Open Source"]
    },
    {
        id: 2,
        name: "Marcus Johnson",
        title: "Marketing Graduate",
        level: "Beginner",
        avatar: "/placeholder.svg?height=60&width=60",
        goals: "Seeking guidance to break into digital marketing and grow my professional network",
        skills: ["Social Media", "Content Writing", "Analytics", "SEO"],
        interests: ["Digital Marketing", "Brand Strategy", "Content Creation"]
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        title: "UX Design Enthusiast",
        level: "Intermediate",
        avatar: "/placeholder.svg?height=60&width=60",
        goals: "Want to improve my design skills and learn about user research methodologies",
        skills: ["Figma", "Sketch", "Prototyping", "User Research"],
        interests: ["UI/UX Design", "Product Design", "Design Systems"]
    },
    {
        id: 4,
        name: "David Kim",
        title: "Data Science Student",
        level: "Advanced",
        avatar: "/placeholder.svg?height=60&width=60",
        goals: "Looking for mentorship in machine learning and career guidance for data science roles",
        skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
        interests: ["Data Science", "AI", "Statistics", "Business Intelligence"]
    },
    {
        id: 5,
        name: "Aisha Patel",
        title: "Business Student",
        level: "Beginner",
        avatar: "/placeholder.svg?height=60&width=60",
        goals: "Interested in entrepreneurship and learning about startup ecosystem",
        skills: ["Business Analysis", "Excel", "Presentation", "Research"],
        interests: ["Entrepreneurship", "Business Strategy", "Startups"]
    },
    {
        id: 6,
        name: "James Wilson",
        title: "Software Engineering Student",
        level: "Intermediate",
        avatar: "/placeholder.svg?height=60&width=60",
        goals: "Preparing for technical interviews and seeking industry insights",
        skills: ["Java", "Spring Boot", "Docker", "AWS"],
        interests: ["Backend Development", "Cloud Computing", "System Design"]
    }
];

// DOM elements
const searchInput = document.getElementById('searchInput');
const skillFilter = document.getElementById('skillFilter');
const levelFilter = document.getElementById('levelFilter');
const goalFilter = document.getElementById('goalFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const studentsGrid = document.getElementById('studentsGrid');
const resultsCount = document.getElementById('resultsCount');
const viewBtns = document.querySelectorAll('.view-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const connectionModal = document.getElementById('connectionModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelConnectionBtn = document.getElementById('cancelConnection');

// State
let filteredStudents = [...studentsData];
let displayedStudents = 6;
let currentView = 'grid';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderStudents();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    skillFilter.addEventListener('change', handleFilter);
    levelFilter.addEventListener('change', handleFilter);
    goalFilter.addEventListener('change', handleFilter);
    clearFiltersBtn.addEventListener('click', clearFilters);
    loadMoreBtn.addEventListener('click', loadMoreStudents);
    closeModalBtn.addEventListener('click', closeModal);
    cancelConnectionBtn.addEventListener('click', closeModal);

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => toggleView(btn.dataset.view));
    });

    // Close modal when clicking outside
    connectionModal.addEventListener('click', (e) => {
        if (e.target === connectionModal) {
            closeModal();
        }
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    applyFilters();
}

// Filter functionality
function handleFilter() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const skillFilter = document.getElementById('skillFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;
    const goalFilter = document.getElementById('goalFilter').value;

    filteredStudents = studentsData.filter(student => {
        const matchesSearch = !searchTerm ||
            student.name.toLowerCase().includes(searchTerm) ||
            student.title.toLowerCase().includes(searchTerm) ||
            student.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
            student.interests.some(interest => interest.toLowerCase().includes(searchTerm));

        const matchesSkill = !skillFilter ||
            student.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

        const matchesLevel = !levelFilter ||
            student.level.toLowerCase() === levelFilter.toLowerCase();

        const matchesGoal = !goalFilter ||
            student.goals.toLowerCase().includes(goalFilter.toLowerCase().replace('-', ' '));

        return matchesSearch && matchesSkill && matchesLevel && matchesGoal;
    });

    displayedStudents = 6;
    renderStudents();
    updateResultsCount();
}

function clearFilters() {
    searchInput.value = '';
    skillFilter.value = '';
    levelFilter.value = '';
    goalFilter.value = '';
    filteredStudents = [...studentsData];
    displayedStudents = 6;
    renderStudents();
    updateResultsCount();
}

// Render students
function renderStudents() {
    const studentsToShow = filteredStudents.slice(0, displayedStudents);

    studentsGrid.innerHTML = studentsToShow.map(student => `
    <div class="student-card" data-student-id="${student.id}">
      <div class="student-header">
        <img src="${student.avatar}" alt="${student.name}" class="student-avatar">
        <div class="student-info">
          <h3>${student.name}</h3>
          <p class="student-title">${student.title}</p>
        </div>
      </div>
      
      <div class="student-level">${student.level}</div>
      
      <div class="student-goals">
        <h4>Goals</h4>
        <p>${student.goals}</p>
      </div>
      
      <div class="student-skills">
        <h4>Skills</h4>
        <div class="skills-list">
          ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      
      <div class="student-actions">
        <button class="btn-primary connect-btn" data-student-id="${student.id}">
          <i class="fas fa-handshake"></i> Connect
        </button>
        <button class="btn-secondary view-profile-btn" data-student-id="${student.id}">
          <i class="fas fa-user"></i> View Profile
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to connect buttons
  document.querySelectorAll('.connect-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const studentId = parseInt(btn.dataset.studentId);
      openConnectionModal(studentId);
    });
  });
  
  // Add event listeners to view profile buttons
  document.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const studentId = parseInt(btn.dataset.studentId);
      viewStudentProfile(studentId);
    });
  });
  
  // Update load more button visibility
  loadMoreBtn.style.display = displayedStudents >= filteredStudents.length ? 'none' : 'block';
}

// Update results count
function updateResultsCount() {
  const count = filteredStudents.length;
  resultsCount.textContent = `${count} student${count !== 1 ? 's' : ''} found`;
}

// Load more students
function loadMoreStudents() {
  displayedStudents += 6;
  renderStudents();
}

// View toggle
function toggleView(view) {
  currentView = view;
  viewBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  studentsGrid.classList.toggle('list-view', view === 'list');
}

// Modal functionality
function openConnectionModal(studentId) {
  const student = studentsData.find(s => s.id === studentId);
  if (!student) return;
  
  document.getElementById('modalStudentAvatar').src = student.avatar;
  document.getElementById('modalStudentName').textContent = student.name;
  document.getElementById('modalStudentTitle').textContent = student.title;
  
  connectionModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  connectionModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.getElementById('connectionMessage').value = '';
}

function viewStudentProfile(studentId) {
  // This would typically navigate to a detailed profile page
  console.log(`Viewing profile for student ID: ${studentId}`);
  // For demo purposes, we'll just show an alert
  const student = studentsData.find(s => s.id === studentId);
  alert(`Viewing ${student.name}'s full profile...`);
}

// Handle connection form submission
document.querySelector('.connection-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const message = document.getElementById('connectionMessage').value;
  
  if (message.trim()) {
    // Simulate sending connection request
    alert('Connection request sent successfully!');
    closeModal();
  } else {
    alert('Please write a message before sending the connection request.');
  }
});

// Mobile menu toggle (basic implementation)
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
  const navMenu = document.querySelector('.nav-menu');
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});