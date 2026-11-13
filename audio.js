// audio.js — 8-bit sound effects and background music, synthesized at runtime
// with the Web Audio API so the project ships without any audio files.

const audio = {
  // Sound effects are ON by default; music starts OFF so the game is silent
  // until the player opts in (browsers also block autoplay without a gesture).
  sfxEnabled: true,
  musicEnabled: false,
  context: null,
  musicTimer: null,
  musicStep: 0,
};

// Browsers only allow audio after a user gesture, so the context is created
// lazily on the first click instead of on page load.
function initAudio() {
  if (!audio.context) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audio.context = new Ctx();
  }
  if (audio.context.state === 'suspended') audio.context.resume();
}

// One enveloped blip: the core of every chip-tune sound. `delay` lets us
// schedule several notes in sequence without timers.
function playTone(frequency, duration = 0.12, type = 'square', volume = 0.12, delay = 0) {
  if (!audio.context) return;
  const time = audio.context.currentTime + delay;
  const oscillator = audio.context.createOscillator();
  const gain = audio.context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  oscillator.connect(gain).connect(audio.context.destination);
  oscillator.start(time);
  oscillator.stop(time + duration);
}

// UI click: short double blip.
function sfxClick() {
  if (!audio.sfxEnabled) return;
  playTone(660, 0.06, 'square', 0.08);
  playTone(880, 0.06, 'square', 0.08, 0.06);
}

// Right answer: ascending major arpeggio.
function sfxCorrect() {
  if (!audio.sfxEnabled) return;
  [523.25, 659.25, 783.99].forEach((f, i) => playTone(f, 0.12, 'square', 0.1, i * 0.09));
}

// Wrong answer: descending sawtooth buzz.
function sfxWrong() {
  if (!audio.sfxEnabled) return;
  playTone(196, 0.2, 'sawtooth', 0.1);
  playTone(130.81, 0.25, 'sawtooth', 0.1, 0.15);
}

// Urgent tick for the last seconds of the timer.
function sfxTick() {
  if (!audio.sfxEnabled) return;
  playTone(1200, 0.03, 'square', 0.05);
}

// Little fanfare for the results screen.
function sfxVictory() {
  if (!audio.sfxEnabled) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => playTone(f, 0.15, 'square', 0.1, i * 0.12));
}

// --- Background music -------------------------------------------------------
// A four-chord synthwave loop (Am - F - C - G) played as 8-bit arpeggios,
// which evokes the 80s Miami vibe of the visual theme.
const CHORDS = [
  { bass: 110.0, notes: [220.0, 261.63, 329.63] },   // A minor
  { bass: 87.31, notes: [174.61, 220.0, 261.63] },   // F major
  { bass: 130.81, notes: [261.63, 329.63, 392.0] },  // C major
  { bass: 98.0, notes: [196.0, 246.94, 293.66] },    // G major
];
const STEPS_PER_CHORD = 8;
const STEP_DURATION = 0.16; // seconds per arpeggio step (~95 BPM)

function playMusicStep() {
  if (!audio.musicEnabled || !audio.context) return;
  const chord = CHORDS[Math.floor(audio.musicStep / STEPS_PER_CHORD) % CHORDS.length];
  const stepIndex = audio.musicStep % STEPS_PER_CHORD;
  // Bass note only on the first step of each chord, like an 8-bit bassline.
  if (stepIndex === 0) {
    playTone(chord.bass, STEP_DURATION * STEPS_PER_CHORD * 0.9, 'triangle', 0.09);
  }
  // Arpeggio walks root-third-fifth-third, the classic synthwave figure.
  const pattern = [0, 1, 2, 1];
  playTone(chord.notes[pattern[stepIndex % pattern.length]], STEP_DURATION * 0.8, 'square', 0.045);
  audio.musicStep++;
}

function startMusic() {
  stopMusic(); // clear any previous loop before starting a new one
  audio.musicStep = 0;
  audio.musicTimer = setInterval(playMusicStep, STEP_DURATION * 1000);
}

function stopMusic() {
  clearInterval(audio.musicTimer);
  audio.musicTimer = null;
}

// Toggle switches; each returns the new state so the UI can update its label.
function toggleSfx() {
  audio.sfxEnabled = !audio.sfxEnabled;
  if (audio.sfxEnabled) {
    initAudio();
    sfxClick(); // confirmation blip when switching back on
  }
  return audio.sfxEnabled;
}

function toggleMusic() {
  audio.musicEnabled = !audio.musicEnabled;
  if (audio.musicEnabled) {
    initAudio();
    startMusic();
  } else {
    stopMusic();
  }
  return audio.musicEnabled;
}
