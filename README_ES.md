# 🤖 Aprendizaje por Refuerzo con Q-Table

**Leer en [English](README.md)**

---

## 📌 Resumen Ejecutivo

Una **aplicación web interactiva** que implementa un agente de Aprendizaje por Refuerzo (Reinforcement Learning) usando el algoritmo **Q-Learning** para navegar autónomamente un tablero 2D. El agente comienza sin conocimiento y aprende gradualmente caminos óptimos mediante prueba y error, actualizando una Q-Table basada en recompensas y penalidades.

**Contexto Académico**: Este proyecto demuestra la implementación práctica de conceptos fundamentales de RL incluyendo la ecuación de Bellman, el balance exploración-explotación, y la separación de responsabilidades entre el algoritmo de aprendizaje y la capa de visualización.

**Parte de**: Desafío 52 Proyectos - Semana 2

---

## 🚀 Inicio Rápido (5 Minutos)

### Paso 1: Abrir en Navegador
1. Clona o descarga este repositorio
2. Abre `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge)
3. No requiere herramientas de compilación ni instalación ✨

### Paso 2: Observa Estado Inicial
```
┌─────────────────────────────────────────┐
│  Posición del Agente:  (2, 9) [Tile Verde]  │
│  Posición de Meta:     (2, 0) [Tile Amarillo]│
│  Tamaño del Tablero:   5 cols × 10 filas   │
│  Q-Table:             Vacía (0s)          │
└─────────────────────────────────────────┘
```

### Paso 3: Inicia Entrenamiento
- Haz clic en el botón **"Iniciar Entrenamiento"**
- Observa al agente moviéndose aleatoriamente (fase de exploración)
- Monitorea el **Gráfico de Rendimiento** actualizándose en tiempo real
- Después de ~50-100 episodios, verás al agente encontrando mejores caminos

### Paso 4: Interactúa (Opcional)
- **Dibuja muros**: Click+arrastra en el tablero con el ratón
- **Borra muros**: Click derecho+arrastra para limpiar
- **Ajusta epsilon** (exploración): Ingresa valor 0-1 (mayor = más aleatorio)
- **Ajusta velocidad**: Controla la rapidez del movimiento del agente

### Resultado Esperado Después de 100 Episodios
```
El gráfico muestra:
├─ Línea azul (pasos/episodio) bajando de ~30 a ~5-7
└─ Línea naranja (promedio móvil) mostrando tendencia descendente → ¡éxito en aprendizaje!
```

---

## 📚 Conceptos Fundamentales: Aprendizaje por Refuerzo 101

### ¿Qué es el Aprendizaje por Refuerzo?

**Definición**: Paradigma de aprendizaje automático donde un **agente** aprende a maximizar recompensas acumuladas interactuando con un **entorno** mediante prueba y error, sin ser explícitamente programado.

**Componentes Clave**:

| Componente | Definición | En Este Proyecto |
|-----------|-----------|-----------------|
| **Agente** | Entidad que aprende | Nuestro controlador IA navegando el tablero |
| **Entorno** | Sistema con el que interactúa el agente | El tablero 2D con muros y meta |
| **Estado (s)** | Situación actual | Posición del agente (x, y) |
| **Acción (a)** | Elección disponible | Movimiento: Arriba, Abajo, Izquierda, Derecha |
| **Recompensa (r)** | Señal de retroalimentación | +20 (meta), -1 (paso), -10 (muro) |
| **Política (π)** | Regla de decisión | Mecanismo para elegir acciones |

### Cómo RL Difiere de Otros Paradigmas de ML

```
┌──────────────────────────────────────────────────────────┐
│  COMPARACIÓN DE PARADIGMAS DE APRENDIZAJE                │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  🔵 Aprendizaje SUPERVISADO                             │
│     Entrada: Datos de entrenamiento con etiquetas       │
│     Objetivo: Aprender mapeo f(x) → y                  │
│     Ejemplo: Clasificación de imágenes, detección spam  │
│                                                           │
│  🟣 Aprendizaje NO SUPERVISADO                          │
│     Entrada: Datos sin etiquetar                         │
│     Objetivo: Encontrar patrones/clusters ocultos       │
│     Ejemplo: Segmentación de clientes, compresión       │
│                                                           │
│  🟢 Aprendizaje por REFUERZO (Este Proyecto)            │
│     Entrada: Secuencia de estados, acciones, recompensas│
│     Objetivo: Aprender política para maximizar recompensa│
│     Ejemplo: IA de juegos, robótica, navegación         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🧠 Q-Learning: La Teoría Detrás del Código

