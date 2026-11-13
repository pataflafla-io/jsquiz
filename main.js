// main.js — UI layer: rendering, timer and event wiring.
// It reads state from game.js and plays sounds from audio.js,
// but never edits question data or game rules.

const ELEMENTS = {
  screenStart: document.getElementById('screen-start'),
  screenGame: document.getElementById('screen-game'),
  screenEnd: document.getElementById('screen-end'),
  hudQuestion: document.getElementById('hud-question'),
  hudScore: document.getElementById('hud-score'),
  timerBar: document.getElementById('timer-bar'),
  questionText: document.getElementById('question-text'),
  options: document.getElementById('options'),
  explanation: document.getElementById('explanation'),
  finalScore: document.getElementById('final-score'),
  finalMessage: document.getElementById('final-message'),
  btnStart: document.getElementById('btn-start'),
  btnRestart: document.getElementById('btn-restart'),
  btnSfx: document.getElementById('btn-sfx'),
  btnMusic: document.getElementById('btn-music'),
};

function showScreen(screen) {
  document.querySelectorAll('.screen').forEach((section) => (section.hidden = true));
  screen.hidden = false;
}

function renderHud() {
  ELEMENTS.hudQuestion.textContent = `PREGUNTA ${game.index + 1}/${QUESTIONS.length}`;
  ELEMENTS.hudScore.textContent = `PUNTOS: ${game.score}`;
}

// Timer colors go from green (plenty of time) to red (almost none) by turning
// the remaining seconds into a hue: 120° is green, 0° is red.
function renderTimer() {
  const fraction = Math.max(game.secondsLeft, 0) / TIME_PER_QUESTION;
  ELEMENTS.timerBar.style.width = `${fraction * 100}%`;
  ELEMENTS.timerBar.style.background = `hsl(${Math.round(fraction * 120)} 90% 55%)`;
}

function startTimer() {
  game.answered = false; // a new question accepts clicks again
  game.secondsLeft = TIME_PER_QUESTION;
  renderTimer();
  clearInterval(game.timer);
  game.timer = setInterval(() => {
    game.secondsLeft--;
    renderTimer();
    // Urgency cue during the final seconds.
    if (game.secondsLeft > 0 && game.secondsLeft <= 5) sfxTick();
    // Running out of time counts as an incorrect answer.
    if (game.secondsLeft <= 0) registerAnswer(-1);
  }, 1000);
}

function renderQuestion() {
  const question = QUESTIONS[game.index];
  renderHud();
  ELEMENTS.questionText.textContent = question.text;
  ELEMENTS.options.textContent = '';
  ELEMENTS.explanation.hidden = true;
  ELEMENTS.explanation.textContent = '';

  question.options.forEach((text, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.textContent = text;
    button.addEventListener('click', () => registerAnswer(index));
    ELEMENTS.options.appendChild(button);
  });

  startTimer();
}

function registerAnswer(selectedIndex) {
  // Ignore extra clicks once the question is answered (double-click guard).
  if (game.answered) return;
  game.answered = true;
  clearInterval(game.timer);

  const question = QUESTIONS[game.index];
  const isCorrect = selectedIndex === question.correctIndex;
  if (isCorrect) game.score++;
  renderHud();

  // Mark the right answer green and, if missed, the chosen one red.
  Array.from(ELEMENTS.options.children).forEach((button, index) => {
    button.disabled = true;
    if (index === question.correctIndex) button.classList.add('correct');
    else if (index === selectedIndex) button.classList.add('incorrect');
  });

  ELEMENTS.explanation.hidden = false;
  ELEMENTS.explanation.textContent = `${isCorrect ? '✔' : '✖'} ${question.explanation}`;
  ELEMENTS.explanation.classList.toggle('correct', isCorrect);
  ELEMENTS.explanation.classList.toggle('incorrect', !isCorrect);

  if (isCorrect) sfxCorrect();
  else sfxWrong();

  // Brief pause so the player can read the explanation before advancing.
  setTimeout(advance, 5000);
}

function advance() {
  game.index++;
  if (game.index >= QUESTIONS.length) renderEnd();
  else renderQuestion();
}

function messageForScore(score) {
  if (score === QUESTIONS.length) return '¡PERFECTO! ERES UNA LEYENDA DEL EVENT LOOP';
  if (score >= 15) return '¡INCREÍBLE! NIVEL SENIOR JS';
  if (score >= 10) return '¡BIEN! NIVEL MID-LEVEL';
  if (score >= 5) return 'NO ESTÁ MAL... SIGUE PRACTICANDO';
  return 'GG WP... INTÉNTALO OTRA VEZ';
}

function renderEnd() {
  showScreen(ELEMENTS.screenEnd);
  ELEMENTS.finalScore.textContent = `${game.score} / ${QUESTIONS.length}`;
  ELEMENTS.finalMessage.textContent = messageForScore(game.score);
  sfxVictory();
}

function startGame() {
  resetGame();
  showScreen(ELEMENTS.screenGame);
  renderQuestion();
}

// --- Events -----------------------------------------------------------------
ELEMENTS.btnStart.addEventListener('click', () => {
  sfxClick();
  startGame();
});

ELEMENTS.btnRestart.addEventListener('click', () => {
  sfxClick();
  startGame();
});

ELEMENTS.btnSfx.addEventListener('click', () => {
  const enabled = toggleSfx();
  ELEMENTS.btnSfx.textContent = enabled ? 'SFX: ON' : 'SFX: OFF';
  ELEMENTS.btnSfx.setAttribute('aria-pressed', String(enabled));
});

ELEMENTS.btnMusic.addEventListener('click', () => {
  const enabled = toggleMusic();
  ELEMENTS.btnMusic.textContent = enabled ? '♪: ON' : '♪: OFF';
  ELEMENTS.btnMusic.setAttribute('aria-pressed', String(enabled));
});

// Show the start screen and unlock audio on the very first interaction.
showScreen(ELEMENTS.screenStart);
document.addEventListener('pointerdown', initAudio, { once: true });
