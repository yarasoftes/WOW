const game = {
  level: 1,
  wordIndex: 0,
  score: 0,
  word: "",
  selected: "",
  hintUsed: false,

  start() {
    if (this.level > CONFIG.maxLevels) {
      document.getElementById("game").classList.add("hidden");
      document.getElementById("win").classList.remove("hidden");
      document.getElementById("final-score").textContent = this.score;
      return;
    }
    this.wordIndex = 0;
    this.loadWord();
  },

  loadWord() {
    const levelWords = LEVELS[this.level - 1];

    if (!levelWords || this.wordIndex >= levelWords.length) {
      this.level++;
      this.wordIndex = 0;
      this.loadWord();
      return;
    }

    this.word = levelWords[this.wordIndex];
    this.selected = "";
    this.hintUsed = false;

    document.getElementById("level").textContent = this.level;
    document.getElementById("wordNum").textContent = `${this.wordIndex + 1}/${CONFIG.wordsPerLevel}`;
    document.getElementById("score").textContent = this.score;
    document.getElementById("current-word").textContent = "";

    this.renderLetters();
  },

  renderLetters() {
    const circle = document.getElementById("circle");
    circle.innerHTML = '<svg id="lineSvg"></svg>';

    const letters = shuffle(this.word);
    const radius = 90;
    const center = 110;

    letters.forEach((l, i) => {
      const angle = (2 * Math.PI / letters.length) * i;
      const x = center + radius * Math.cos(angle) - 23;
      const y = center + radius * Math.sin(angle) - 23;

      const el = document.createElement("div");
      el.className = "letter";
      el.textContent = l;
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.dataset.letter = l;
      el.dataset.index = i;

      circle.appendChild(el);
    });
  },

  addLetter(letter, el) {
    this.selected += letter;
    document.getElementById("current-word").textContent = this.selected;
    el.classList.add("active");
    this.drawLine();
  },

  clearSelection() {
    this.selected = "";
    document.getElementById("current-word").textContent = "";
    document.querySelectorAll(".letter").forEach(l => l.classList.remove("active"));
    this.drawLine();
  },

  check() {
    const wordEl = document.getElementById("current-word");

    if (this.selected === this.word) {
      this.score += this.hintUsed ? (CONFIG.pointsPerWord - CONFIG.hintPenalty) : CONFIG.pointsPerWord;
      this.wordIndex++;
      this.loadWord();
    } else {
      wordEl.classList.add("shake");
      setTimeout(() => wordEl.classList.remove("shake"), 300);
      this.clearSelection();
    }
  },

  hint() {
    if (this.hintUsed) return;
    this.hintUsed = true;

    this.selected = this.word[0];
    document.getElementById("current-word").textContent = this.selected;

    document.querySelectorAll(".letter").forEach(l => {
      if (l.dataset.letter === this.word[0]) {
        l.classList.add("active");
      }
    });

    this.drawLine();
  },

  drawLine() {
    const svg = document.getElementById("lineSvg");
    svg.innerHTML = "";

    const active = [...document.querySelectorAll(".letter.active")];

    if (active.length < 2) return;

    const points = active.map(el => {
      const rect = el.getBoundingClientRect();
      const parentRect = document.getElementById("circle").getBoundingClientRect();
      const x = rect.left - parentRect.left + rect.width / 2;
      const y = rect.top - parentRect.top + rect.height / 2;
      return `${x},${y}`;
    }).join(" ");

    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    poly.setAttribute("points", points);
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "rgba(30,120,50,0.8)");
    poly.setAttribute("stroke-width", "6");
    poly.setAttribute("stroke-linecap", "round");
    poly.setAttribute("stroke-linejoin", "round");
    svg.appendChild(poly);
  }
};

game.start();
