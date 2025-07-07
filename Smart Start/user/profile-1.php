<?php
session_start();
require_once "db.php";

$success = $error = "";

// Handle AJAX request for username
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['get_username'])) {
    $email = trim($_POST["email"]);
    
    $stmt = $conn->prepare("SELECT username FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user && $user['username']) {
        echo $user['username'];
    } else {
        echo "User not found";
    }
    exit();
}

// Handle AJAX request for fetching user data
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action']) && $_POST['action'] === 'fetch_user') {
    $email = trim($_POST["email"]);
    
    $stmt = $conn->prepare("SELECT id, username, profile_image FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    header('Content-Type: application/json');
    if ($user) {
        echo json_encode([
            'success' => true,
            'username' => $user['username'] ?? 'User',
            'profile_image' => $user['profile_image'] ? 'uploads/' . $user['profile_image'] : null
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    exit();
}

// Handle image upload
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["profile_image"])) {
    $email = trim($_POST["email"]);

    $stmt = $conn->prepare("SELECT id, username FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        $user_id = $user['id'];
        $image = $_FILES["profile_image"];

        // Validate image
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $max_size = 5 * 1024 * 1024; // 5MB

        if ($image['error'] === 0) {
            if (in_array($image['type'], $allowed_types) && $image['size'] <= $max_size) {
                $ext = pathinfo($image["name"], PATHINFO_EXTENSION);
                $new_name = "profile_" . $user_id . "_" . time() . "." . $ext;
                $upload_path = "uploads/" . $new_name;

                // Create uploads directory if it doesn't exist
                if (!is_dir('uploads')) {
                    mkdir('uploads', 0755, true);
                }

                // Delete old profile image if exists
                if (isset($_SESSION["profile_image"]) && file_exists("uploads/" . $_SESSION["profile_image"])) {
                    unlink("uploads/" . $_SESSION["profile_image"]);
                }

                if (move_uploaded_file($image["tmp_name"], $upload_path)) {
                    $stmt = $conn->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
                    $stmt->bind_param("si", $new_name, $user_id);
                    
                    if ($stmt->execute()) {
                        // Update session with new image
                        $_SESSION["profile_image"] = $new_name;
                        $_SESSION["user_id"] = $user_id;
                        $_SESSION["username"] = $user['username'];
                        
                        $success = "Profile image updated successfully!";
                        
                        // Redirect after 2 seconds to show success message
echo "<script>
    setTimeout(function() {
        window.location.href = './nav-user.php';
    }, 2000);
</script>";

                    } else {
                        $error = "Failed to update database.";
                    }
                } else {
                    $error = "Failed to upload image.";
                }
            } else {
                $error = "Invalid image file. Please upload JPEG, PNG, GIF, or WebP files under 5MB.";
            }
        } else {
            $error = "Error uploading file: " . $image['error'];
        }
    } else {
        $error = "Email not found.";
    }
}

// Get current profile image for display
$current_image = isset($_SESSION['profile_image']) ? 'uploads/' . $_SESSION['profile_image'] : '/placeholder.svg?height=120&width=120';
$current_username = isset($_SESSION['username']) ? $_SESSION['username'] : 'John Doe';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile - Upload Photo</title>
    <link rel="stylesheet" href="profile.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">.
       <!-- Font Awesome with integrity check -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- SEO Meta Tags -->
    <meta name="description" content="SmartStart - The only way to success. Professional web development, cloud solutions, mobile apps, and data analytics services.">
    <meta name="keywords" content="web development, cloud solutions, mobile apps, data analytics, digital transformation">
    <meta name="author" content="SmartStart">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="SmartStart - The Only Way to Success">
    <meta property="og:description" content="Professional digital solutions for your business transformation">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://smartstart.com">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwODkxYjIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggMkw2IDZIMTBMOCAyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggMTRMNiAxMEgxMEw4IDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=">

    <!-- Performance optimization -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <h2>SmartStart</h2>
            </div>
            <ul class="nav-menu">
                <li><a href="../home/home.html" class="nav-link">Home</a></li>
                <li><a href="../about-us/about.html" class="nav-link">About</a></li>
                <li><a href="../services/services.html" class="nav-link">Services</a></li>
                <li><a href="../portfolio/portfolio.html" class="nav-link">Portfolio</a></li>
                <li><a href="../contact-us/contact.php" class="nav-link">Contact</a></li>
            </ul>
            <div class="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <!-- Profile Header -->
        <section class="profile-header">
            <div class="container">
                <?php if ($success): ?>
                    <div style="background: var(--success); color: white; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">
                        <i class="fas fa-check-circle"></i> <?= htmlspecialchars($success) ?>
                    </div>
                <?php endif; ?>

                <?php if ($error): ?>
                    <div style="background: var(--error); color: white; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">
                        <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <div class="profile-info">
                    <div class="profile-avatar" onclick="document.getElementById('profile_image').click()">
                        <img id="profileImage" src="<?= htmlspecialchars($current_image) ?>" alt="Profile Picture">
                        <div class="upload-overlay">
                            <i class="fas fa-camera"></i>
                        </div>
                    </div>
                    <div class="profile-details">
                        <h1 id="displayUsername"><?= htmlspecialchars($current_username) ?></h1>
                        <p class="profile-username" id="displayEmail">@user</p>
                        <p class="profile-bio">Content creator and lifelong learner. Passionate about technology and education.</p>
                        <div class="profile-stats">
                            <div class="stat">
                                <span class="stat-number">127</span>
                                <span class="stat-label">Videos Watched</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">23</span>
                                <span class="stat-label">Saved</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">8</span>
                                <span class="stat-label">Mentors</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Upload Form Section -->
        <section class="content-section">
            <div class="container">
                <div class="content-header">
                    <h2>Update Profile Image</h2>
                </div>
                
                <form method="post" enctype="multipart/form-data" id="uploadForm" style="background: var(--card); padding: 2rem; border-radius: 12px; border: 1px solid var(--border); max-width: 500px; margin: 0 auto;">
                    <div style="margin-bottom: 1.5rem;">
                        <label for="email" style="display: block; margin-bottom: 0.5rem; color: var(--foreground); font-weight: 600;">
                            <i class="fas fa-envelope" style="margin-right: 0.5rem; color: var(--accent-light);"></i>
                            Email Address
                        </label>
                        <input type="email" 
                               name="email" 
                               id="email" 
                               placeholder="Enter your email" 
                               required
                               style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--background); color: var(--foreground); font-size: 1rem; transition: all 0.3s ease;"
                               onfocus="this.style.borderColor='var(--accent-light)'"
                               onblur="this.style.borderColor='var(--border)'">
                        <div id="emailStatus" style="margin-top: 0.5rem; font-size: 0.9rem;"></div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label for="profile_image" style="display: block; margin-bottom: 0.5rem; color: var(--foreground); font-weight: 600;">
                            <i class="fas fa-image" style="margin-right: 0.5rem; color: var(--accent-light);"></i>
                            Choose Profile Image
                        </label>
                        <input type="file" 
                               name="profile_image" 
                               id="profile_image" 
                               accept="image/*" 
                               required
                               style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--background); color: var(--foreground); font-size: 1rem;">
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
                        <i class="fas fa-upload"></i>
                        Upload Image
                    </button>
                </form>
            </div>
        </section>
    </main>


    <script src="profile.js">
    </script>
</body>
</html>