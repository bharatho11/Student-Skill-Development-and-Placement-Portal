document.addEventListener("DOMContentLoaded", () => {
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  // Protect the dashboard from access without a logged-in demo account.
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const name = currentUser.name || "Student";
  document.getElementById("welcomeTitle").textContent = `Welcome back, ${name}!`;
  document.getElementById("topUserName").textContent = name;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  document.getElementById("userInitials").textContent = initials || "S";

  // These values will be populated by the Practice Zone and Mock Tests modules.

const practiceStats = JSON.parse(
    localStorage.getItem(`ssdp_practice_stats_${currentUser.email}`) || '{"attempted":0, "correct":0}'
);

const practiceCount = practiceStats.attempted || 0;
  // Get mock test scores for the logged-in student.
const mockScoreKey = `ssdp_mock_scores_${currentUser.email}`;

const mockScores = JSON.parse(
    localStorage.getItem(mockScoreKey) || "[]"
);
  // const validScores = Array.isArray(mockScores) ? mockScores.map(Number).filter(n => Number.isFinite(n)) : [];
  const validScores = Array.isArray(mockScores)
    ? mockScores.map(item =>
        Number(typeof item === "object" && item !== null
            ? item.score
            : item)
      ).filter(n => Number.isFinite(n))
    : [];
  const average = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  const best = validScores.length ? Math.max(...validScores) : 0;

  document.getElementById("practiceCount").textContent = practiceCount;
  document.getElementById("mockCount").textContent = validScores.length;
  document.getElementById("averageScore").textContent = `${average}%`;
  document.getElementById("bestScore").textContent = `${best}%`;
  document.getElementById("practiceProgressText").textContent = `${practiceCount} attempted`;
  document.getElementById("mockProgressText").textContent = `${validScores.length} completed`;
  document.getElementById("practiceProgressBar").style.width = `${Math.min(practiceCount, 100)}%`;
  document.getElementById("mockProgressBar").style.width = `${Math.min(validScores.length * 20, 100)}%`;

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    if (typeof logoutUser === "function") logoutUser();
    else localStorage.removeItem("ssdp_current_user");
    window.location.href = "index.html";
  });

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 760 && sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove("open");
    }
  });
});
