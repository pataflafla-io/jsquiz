// game.js — game data and state.
// The QUESTIONS array is the single source of truth for questions:
// text, options, index of the correct answer and a short explanation.

// Seconds available to answer each question before it counts as a miss.
const TIME_PER_QUESTION = 20;

// Questions ordered from easiest (variables and types) to hardest
// (promises and the event loop), so the challenge ramps up naturally.
const QUESTIONS = [
  {
    text: '¿Qué devuelve typeof "hola"?',
    options: ['"string"', '"text"', '"String"', '"char"'],
    correctIndex: 0,
    explanation: 'typeof devuelve una cadena en minúsculas; para cualquier string es "string".',
  },
  {
    text: '¿Qué palabra clave declara una variable que no puede reasignarse?',
    options: ['var', 'let', 'const', 'static'],
    correctIndex: 2,
    explanation: 'const crea una referencia de solo lectura: no se puede reasignar, aunque su contenido sí puede mutar.',
  },
  {
    text: '¿Qué imprime console.log(1 + "1")?',
    options: ['2', '"11"', '11', 'TypeError'],
    correctIndex: 1,
    explanation: 'El operador + con un string concatena: el número 1 se convierte en "1" y une ambos strings.',
  },
  {
    text: '¿Cuál de estos valores es falsy?',
    options: ['"0"', '""', '[]', '"1"'],
    correctIndex: 1,
    explanation: 'El string vacío "" es falsy. Ojo: "0" y [] son truthy en JS, a diferencia de otros lenguajes.',
  },
  {
    text: 'let x = 10; { let x = 20; } console.log(x); ¿Qué imprime?',
    options: ['20', '10', 'undefined', 'ReferenceError'],
    correctIndex: 1,
    explanation: 'let tiene ámbito de bloque: el segundo x solo existe dentro de las llaves y no afecta al exterior.',
  },
  {
    text: '¿Qué imprime console.log("5" - 2)?',
    options: ['"52"', '3', '"3"', 'NaN'],
    correctIndex: 1,
    explanation: 'El operador - no existe para strings, así que JS convierte "5" a número: 5 - 2 = 3.',
  },
  {
    text: '¿Qué devuelve null == undefined?',
    options: ['true', 'false', 'TypeError', 'undefined'],
    correctIndex: 0,
    explanation: 'Con == (igualdad débil) son equivalentes. Con === serían distintos porque tienen tipos diferentes.',
  },
  {
    text: '¿Qué devuelve typeof null?',
    options: ['"null"', '"object"', '"undefined"', 'Error'],
    correctIndex: 1,
    explanation: 'Es un bug histórico de JS que nunca se corrigió por compatibilidad: null se reporta como "object".',
  },
  {
    text: '¿Qué devuelve NaN === NaN?',
    options: ['true', 'false', 'undefined', 'Depende del navegador'],
    correctIndex: 1,
    explanation: 'NaN es el único valor que no es igual a sí mismo. Para detectarlo usa Number.isNaN().',
  },
  {
    text: '¿Qué devuelve typeof NaN?',
    options: ['"NaN"', '"undefined"', '"number"', '"object"'],
    correctIndex: 2,
    explanation: 'A pesar de su nombre (Not a Number), NaN es de tipo number: es un resultado numérico inválido.',
  },
  {
    text: 'console.log(a); var a = 5; ¿Qué imprime?',
    options: ['5', 'undefined', 'ReferenceError', 'null'],
    correctIndex: 1,
    explanation: 'Las declaraciones con var se elevan (hoisting) pero sin su valor inicial, por eso imprime undefined.',
  },
  {
    text: '¿Qué imprime console.log([1, 2] + [3, 4])?',
    options: ['[1,2,3,4]', '"1,23,4"', '"1234"', 'NaN'],
    correctIndex: 1,
    explanation: 'El + convierte cada array en string: "1,2" + "3,4" = "1,23,4".',
  },
  {
    text: '¿Qué devuelve 0.1 + 0.2 === 0.3?',
    options: ['true', 'false', 'NaN', 'TypeError'],
    correctIndex: 1,
    explanation: 'JS usa floats IEEE 754: 0.1 + 0.2 = 0.30000000000000004. Compara con una tolerancia pequeña.',
  },
  {
    text: 'function crearContador() { let n = 0; return () => ++n; } const c = crearContador(); c(); c(); ¿Qué devuelve la segunda llamada?',
    options: ['0', '1', '2', 'undefined'],
    correctIndex: 2,
    explanation: 'Es un closure: la función interna recuerda n entre llamadas. La primera devuelve 1, la segunda 2.',
  },
  {
    text: 'const fns = []; for (var i = 0; i < 3; i++) fns.push(() => i); fns[0](); ¿Qué devuelve?',
    options: ['0', '2', '3', 'undefined'],
    correctIndex: 2,
    explanation: 'var no tiene ámbito de bloque: las 3 funciones comparten el mismo i, que al terminar vale 3. Con let devolvería 0.',
  },
  {
    text: '¿Qué imprime console.log([] == false)?',
    options: ['true', 'false', 'TypeError', 'NaN'],
    correctIndex: 0,
    explanation: '[] se convierte en "" y "" en 0; false también equivale a 0 con ==. Por eso el resultado es true.',
  },
  {
    text: 'Promise.resolve(2).then(v => v * 2).then(v => console.log(v)); ¿Qué imprime?',
    options: ['2', '4', 'NaN', 'Promise { 4 }'],
    correctIndex: 1,
    explanation: 'Cada then encadena el valor del anterior: 2 → 4. Si devuelves una promesa, se espera su resultado.',
  },
  {
    text: 'console.log("a"); setTimeout(() => console.log("b"), 0); Promise.resolve().then(() => console.log("c")); console.log("d"); ¿Orden de salida?',
    options: ['a b c d', 'a d c b', 'a d b c', 'a c d b'],
    correctIndex: 1,
    explanation: 'El código síncrono va primero (a, d). Las promesas son microtasks (c) y se ejecutan antes que los timers (b).',
  },
  {
    text: 'async function f() { return 1; } f().then(v => console.log(v)); ¿Qué imprime?',
    options: ['1', 'Promise { 1 }', 'undefined', 'Error'],
    correctIndex: 0,
    explanation: 'Toda función async envuelve su return en una promesa resuelta, por eso el then recibe el valor 1.',
  },
  {
    text: 'setTimeout(() => console.log("t"), 0); Promise.resolve().then(() => { Promise.resolve().then(() => console.log("p1")).then(() => console.log("p2")); }); ¿Orden?',
    options: ['t p1 p2', 'p1 t p2', 'p1 p2 t', 't p2 p1'],
    correctIndex: 2,
    explanation: 'Los .then anidados son microtasks que se encolan entre sí: p1 y p2 terminan antes de ceder el turno al timer t.',
  },
];

// One mutable object so restarting the game is just resetting its fields.
const game = {
  index: 0,
  score: 0,
  // Prevents double clicks: once answered, extra clicks are ignored.
  answered: false,
  timer: null,
  secondsLeft: TIME_PER_QUESTION,
};

// Reset the state for a fresh run (used by the start and restart buttons).
function resetGame() {
  game.index = 0;
  game.score = 0;
  game.answered = false;
  game.secondsLeft = TIME_PER_QUESTION;
  clearInterval(game.timer);
}
