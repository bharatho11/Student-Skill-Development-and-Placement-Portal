document.addEventListener("DOMContentLoaded", () => {
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const PROFILE_KEY = `ssdp_profile_${currentUser.email}`;
  const defaults = {
    fullName: currentUser.name || "Bharath",
    email: currentUser.email || "",
    phone: "",
    dob: "11-Feb-2002",
    college: "SRM",
    course: "MCA",
    semester: "III Semester",
    graduation: "",
    skills: ["HTML", "CSS", "JavaScript"]
  };

  let profile = loadProfile();
  let editing = false;
  let originalProfile = null;

  const fields = ["fullName", "email", "phone", "dob", "college", "course", "semester", "graduation"];
  const form = document.getElementById("profileForm");
  const editButton = document.getElementById("editProfileBtn");
  const actions = document.getElementById("profileActions");
  const skillsEditor = document.getElementById("skillsEditor");
  const skillsDisplay = document.getElementById("skillsDisplay");
  const message = document.getElementById("profileMessage");

  function loadProfile() {
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}) };
    } catch {
      return { ...defaults };
    }
  }

  function saveProfile() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function initials(name) {
    return (name || "Student").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  }

  function render() {
    fields.forEach(id => {
      const input = document.getElementById(id);
      input.value = profile[id] || "";
    });
    document.getElementById("displayName").textContent = profile.fullName || "Student";
    document.getElementById("displayCourse").textContent = `${profile.course || "Student"} Student`;
    document.getElementById("topUserName").textContent = profile.fullName || "Student";
    document.getElementById("topInitials").textContent = initials(profile.fullName);
    document.getElementById("profileAvatar").textContent = initials(profile.fullName);
    renderSkills();
  }

  function renderSkills() {
    skillsDisplay.innerHTML = "";
    profile.skills.forEach((skill, index) => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.append(document.createTextNode(skill));
      if (editing) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", `Remove ${skill}`);
        remove.textContent = "×";
        remove.addEventListener("click", () => {
          profile.skills.splice(index, 1);
          renderSkills();
        });
        tag.append(remove);
      }
      skillsDisplay.append(tag);
    });
  }

  function setEditing(value) {
    editing = value;

    fields.forEach(id => {
        document.getElementById(id).disabled = !value || id === "email";
    });

    actions.hidden = !value;
    skillsEditor.hidden = !value;
    editButton.hidden = value;

    actions.style.display = value ? "flex" : "none";
    skillsEditor.style.display = value ? "flex" : "none";
    editButton.style.display = value ? "none" : "inline-flex";

    renderSkills();

    message.textContent = "";
    message.classList.remove("error");
} 

  editButton.addEventListener("click", () => {
    originalProfile = JSON.parse(JSON.stringify(profile));
    setEditing(true);
  });

  document.getElementById("cancelEditBtn").addEventListener("click", () => {
    profile = originalProfile || profile;
    render();
    setEditing(false);
    message.textContent = "Changes discarded.";
    message.classList.remove("error");
  });

  document.getElementById("addSkillBtn").addEventListener("click", () => {
    const input = document.getElementById("skillInput");
    const skill = input.value.trim();
    if (!skill) return;
    if (profile.skills.some(item => item.toLowerCase() === skill.toLowerCase())) {
      message.textContent = "That skill is already listed.";
      message.classList.add("error");
      return;
    }
    profile.skills.push(skill);
    input.value = "";
    message.textContent = "";
    renderSkills();
  });

  document.getElementById("skillInput").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("addSkillBtn").click();
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!editing) return;
    fields.forEach(id => { profile[id] = document.getElementById(id).value.trim(); });
    if (!profile.fullName) {
      message.textContent = "Full name is required.";
      message.classList.add("error");
      return;
    }
    if (profile.phone && !/^[0-9+\-\s()]{7,18}$/.test(profile.phone)) {
      message.textContent = "Please enter a valid phone number.";
      message.classList.add("error");
      return;
    }
    saveProfile();
render();
setEditing(false);

message.textContent = "Profile changes saved successfully.";
message.classList.remove("error");
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (typeof logoutUser === "function") logoutUser();
    else localStorage.removeItem("ssdp_current_user");
    window.location.href = "index.html";
  });

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  document.addEventListener("click", event => {
    if (window.innerWidth <= 760 && sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove("open");
    }
  });

  render();
});
