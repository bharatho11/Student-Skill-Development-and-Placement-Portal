document.addEventListener("DOMContentLoaded", () => {
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const studentName = currentUser.name || "Student";
  document.getElementById("topUserName").textContent = studentName;
  document.getElementById("topInitials").textContent = studentName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();

  const tests = {
    fundamentals: {
      name: "Technical Fundamentals", level: "BEGINNER", duration: 10,
      questions: [
        { q: "What does HTML stand for?", o: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text Management Language", "Home Tool Markup Language"], a: 0 },
        { q: "Which CSS property changes the background colour?", o: ["color", "background-color", "font-color", "bg"], a: 1 },
        { q: "Which keyword declares a variable that can be reassigned in JavaScript?", o: ["const", "let", "static", "define"], a: 1 },
        { q: "Which Python keyword defines a function?", o: ["function", "def", "fun", "method"], a: 1 },
        { q: "Which SQL command retrieves records?", o: ["INSERT", "UPDATE", "SELECT", "DELETE"], a: 2 },
        { q: "Which HTML tag creates an unordered list?", o: ["<ol>", "<ul>", "<li>", "<list>"], a: 1 },
        { q: "Which CSS selector targets a class named card?", o: ["#card", ".card", "card", "*card"], a: 1 },
        { q: "Which JavaScript method adds an item to the end of an array?", o: ["pop()", "shift()", "push()", "slice()"], a: 2 },
        { q: "Which Python data type stores key-value pairs?", o: ["list", "tuple", "dictionary", "set"], a: 2 },
        { q: "Which SQL clause filters rows?", o: ["ORDER BY", "WHERE", "GROUP BY", "JOIN"], a: 1 }
      ]
    },
    programming: {
      name: "Programming & Logic", level: "INTERMEDIATE", duration: 10,
      questions: [
        { q: "What is the time complexity of binary search on a sorted array?", o: ["O(n)", "O(log n)", "O(n²)", "O(1)"], a: 1 },
        { q: "Which data structure follows LIFO?", o: ["Queue", "Stack", "Tree", "Graph"], a: 1 },
        { q: "What is the result of 7 // 2 in Python?", o: ["3.5", "4", "3", "2"], a: 2 },
        { q: "Which loop checks its condition before each iteration?", o: ["while", "do-while", "repeat-until", "foreach only"], a: 0 },
        { q: "Which SQL operation combines rows from related tables?", o: ["MERGE", "JOIN", "UNION only", "ORDER"], a: 1 },
        { q: "Which principle hides internal object details and exposes necessary operations?", o: ["Inheritance", "Encapsulation", "Iteration", "Compilation"], a: 1 },
        { q: "What does an algorithm represent?", o: ["A programming language", "A finite sequence of steps to solve a problem", "A database table", "A hardware device"], a: 1 },
        { q: "Which JavaScript method creates a new array by transforming each element?", o: ["filter()", "reduce()", "map()", "find()"], a: 2 },
        { q: "Which data structure is commonly used for breadth-first search?", o: ["Stack", "Queue", "Heap", "Hash set"], a: 1 },
        { q: "What is the output of Boolean(0) in JavaScript?", o: ["true", "false", "0", "undefined"], a: 1 }
      ]
    }
  };

  const userKey = currentUser.email || "guest";
  const scoreKey = `ssdp_mock_scores_${userKey}`;
  const selection = document.getElementById("testSelection");
  const runPanel = document.getElementById("testRun");
  const resultPanel = document.getElementById("testResult");
  let activeTest = null, answers = [], questionIndex = 0, secondsLeft = 0, timerId = null;

  function readScores() {
    try {
      const data = JSON.parse(localStorage.getItem(scoreKey)) || [];
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }
  function renderStats() {
    const scores = readScores();
    const values = scores.map(item => Number(typeof item === "object" ? item.score : item)).filter(Number.isFinite);
    document.getElementById("testsCompleted").textContent = values.length;
    document.getElementById("averageScore").textContent = values.length ? `${Math.round(values.reduce((a,b) => a+b, 0) / values.length)}%` : "0%";
    document.getElementById("bestScore").textContent = values.length ? `${Math.max(...values)}%` : "0%";
  }
  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }
  function updateTimer() {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    document.getElementById("timer").textContent = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    if (secondsLeft <= 60) document.getElementById("timer").style.color = "#dc2626";
  }
  function startTimer() {
    stopTimer();
    secondsLeft = activeTest.duration * 60;
    document.getElementById("timer").style.color = "";
    updateTimer();
    timerId = setInterval(() => {
      secondsLeft -= 1;
      updateTimer();
      if (secondsLeft <= 0) submitTest();
    }, 1000);
  }
  function beginTest(id) {
    activeTest = tests[id];
    answers = Array(activeTest.questions.length).fill(null);
    questionIndex = 0;
    selection.hidden = true;
    resultPanel.hidden = true;
    runPanel.hidden = false;
    document.getElementById("runningTestName").textContent = activeTest.name;
    document.getElementById("runningTestLevel").textContent = activeTest.level;
    startTimer();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function renderQuestion() {
    const item = activeTest.questions[questionIndex];
    document.getElementById("testQuestionCount").textContent = `Question ${questionIndex + 1} of ${activeTest.questions.length}`;
    document.getElementById("answeredCount").textContent = `${answers.filter(a => a !== null).length} answered`;
    document.getElementById("testProgressBar").style.width = `${((questionIndex + 1) / activeTest.questions.length) * 100}%`;
    document.getElementById("testQuestion").textContent = item.q;
    const options = document.getElementById("testOptions");
    options.innerHTML = "";
    item.o.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `test-option${answers[questionIndex] === index ? " selected" : ""}`;
      const letter = document.createElement("span");
      letter.className = "test-option-letter";
      letter.textContent = String.fromCharCode(65 + index);
      const text = document.createElement("span");
      text.textContent = option;
      button.append(letter, text);
      button.addEventListener("click", () => {
        answers[questionIndex] = index;
        renderQuestion();
      });
      options.append(button);
    });
    document.getElementById("previousBtn").disabled = questionIndex === 0;
    document.getElementById("nextQuestionBtn").textContent = questionIndex === activeTest.questions.length - 1 ? "Review answers →" : "Next Question →";
  }
  function submitTest() {
    if (!activeTest || runPanel.hidden) return;
    stopTimer();
    const correct = activeTest.questions.reduce((sum, q, i) => sum + (answers[i] === q.a ? 1 : 0), 0);
    const total = activeTest.questions.length;
    const score = Math.round(correct / total * 100);
    const scores = readScores();
    scores.push({ name: activeTest.name, score, correct, total, date: new Date().toISOString() });
    localStorage.setItem(scoreKey, JSON.stringify(scores));
    // Keep a shared legacy key for simple dashboard integrations.
    localStorage.setItem("ssdp_mock_scores", JSON.stringify(scores.map(item => item.score)));
    runPanel.hidden = true;
    resultPanel.hidden = false;
    document.getElementById("resultPercent").textContent = `${score}%`;
    document.getElementById("resultCorrect").textContent = correct;
    document.getElementById("resultIncorrect").textContent = total - correct;
    document.getElementById("resultTotal").textContent = total;
    document.getElementById("resultDescription").textContent = `${activeTest.name} completed. Your score has been saved.`;
    renderStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeTest = null;
  }

  document.querySelectorAll(".start-test-btn[data-test]").forEach(button => {
    button.addEventListener("click", () => beginTest(button.dataset.test));
  });
  document.getElementById("previousBtn").addEventListener("click", () => {
    if (questionIndex > 0) { questionIndex -= 1; renderQuestion(); }
  });
  document.getElementById("nextQuestionBtn").addEventListener("click", () => {
    if (questionIndex < activeTest.questions.length - 1) { questionIndex += 1; renderQuestion(); }
    else {
      const unanswered = answers.filter(answer => answer === null).length;
      if (unanswered) {
        const proceed = confirm(`You have ${unanswered} unanswered question(s). Submit the test anyway?`);
        if (proceed) submitTest();
      } else submitTest();
    }
  });
  document.getElementById("submitTestBtn").addEventListener("click", () => {
    const unanswered = answers.filter(answer => answer === null).length;
    if (unanswered && !confirm(`You have ${unanswered} unanswered question(s). Submit the test anyway?`)) return;
    submitTest();
  });
  document.getElementById("backToTestsBtn").addEventListener("click", () => {
    resultPanel.hidden = true;
    selection.hidden = false;
    activeTest = null;
    renderStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    stopTimer();
    if (typeof logoutUser === "function") logoutUser();
    else localStorage.removeItem("ssdp_current_user");
    window.location.href = "index.html";
  });
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  document.addEventListener("click", event => {
    if (window.innerWidth <= 760 && sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) && !menuToggle.contains(event.target)) sidebar.classList.remove("open");
  });
  renderStats();
});
