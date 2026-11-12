document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-toggle]").forEach(button => button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.toggle); if (!input) return;
    input.type = input.type === "password" ? "text" : "password"; button.textContent = input.type === "password" ? "Show" : "Hide";
  }));

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage"); message.classList.remove("success");
    if (!email || !password) { message.textContent = "Please enter both your email address and password."; return; }
    const user = getUsers().find(item => item.email === email && item.password === password);
    if (!user) { message.textContent = "Account not found or password is incorrect. Please check your details or register."; return; }
    setCurrentUser(user); message.textContent = "Login successful. Redirecting..."; message.classList.add("success");
    window.location.href = "dashboard.html";
  });

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage"); message.classList.remove("success");
    if (!name || !email || !password || !confirmPassword) { message.textContent = "Please complete all fields."; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { message.textContent = "Please enter a valid email address."; return; }
    if (password.length < 6) { message.textContent = "Password must contain at least 6 characters."; return; }
    if (password !== confirmPassword) { message.textContent = "Passwords do not match."; return; }
    const users = getUsers();
    if (users.some(item => item.email === email)) { message.textContent = "An account with this email already exists. Please sign in."; return; }
    const newUser = { name, email, password }; users.push(newUser); saveUsers(users); setCurrentUser(newUser);
    message.textContent = "Account created successfully. Redirecting..."; message.classList.add("success");
    window.location.href = "dashboard.html";
  });

  const welcomeTitle = document.getElementById("welcomeTitle");
  if (welcomeTitle) { const currentUser = getCurrentUser(); if (!currentUser) { window.location.href = "index.html"; return; } welcomeTitle.textContent = `Welcome, ${currentUser.name}!`; }
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => { logoutUser(); window.location.href = "index.html"; });
});
