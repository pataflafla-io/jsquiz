# JSQuiz


Un quiz de JavaScript con estética retro de 8 bits y paleta *80s Miami Vice Pastel* (fucsia, turquesa, menta, violeta y lima sobre ciruela oscuro), construido 100 % con HTML, CSS y JavaScript vanilla. Sin frameworks, sin librerías, sin build: se abre y juega.

## ¿Qué es?

Un juego tipo quiz de **20 preguntas de JavaScript** ordenadas por dificultad creciente, de lo más básico a lo más traicionero del lenguaje:

1. **Variables y ámbito** — `const`, `let`, ámbito de bloque.
2. **Tipos y coerción** — `typeof`, valores falsy, `NaN`, comparación débil (`==`) vs estricta (`===`), aritmética con strings y arrays, IEEE 754.
3. **Closures y hoisting** — funciones que recuerdan su entorno, `var` en bucles.
4. **Promesas y event loop** — encadenamiento de `.then()`, microtasks vs macrotasks, orden de ejecución real.

Cada pregunta tiene 4 opciones y una explicación corta que aparece al responder, con feedback inmediato: la opción correcta en verde, la elegida incorrecta en rojo.

### Mecánica

- **Una pregunta a la vez** en pantalla; al responder avanza automáticamente a los 5 segundos.
- **Temporizador de 20 segundos** con barra de color progresivo (verde → amarillento → amarillo → naranja → rojo, calculado convirtiendo los segundos restantes en un hue HSL de 120° a 0°). Si el tiempo se agota, cuenta como fallo y avanza.
- **Guardia anti doble clic**: al responder se deshabilitan los botones y se ignora cualquier clic adicional.
- **Pantalla final** con puntuación sobre 20 y un mensaje según el resultado (de "GG WP..." a "¡PERFECTO! ERES UNA LEYENDA DEL EVENT LOOP").

### Diseño retro

- Tipografía pixelada ***Press Start 2P*** en toda la interfaz.
- Sombras duras sin blur y botones con efecto "presionado", como en los cartuchos de la época.
- HTML semántico: `header`, `main`, `section`, `footer` y opciones como `<button>` reales, nunca `div` con eventos simulados.

### Audio 8 bits

Todo el sonido se **sintetiza en runtime con Web Audio API** — el proyecto no incluye un solo archivo de audio:

- **Efectos**: clic de UI, arpegio ascendente al acertar, buzz de sierra al fallar, tic de urgencia en los últimos 5 segundos y fanfarria en la pantalla final.
- **Música de fondo**: loop synthwave de 4 acordes (Am–F–C–G) con arpegios square y bajo triangle, evocando el vibe Miami de los 80.
- Cada sonido tiene su **botón/switch de encendido y apagado** en la cabecera.

## Motivación

Este proyecto es un banco de pruebas pequeño pero real para tres cosas:

- **Probar el arnés PI** — cómo un agente de código construye un proyecto completo desde cero: estructura, lógica, estilo, verificación y refactor, siguiendo instrucciones y respetando el alcance de cada petición.
- **Experimentar con `AGENTS.md`** — el archivo actúa como contrato con el agente: reglas de arquitectura (datos en `game.js`, UI en `main.js`), de comportamiento (plan antes de cambios multiarchivo, guardia anti doble clic) y de estilo (comentarios en inglés explicando el porqué). Todo lo que el agente implementó sale de ese contrato.
- **Probar el skill `frontend-design`** — dirección estética intencional (paleta Miami Vice, tipografía pixel, jerarquía visual) en lugar de un template genérico.

## Stack

| Capa | Herramienta |
|---|---|
| Markup | HTML semántico (`header`, `main`, `section`, `button`) |
| Estilos | CSS puro, fuente *Press Start 2P*, sin frameworks ni librerías |
| Lógica | JavaScript vanilla (ES6+), estado mutable en un solo objeto |
| Audio | Web Audio API (osciladores square / triangle / sawtooth) |
| Servidor | `npx serve` (opcional; también funciona abriendo el archivo) |

## Estructura

```text
jsquiz/
├── index.html    # Estructura semántica: pantallas de inicio, juego y final
├── styles.css    # Estilos retro 8-bit (paleta Miami Vice pastel)
├── game.js       # Datos y estado: QUESTIONS, puntuación, temporizador
├── audio.js      # SFX y música 8-bit sintetizados con Web Audio API
├── main.js       # Lógica de UI: renderizado, temporizador, eventos
├── AGENTS.md     # Contrato de reglas para el agente
└── README.md     # Este archivo
```

Separación de responsabilidades: `game.js` es la única fuente de verdad de las preguntas (`QUESTIONS` define `text`, `options`, `correctIndex` y `explanation`); `main.js` solo renderiza y gestiona el temporizador; `audio.js` encapsula todo el sonido.

## Cómo probarlo

```bash
cd jsquiz
npx serve .
```

Abre el navegador en `http://localhost:3000`, o simplemente haz doble clic en `index.html`.

> Nota: la música arranca apagada porque los navegadores bloquean el autoplay; actívala con el switch `♪: OFF → ON`.

## Reglas rápidas

| Regla | Detalle |
|---|---|
| Tiempo | 20 s por pregunta |
| Tiempo agotado | Cuenta como respuesta incorrecta |
| Doble clic | Ignorado: una vez respondido, los botones se deshabilitan |
| Ritmo | Avance automático 5 s después de responder |