### La Ecuación de Bellman (Fórmula Central)

El corazón de Q-Learning es la **Ecuación de Optimalidad de Bellman**:

$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$

**Desglosándolo**:

| Símbolo | Nombre | Significado | Intuición |
|---------|--------|------------|-----------|
| $Q(s,a)$ | Valor-Q | Recompensa estimada al tomar acción $a$ en estado $s$ | "¿Qué tan bueno es este movimiento?" |
| $\alpha$ | Tasa de Aprendizaje | Cuánto confiar en información nueva (0-1) | Bajo = aprendizaje lento, Alto = rápido pero inestable |
| $r$ | Recompensa | Retroalimentación inmediata del entorno | +20 meta, -1 costo paso, -10 penalidad muro |
| $\gamma$ | Factor de Descuento | Peso de futuro vs recompensas inmediatas (0-1) | Bajo = enfoque inmediato, Alto = planifica al futuro |
| $\max_{a'} Q(s', a')$ | Mejor valor futuro | Máximo Q-valor en siguiente estado | "¿Cuál es lo mejor que podemos hacer desde aquí?" |

### Proceso de Aprendizaje Paso a Paso

```
EPISODIO 1 (Agente sin conocimiento):
─────────────────────────────────────

1️⃣ ESTADO: Agente en (2, 9)
   └─ Q-Table: Q[(2,9)] = [0, 0, 0, 0] (sin preferencia)

2️⃣ ACCIÓN: Elige aleatoriamente (epsilon alto)
   └─ Elige: ARRIBA (exploring)

3️⃣ ENTORNO: Agente se mueve a (2, 8)
   └─ Recompensa: r = -1 (costo del paso)
   └─ Aún no está en meta

4️⃣ ACTUALIZA Q-VALUE (usando Bellman):
   
   Antes: Q(s=(2,9), a=ARRIBA) = 0
   
   Q_nuevo = 0 + 0.1 × [ -1 + 0.9 × max(Q[(2,8)]) - 0 ]
   Q_nuevo = 0 + 0.1 × [ -1 + 0 - 0 ]
   Q_nuevo = -0.1
   
   Después: Q(s=(2,9), a=ARRIBA) = -0.1 ✓ (ligeramente negativo = no ideal)

5️⃣ REPITE: Continúa por muchos episodios...
```

### Balance Exploración vs Explotación (Estrategia ε-Greedy)

**El Dilema**:
- ❌ **Explotación Pura**: Siempre elige mejor movimiento conocido → atrapado en óptimo local
- ❌ **Exploración Pura**: Siempre movimiento aleatorio → nunca usa conocimiento
- ✅ **ε-Greedy (Equilibrada)**:
  - Con probabilidad $\epsilon$: Elige acción aleatoria (explorar)
  - Con probabilidad $1-\epsilon$: Elige mejor acción (explotar)

**En Este Proyecto**:
```javascript
if Math.random() < EPSILON:
    accion = elegirAccionAleatoria()  // Explorar: 10% probabilidad
else:
    accion = elegirMejorAccion()      // Explotar: 90% probabilidad
```

---

## 🏗️ Arquitectura del Sistema & Diseño Modular

### Diagrama de Interacción de Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                    index.html (Punto de entrada)            │
│              [Botones, Estadísticas, Contenedor Gráfico]    │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         ▼                                 ▼
    ┌─────────────┐              ┌──────────────────┐
    │ BoardInputs │              │ BoardOrquestrator│
    │ (Teclado,   │◄─────────────│  [Bucle Principal]│
    │  Ratón)     │              │                  │
    └─────────────┘              └────────┬─────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
              ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
              │  Qtable.js   │    │AIController  │    │BoardRender.js    │
              │ [RL Central] │    │[Entrenamiento]│   │[Visualización]   │
              │              │    │              │    │                  │
              │ - init()     │    │ - train()    │    │ - drawGrid()     │
              │ - learn()    │    │ - choose()   │    │ - drawAgent()    │
              │ - choose()   │    └──────┬───────┘    └──────────────────┘
              └──────────────┘           │
                                         ▼
                                  ┌──────────────────┐
                                  │PlayerController  │
                                  │[Entrada Manual]  │
                                  │[Seguimiento Stats]│
                                  └──────────────────┘
                                         │
                    ┌────────────────────┴──────────────────┐
                    ▼                                       ▼
        ┌──────────────────────┐          ┌────────────────────────┐
        │ ChartRenderer.js     │          │ BoardStates.js         │
        │[Gráficos Rendimiento]│          │[Constantes Tipo Celda] │
        └──────────────────────┘          └────────────────────────┘
```

### Responsabilidades de Módulos

| Módulo | Ubicación | Responsabilidad | Métodos Clave |
|--------|----------|-----------------|-------------|
| **Qtable** | `agent/Qtable.js` | Algoritmo central Q-Learning | `init()`, `learn()`, `chooseAction()` |
| **AIController** | `game/AIController.js` | Loop de entrenamiento y gestión episodios | `train()`, `runEpisode()` |
| **PlayerController** | `game/PlayerController.js` | Movimiento manual jugador y estadísticas | `movePlayer()`, `updateStats()` |
| **BoardOrquestrator** | `game/BoardOrquestator.js` | Loop principal, coordinación | `init()`, `gameLoop()` |
| **BoardRender** | `game/BoardRender.js` | Dibujo en canvas | `drawGrid()`, `drawAgent()`, `drawCell()` |
| **BoardInputs** | `game/BoardInputs.js` | Manejo teclado y ratón | `setupInputs()` |
| **ChartRenderer** | `game/ChartRenderer.js` | Gráficos rendimiento en tiempo real | `updateChart()` |
| **BoardStates** | `game/BoardStates.js` | Definiciones tipo de estado | `WALL`, `GOAL`, `START`, etc. |
| **Configs** | `game/configs/Configs.js` | Parámetros globales | `DELAY`, `REWARD`, `ACTIONS` |

### Flujo de Datos Durante Entrenamiento

```
Usuario haz clic "Iniciar Entrenamiento"
         │
         ▼
BoardOrquestrator.init() 
    ├─ Crear Q-Table
    ├─ Inicializar tablero
    └─ Iniciar gameLoop()
         │
         ▼
AIController.train() [LOOP EPISODIOS]
    │
    ├─ Posición agente = (2, 9)
    │
    ├─ chooseAction() → Qtable.chooseAction()
    │       └─ Retorna ARRIBA/ABAJO/IZQUIERDA/DERECHA
    │
    ├─ Mueve agente
    │
    ├─ Calcula recompensa
    │
    ├─ Qtable.learn() [ACTUALIZACIÓN BELLMAN]
    │       └─ Actualiza Q[(2,9)][ARRIBA]
    │
    ├─ Verifica si llegó a meta o murió
    │
    ├─ Repite hasta fin del episodio
    │
    └─ Registra estadísticas y actualiza gráfico
```

---

## 🎮 Guía del Usuario: Operando la Aplicación

### Abriendo y Configuración Inicial

1. **Abre `index.html`** en tu navegador
2. Verás:
   - **Barra lateral izquierda**: Controles (botones, entradas)
   - **Canvas central**: Tablero 5×10 con inicio verde y meta amarilla
   - **Panel derecho**: Gráfico de rendimiento en tiempo real

### Controles de Entrenamiento

| Control | Acción | Efecto |
|---------|--------|--------|
| **Iniciar Entrenamiento** | Botón | Comienza loop de aprendizaje IA |
| **Detener Entrenamiento** | Botón | Pausa entrenamiento en curso |
| **Resetear Q-Table** | Botón | Limpia todo aprendizaje (reinicia) |
| **Entrada Epsilon** | 0.0 - 1.0 | Ajusta tasa exploración en tiempo real |
| **Entrada Velocidad** | ms | Rapidez del movimiento del agente |

### Interacción con el Tablero

```
┌─ CONTROLES RATÓN ───────────────────────┐
│                                          │
│  Click Izq + Arrastra  → Dibuja muros  │
│  Click Der + Arrastra  → Borra muros   │
│                                          │
│  ⚠️  ¡Puedes modificar tablero MIENTRAS  │
│      el agente entrena!                  │
│      (¡Q-Table se adapta dinámicamente!) │
│                                          │
└──────────────────────────────────────────┘

┌─ LEYENDA ESTADO VISUAL ──────────────────┐
│                                          │
│  🟢 Verde  = Posición actual agente     │
│  🟡 Amarillo = Ubicación meta/destino   │
│  ⬛ Negro  = Muro (obstáculo)          │
│  ⬜ Blanco = Vacío/caminable            │
│                                          │
└──────────────────────────────────────────┘
```

### Interpretando el Gráfico de Rendimiento

El gráfico muestra dos líneas:

```
        Pasos por Episodio
             ▲
        30   │  ╱─ Línea azul (todos episodios)
             │ ╱  Ruidosa, muestra rendimiento crudo
        20   │╱
             │ ╲╲____
        10   │      ╲╲.__
             │          ╲╲____ Línea naranja (promedio móvil)
         5   │               ╲  Tendencia suave muestra aprendizaje
             │                ╲
         0   └──────────────────────────────► Episodios
             0    50    100   150    200
```

**Interpretación**:
- **Tendencia descendente** = Aprendizaje ocurriendo ✓
- **Estancamiento** = Agente convergió (encontró buena política)
- **Picos hacia arriba** = Cambio repentino en tablero (obstáculo dinámico)

---

## 🔧 Referencia Técnica & API

### API de Qtable.js

#### `new Qtable(ancho, alto, acciones)`
Inicializa Q-Table para dimensiones dadas.

```javascript
const q = new Qtable(5, 10, ['ARRIBA', 'ABAJO', 'IZQUIERDA', 'DERECHA']);
// Crea Q-Table: { (x,y): [0,0,0,0], ... }
```

#### `chooseAction(estado, epsilon)`
Retorna mejor acción o acción aleatoria con probabilidad epsilon.

```javascript
const accion = q.chooseAction(estado, 0.1);
// Retorna: índice acción (0=ARRIBA, 1=ABAJO, 2=IZQUIERDA, 3=DERECHA)
```

#### `learn(estado, accion, recompensa, siguienteEstado, alpha, gamma)`
Actualiza Q-valor usando ecuación de Bellman.

```javascript
q.learn(
    {x: 2, y: 9},      // estado actual
    0,                  // índice acción (ARRIBA)
    -1,                 // recompensa
    {x: 2, y: 8},      // siguiente estado
    0.1,               // alpha (tasa aprendizaje)
    0.9                // gamma (factor descuento)
);
```

### Parámetros de Configs.js

| Parámetro | Default | Rango | Efecto |
|-----------|---------|-------|--------|
| **ALPHA** (Tasa Aprendizaje) | 0.1 | 0.01 - 0.5 | Qué tan agresivamente actualizar Q-valores |
| **GAMMA** (Factor Descuento) | 0.9 | 0.5 - 0.99 | Cuánto considerar recompensas futuras |
| **EPSILON** (Exploración) | 0.1 | 0.0 - 1.0 | Probabilidad acción aleatoria (0=codicioso, 1=aleatorio) |
| **DELAY** (Velocidad Episodio) | 1000 ms | 100 - 5000 | Tiempo entre pasos del agente |
| **REWARD.GOAL** | +20 | - | Recompensa por alcanzar meta |
| **REWARD.STEP** | -1 | - | Costo por paso (incentiva eficiencia) |
| **REWARD.DEATH** | -10 | - | Penalidad por golpear muro |

### Sistema de Recompensas (Configuración Tablero)

```javascript
BOARD: {
    width: 5,           // 5 columnas (0-4)
    height: 10,         // 10 filas (0-9)
    start: {x: 2, y: 9} // Verde: centro-abajo
    goal: {x: 2, y: 0}  // Amarillo: centro-arriba
}

REWARD: {
    GOAL: +20,   // Éxito: alcanzó meta
    STEP: -1,    // Costo por paso (incentiva camino más corto)
    DEATH: -10   // Fracaso: golpeó muro
}
```

---

## 💡 Ejemplos y Casos de Uso

### Ejemplo 1: Sesión de Entrenamiento Básica

**Escenario**: Entrena agente en tablero vacío por 50 episodios.

**Pasos**:
1. Abre `index.html`
2. Limpia cualquier muro (tablero vacío)
3. Haz clic **"Iniciar Entrenamiento"**
4. Espera 50 episodios (~50 segundos a velocidad default)
5. **Observa**: Gráfico muestra ~30 pasos bajando a ~7 pasos

**Por qué**: Agente aprende camino directo (2,9) → (2,0) en línea recta.

### Ejemplo 2: Aprendizaje en Entorno Dinámico

**Escenario**: Modifica tablero MIENTRAS entrena para ver adaptación.

**Pasos**:
1. Inicia entrenamiento (deja correr 20-30 episodios)
2. Dibuja un **muro vertical** en medio del tablero
3. **Observa**: Pasos del agente suben temporalmente
4. **Luego**: Gráfico baja nuevamente mientras agente encuentra nuevos caminos

**Por qué**: Q-Table es dinámico. Recompensas para viejo camino bajan cuando está bloqueado, agente explora alternativas.

### Ejemplo 3: Ajustando Epsilon (Exploración)

**Escenario**: Entiende efecto de exploración.

**Pasos**:
1. **Primer run**: Establece epsilon = 0.5, entrena 30 episodios
   - Observa: Más caótico, convergencia lenta
2. **Segundo run**: Resetea Q-Table, establece epsilon = 0.05
   - Observa: Convergencia más rápida, curva suave

**Por qué**: Epsilon bajo = más explotación, refinamiento rápido. Epsilon alto = más exploración, puede encontrar mejores caminos pero más lento.

---

## ❓ Troubleshooting & Preguntas Frecuentes

### P: Agente se mueve aleatoriamente y nunca mejora

**R**: Verifica:
- [ ] Epsilon no es 1.0 (deshabilita exploración)
- [ ] Alpha > 0 (tasa aprendizaje debe ser positiva)
- [ ] Estructura recompensas correcta (positiva para meta, negativa para pasos)

**Solución**: Resetea Q-Table y reentrena con parámetros default.

### P: Gráficos muestran picos arriba y abajo

**R**: Comportamiento esperado con obstáculos dinámicos.

**Normal cuando**:
- [ ] Estás dibujando muros mientras entrena
- [ ] Estructura recompensas cambió durante sesión

**Para ver convergencia suave**: Limpia tablero y entrena en entorno estático.

### P: Agente parece "atrapado" moviéndose en círculos

**R**: Causas probables:
- [ ] Tablero sin camino a meta (inalcanzable)
- [ ] Recompensa meta muy baja relativa a costo paso

**Solución**: 
- Verifica que tile amarillo (meta) exista
- Aumenta valor `REWARD.GOAL` en Configs

### P: ¿Cómo exporto/guardo la Q-Table?

**Actual**: Proyecto no incluye GUI para persistencia.

**Manual**: Abre consola navegador (F12) y ejecuta:
```javascript
console.log(JSON.stringify(aiController.qtable.qTable));
// Copia salida para guardar manualmente
```

### P: ¿Puedo usar esto con control solo teclado?

**R**: Sí, modifica `PlayerController.js` para llamar funciones movimiento con teclas flecha. Actualmente soporta dibujo ratón y actualizaciones posición manual.

---

## 🎓 Puntos Clave & Resultados de Aprendizaje

### Qué Aprendes Construyendo Esto

1. **Ecuación de Bellman en Acción**: No solo teoría, sino código que la aplica
2. **Separación de Responsabilidades**: IA (Qtable) completamente desacoplada de renderizado
3. **Balance Exploración-Explotación**: Comprensión práctica de estrategia ε-greedy
4. **Visualización Tiempo Real**: Cómo debuggear algoritmos ML visualmente
5. **Arquitectura JavaScript Modular**: Patrones de diseño escalables para sistemas complejos

### Por Qué Q-Learning para Esto?

| Aspecto | Q-Learning | Por Qué Funciona |
|--------|-----------|-----------------|
| **Complejidad** | Simple | Bueno para aprender fundamentos RL |
| **Convergencia** | Garantizada (estado finito) | Método tabular convergará en este tablero |
| **Memoria** | Baja (tablero 5×10) | Sin necesidad de aproximación función |
| **Tiempo Real** | Rápido | Actualización Q instantánea ✓ |

---

## 🚀 Próximos Pasos & Mejoras Futuras

### Implementado (Semana 2)
- ✅ Algoritmo Q-Learning central
- ✅ Edición tablero interactiva
- ✅ Métricas rendimiento en tiempo real

### Mejoras Potenciales
- [ ] **Deep Q-Networks (DQN)**: Manejar espacios estado más grandes/basados imagen
- [ ] **Almacenamiento Persistente**: Guardar/cargar Q-Tables desde localStorage
- [ ] **Multi-Agente**: Agentes compitiendo o cooperando
- [ ] **Entorno 3D**: Extensión a Three.js para navegación espacial
- [ ] **GUI Ajuste Hiperparámetros**: Modificar α, γ, ε sin cambiar código

### Aplicaciones Futuras
- **IA en Videojuegos**: Pathfinding NPC en RPGs
- **Robótica**: Planificación movimiento para agentes autónomos
- **Logística**: Optimización rutas con costos dinámicos
- **Integración Avanzada**: GODOT 3D + microcontroladores

---

## 📖 Reflecciones del Proyecto

### Semana 2: Lo Que Aprendí

**El Eureka**: Antes de este proyecto, el Aprendizaje por Refuerzo parecía una caja negra. Implementar Q-Table desde cero—viendo al agente fallar, mejorar gradualmente y finalmente dominar el tablero—hizo click todo.

**Avance Técnico**: La **separación de responsabilidades** entre `Qtable.js` (algoritmo puro) y el resto (UI/input/animación) fue transformador. El testing se volvió aislado y los bugs más fáciles de encontrar.

**Principio de Diseño**: La arquitectura modular no es solo calidad de código—es cómo piensas sobre sistemas complejos. Cada módulo tiene un trabajo, límites claros, acoplamiento mínimo.

**Más Desafiante**: Sincronizar estado interno IA con Canvas frames y actualizaciones gráfico sin caídas rendimiento. Resuelta usando requestAnimationFrame eficientemente.

---

## 👨‍💻 Autor & Contribuciones

- **Carlos Enrique Cochero Ramos**
- GitHub: [@caertos](https://github.com/caertos)
- Parte del **Desafío 52 Proyectos** para mejorar habilidades de programación

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** - ver [LICENSE](LICENSE) para detalles.

---

## 🔗 Recursos & Lectura Adicional

### Teoría RL
- Sutton & Barto: "Reinforcement Learning - An Introduction"
- Paper Q-Learning: Watkins & Dayan (1992)

### Tecnologías Web
- Canvas API: [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)
- Game Loops JavaScript: [Patrón Game Loop](https://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)

---

**¡Happy Learning! 🚀** Siéntete libre de hacer fork, modificar y compartir tus mejoras!
