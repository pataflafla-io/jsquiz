# JSQuiz

## Descripción del proyecto

Juego tipo Quiz con 20 preguntas de JavaScript que suben de dificultad a medida que avanza el usuario.
Cada pregunta tiene 4 opciones, una respuesta correcta y una explicación corta que se muestra tras responder.


### Características principales
- 20 preguntas con dificultad creciente (variables → tipos → promesas → event loop).
- 4 opciones por pregunta con botones reales (`<button>`).
- Temporizador de 20 segundos por pregunta con cambio de color progresivo: verde → verde amarillento → amarillo → naranja → rojo.
- Barra de progreso visual que avanza con cada pregunta.
- Retroalimentación inmediata: respuesta correcta en verde, incorrecta en rojo.
- Explicación corta debajo de las opciones tras cada respuesta.
- Pantalla final con puntuación y botón para volver a empezar.
- HTML semántico y CSS puro (sin librerías ni frameworks).
- La interfaz web usa un diseño retro de 8 bits, con fuentes pixeladas, inspirate en GTA VI Color Palette.
- Incluye audio de 8 bits, con un botón de encendido/apagado
- Incluye música de fondo en 8 bits, con switch de encendido/apagado


## Estructura de archivos

```
jsquiz/
├── index.html    # Estructura semántica: pantallas de inicio, juego y final
├── styles.css    # Estilos retro 80's (sin frameworks)
├── game.js       # Lógica del juego: preguntas, puntuación, estado
├── audio.js      # SFX y música 8-bit sintetizados con Web Audio API
├── main.js       # Lógica de UI: renderizado, temporizador, eventos
└── AGENTS.md     # Este archivo
```

## Reglas del proyecto

- Usa solo HTML, CSS y JavaScript vanilla.
- Usa etiquetas como `<header>`, `<main>`, `<section>`, `<form>`, `<button type="button">`, etc.
- Las opciones de respuesta deben ser elementos `<button>`, no `<div>` o `<span>` con eventos simulados.
- Comenta el código en inglés explicando el porqué, no el qué.
- Si un cambio toca más de un archivo, explica el plan y espera mi confirmación.
- Incluye un temporizador de 20 segundos. Si se agota el tiempo, se cuenta como respuesta incorrecta y se avanza automáticamente.
- Evita el doble clic. Una vez respondida una pregunta, los botones se deshabilitan y se ignora cualquier clic adicional (`game.answered`).
- No modifiques la estructura de preguntas sin actualizar `game.js`. El array `QUESTIONS` define texto, opciones, índice correcto (`correctIndex`) y explicación.
- Muesta Una pregunta a la vez en pantalla. Al responder se avanza automáticamente tras 5 segundos.


## Cómo probar el proyecto

1. Abre una terminal en la carpeta del proyecto:
   ```bash
   cd <PATH_WHERE_YOU_>/jsquiz
   ```

2. Sirve los archivos (opcional, recomendado):
   ```bash
   npx serve .
   ```

3. Abre el navegador en:
   ```
   http://localhost:3000
   ```

   O simplemente haz doble clic en `index.html` para abrirlo directamente.

## Flujo de ejecución

1. `index.html` carga `game.js` y luego `main.js`.
2. `main.js` inicializa mostrando la pantalla de inicio.
3. Al hacer clic en "Empezar juego", `startGame()` reinicia el estado y renderiza la primera pregunta.
4. `main.js` inicia el temporizador de 20 segundos y renderiza las opciones.
5. Al seleccionar una opción (o agotarse el tiempo), se registra la respuesta, se deshabilitan los botones y se muestra la explicación.
6. Tras 5 segundos, se avanza a la siguiente pregunta o se muestra la pantalla final si se acabaron las 10 preguntas.
