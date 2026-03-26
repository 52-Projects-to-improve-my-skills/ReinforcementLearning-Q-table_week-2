# 🤖 Aprendizaje por Refuerzo con Q-Table

**Leer en [English](README.md)**

## 📌 Resumen Ejecutivo

Aplicación web interactiva que implementa un agente Q-Learning para navegar un tablero 2D. Demuestra la ecuación de Bellman, el balance exploración-explotación y la separación entre algoritmo de aprendizaje y visualización.

Parte: Desafío 52 Proyectos — Semana 2

---

## 🚀 Inicio rápido (5 minutos)

1. Clona el repositorio y abre `index.html` en un navegador moderno (no requiere build).
2. Importante: el tablero inicia bloqueado (todas las celdas son muros). En la UI izquierda pulsa `Pintar Path` para seleccionar modo pintar y luego haz click+arrastra en el tablero para crear celdas transitables (PATH) entre inicio y meta.
3. Ajusta `Epsilon (ε)` y `Delay` en la UI; pulsa `Iniciar IA` para comenzar el entrenamiento.
4. Usa `Guardar Q-Table` para descargar `qtable.json` y `Cargar Q-Table` para restaurar una tabla guardada.

Resultado esperado: tras ~50–100 episodios los pasos por episodio deberían disminuir.

---

## 📚 Conceptos fundamentales (breve)

- Aprendizaje por refuerzo: el agente aprende una política interactuando con un entorno y recibiendo recompensas.
- Componentes:
  - Agente: controlador que usa la Q-Table.
  - Entorno: tablero 5×10 con inicio y meta.
  - Acciones: Arriba / Abajo / Izquierda / Derecha (ver `game/configs/Configs.js`).
  - Recompensas: +20 (meta), -1 (paso), -10 (muerte/golpe a muro).

---

## 🧠 Q-Learning (Teoría y práctica)

Actualización Bellman (núcleo):

$$Q(s,a) \leftarrow Q(s,a) + \alpha \left[r + \gamma \max_{a'} Q(s',a') - Q(s,a)\right]$$

Versión plana: Q_nueva = Q + alpha * (recompensa + gamma * max(nextQ) - Q)

La exploración está controlada por la propiedad `q.epsilon` de la instancia.

---

## 🏗️ Arquitectura (breve)

- Entrada: `index.html`
- Orquestador: `game/BoardOrquestator.js`
- Algoritmo: `agent/Qtable.js`
- Controlador AI: `game/AIController.js` (bucle, guardar/cargar)
- Render: `game/BoardRender.js`, `game/ChartRenderer.js`
- Configs: `game/configs/Configs.js`

Flujo: UI → BoardOrquestator → AIController → Qtable → estado tablero → Renderer/Chart

---

## 🎮 Guía de usuario (controles y edición)

- Selección de modo de edición mediante botones GUI:
  - `Pintar Path` (`btn-draw`) — seleccionar modo pintar.
  - `Borrar Path` (`btn-erase`) — seleccionar modo borrar.
  - Tras elegir la herramienta, usa click+arrastra en el canvas para pintar o borrar celdas.
- Iniciar/Detener: `Iniciar IA` (`btn-start-ai`) — mismo botón alterna estado.
- Guardar/Cargar Q-Table: `Guardar Q-Table` (`btn-save`) / `Cargar Q-Table` (`btn-load`).
- `input-epsilon` permite ajustar epsilon en caliente.

Nota: el tablero inicia con muros; pinta al menos un camino desde inicio a meta antes de entrenar para ver aprendizaje.

---

## 🔧 API (firmas reales)

- Constructor Qtable:
```javascript
new Qtable(boardWidth, boardHeight, actionsCount)
```
Ejemplo:
```javascript
const q = new Qtable(5, 10, ACTIONS.length); // ACTIONS.length === 4
q.epsilon = 0.1;
```

- chooseAction:
```javascript
q.chooseAction(stateX, stateY) // retorna índice 0..actionsCount-1
```

- learn:
```javascript
q.learn({x, y}, actionIndex, reward, nextState)
```

Funciones guardar/cargar en `AIController`:
- `aiCtrl.saveQTable()` descarga `qtable.json`
- `aiCtrl.loadQTable(file)` carga JSON (Promise)

---

## ❓ Solución de problemas (puntos clave)

- Si el agente muere de inmediato: el tablero no tiene celdas PATH. Pinta un camino desde inicio hasta meta.
- Si no mejora:
  - Revisar `q.epsilon` (no 1.0), `alpha > 0` y signos de recompensas.
  - Resetear Q-Table y probar con epsilon más bajo.
- Guardar/Cargar: usa el botón `Guardar Q-Table` del UI para generar JSON compatible.

---

## 🎓 Autor & Licencia

- Carlos Enrique Cochero Ramos — GitHub: @caertos  
- Licencia: MIT (`LICENSE`)

---

## 🔗 Recursos

- Sutton & Barto — Reinforcement Learning: An Introduction  
- Watkins & Dayan (Q-Learning)  
- Canvas API (MDN)
