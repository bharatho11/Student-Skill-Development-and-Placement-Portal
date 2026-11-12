// Browser Local Storage helpers for the SSDP academic demo.
const SSDP_STORAGE_KEYS = { users: "ssdp_users", currentUser: "ssdp_current_user" };
function getUsers() { try { return JSON.parse(localStorage.getItem(SSDP_STORAGE_KEYS.users)) || []; } catch { return []; } }
function saveUsers(users) { localStorage.setItem(SSDP_STORAGE_KEYS.users, JSON.stringify(users)); }
function getCurrentUser() { try { return JSON.parse(localStorage.getItem(SSDP_STORAGE_KEYS.currentUser)); } catch { return null; } }
function setCurrentUser(user) { localStorage.setItem(SSDP_STORAGE_KEYS.currentUser, JSON.stringify({ name: user.name, email: user.email })); }
function logoutUser() { localStorage.removeItem(SSDP_STORAGE_KEYS.currentUser); }
