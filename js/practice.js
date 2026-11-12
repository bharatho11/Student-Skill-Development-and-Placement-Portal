document.addEventListener("DOMContentLoaded", () => {
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const name = currentUser.name || "Student";
  document.getElementById("topUserName").textContent = name;
  document.getElementById("topInitials").textContent = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();

  // Starter question bank. These can be expanded during project enhancement.
  const topics = [
    { id: "html", name: "HTML", icon: "H", questions: [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], answer: 0, explain: "HTML stands for Hyper Text Markup Language." },
      { q: "Which tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1, explain: "The anchor <a> element creates hyperlinks." },
      { q: "Which element is used for the largest heading?", options: ["<heading>", "<h6>", "<h1>", "<head>"], answer: 2, explain: "<h1> represents the highest-level heading." },
      { q: "Which attribute provides alternative text for an image?", options: ["title", "src", "alt", "name"], answer: 2, explain: "The alt attribute describes an image for accessibility and when it cannot load." },
      { q: "Which tag is used to create an ordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: 1, explain: "<ol> creates a numbered or ordered list." }
    ]},
    { id: "css", name: "CSS", icon: "C", questions: [
      { q: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax", "Colorful Style Sheets"], answer: 1, explain: "CSS stands for Cascading Style Sheets." },
      { q: "Which property changes text colour?", options: ["font-color", "text-style", "color", "foreground"], answer: 2, explain: "The color property sets the text colour." },
      { q: "Which symbol selects an element by its ID?", options: [".", "#", "*", "&"], answer: 1, explain: "The # symbol is used for ID selectors." },
      { q: "Which CSS layout system is designed for one-dimensional layouts?", options: ["Grid", "Float", "Flexbox", "Position"], answer: 2, explain: "Flexbox is designed for one-dimensional row or column layouts." },
      { q: "Which property adds space inside an element's border?", options: ["margin", "padding", "gap", "spacing"], answer: 1, explain: "Padding creates space between content and its border." }
    ]},
    { id: "javascript", name: "JavaScript", icon: "JS", questions: [
      { q: "Which keyword declares a block-scoped variable that can be reassigned?", options: ["const", "let", "static", "define"], answer: 1, explain: "let declares a block-scoped variable that can be reassigned." },
      { q: "Which method adds an item to the end of an array?", options: ["pop()", "shift()", "push()", "unshift()"], answer: 2, explain: "push() appends one or more items to an array." },
      { q: "Which operator checks both value and type equality?", options: ["==", "=", "===", "!="], answer: 2, explain: "The strict equality operator === compares value and type." },
      { q: "How do you write a single-line comment in JavaScript?", options: ["<!-- -->", "/* */", "//", "#"], answer: 2, explain: "A JavaScript single-line comment begins with //." },
      { q: "Which method converts a JSON string into a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()"], answer: 1, explain: "JSON.parse() parses a JSON string into a JavaScript value." }
    ]},
    { id: "python", name: "Python", icon: "Py", questions: [
      { q: "Which keyword is used to define a function in Python?", options: ["function", "func", "def", "lambda"], answer: 2, explain: "The def keyword begins a function definition." },
      { q: "Which data type stores True or False?", options: ["str", "bool", "int", "list"], answer: 1, explain: "bool is Python's Boolean data type." },
      { q: "Which symbol is used for comments in Python?", options: ["//", "#", "/*", "--"], answer: 1, explain: "A # begins a single-line Python comment." },
      { q: "Which method adds an item to a list?", options: ["add()", "insertEnd()", "append()", "push()"], answer: 2, explain: "append() adds an item to the end of a list." },
      { q: "What is the output of len('portal')?", options: ["5", "6", "7", "Error"], answer: 1, explain: "The word portal contains six characters." }
    ]},
    { id: "sql", name: "SQL", icon: "DB", questions: [
      { q: "Which SQL command retrieves data from a table?", options: ["GET", "OPEN", "SELECT", "FETCH ALL"], answer: 2, explain: "SELECT retrieves rows from one or more tables." },
      { q: "Which clause filters rows based on a condition?", options: ["ORDER BY", "WHERE", "GROUP BY", "FROM"], answer: 1, explain: "WHERE filters rows before grouping or ordering." },
      { q: "Which command adds a new row to a table?", options: ["ADD", "INSERT INTO", "UPDATE", "CREATE"], answer: 1, explain: "INSERT INTO adds new records to a table." },
      { q: "Which function counts rows?", options: ["SUM()", "TOTAL()", "COUNT()", "NUMBER()"], answer: 2, explain: "COUNT() returns the number of rows or non-NULL values, depending on its argument." },
      { q: "Which key uniquely identifies each row in a table?", options: ["Foreign key", "Primary key", "Candidate label", "Index only"], answer: 1, explain: "A primary key uniquely identifies each row in a table." }
    ]}
  ];

  const topicList = document.getElementById("topicList");
  const welcome = document.getElementById("practiceWelcome");
  const quizArea = document.getElementById("quizArea");
  const resultArea = document.getElementById("resultArea");
  const questionText = document.getElementById("questionText");
  const optionsList = document.getElementById("optionsList");
  const feedback = document.getElementById("answerFeedback");
  const nextBtn = document.getElementById("nextBtn");
  let activeTopic = null;
  let questionIndex = 0;
  let score = 0;
  let answered = false;

  const statsKey = `ssdp_practice_stats_${currentUser.email}`;
  function readStats() {
    try { return JSON.parse(localStorage.getItem(statsKey)) || { attempted: 0, correct: 0 }; }
    catch { return { attempted: 0, correct: 0 }; }
  }
  function updateStats(wasCorrect) {
    const stats = readStats();
    stats.attempted += 1;
    if (wasCorrect) stats.correct += 1;
    localStorage.setItem(statsKey, JSON.stringify(stats));
    renderStats();
  }
  function renderStats() {
    const stats = readStats();
    document.getElementById("totalAttempted").textContent = stats.attempted;
    document.getElementById("totalCorrect").textContent = stats.correct;
    document.getElementById("accuracy").textContent = stats.attempted ? `${Math.round(stats.correct / stats.attempted * 100)}%` : "0%";
  }

  function renderTopics() {
    topicList.innerHTML = "";
    topics.forEach(topic => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `topic-button${activeTopic && activeTopic.id === topic.id ? " active" : ""}`;
      button.innerHTML = `<span class="topic-symbol">${topic.icon}</span><span class="topic-copy"><strong>${topic.name}</strong><small>${topic.questions.length} practice questions</small></span><span class="topic-arrow">›</span>`;
      button.addEventListener("click", () => startTopic(topic));
      topicList.append(button);
    });
  }

  function startTopic(topic) {
    activeTopic = topic;
    questionIndex = 0;
    score = 0;
    answered = false;
    welcome.hidden = true;
    resultArea.hidden = true;
    quizArea.hidden = false;
    renderTopics();
    renderQuestion();
  }

  function renderQuestion() {
    const item = activeTopic.questions[questionIndex];
    document.getElementById("currentTopic").textContent = activeTopic.name;
    document.getElementById("questionCounter").textContent = `Question ${questionIndex + 1} of ${activeTopic.questions.length}`;
    document.getElementById("quizProgressBar").style.width = `${(questionIndex / activeTopic.questions.length) * 100}%`;
    questionText.textContent = item.q;
    optionsList.innerHTML = "";
    feedback.hidden = true;
    feedback.className = "answer-feedback";
    answered = false;
    nextBtn.disabled = true;
    nextBtn.textContent = questionIndex === activeTopic.questions.length - 1 ? "View results →" : "Next question →";

    item.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
      button.querySelector("span:last-child").textContent = option;
      button.addEventListener("click", () => chooseAnswer(index));
      optionsList.append(button);
    });
  }

  function chooseAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
    const item = activeTopic.questions[questionIndex];
    const correct = selectedIndex === item.answer;
    if (correct) score += 1;
    updateStats(correct);

    [...optionsList.children].forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("correct");
      else if (index === selectedIndex) button.classList.add("incorrect");
    });

    feedback.hidden = false;
    feedback.classList.add(correct ? "correct-feedback" : "wrong-feedback");
    feedback.textContent = `${correct ? "Correct!" : "Not quite."} ${item.explain}`;
    nextBtn.disabled = false;
  }

  function showResult() {
    quizArea.hidden = true;
    resultArea.hidden = false;
    document.getElementById("resultScore").textContent = `${score}/${activeTopic.questions.length}`;
    const percent = Math.round(score / activeTopic.questions.length * 100);
    document.getElementById("resultMessage").textContent = `You scored ${percent}% in ${activeTopic.name}. Keep practising to improve your result.`;
    document.getElementById("quizProgressBar").style.width = "100%";
  }

  nextBtn.addEventListener("click", () => {
    if (!answered) return;
    if (questionIndex < activeTopic.questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
    } else {
      showResult();
    }
  });
  document.getElementById("restartBtn").addEventListener("click", () => startTopic(activeTopic));
  document.getElementById("retryBtn").addEventListener("click", () => startTopic(activeTopic));

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

  renderStats();
  renderTopics();
});
