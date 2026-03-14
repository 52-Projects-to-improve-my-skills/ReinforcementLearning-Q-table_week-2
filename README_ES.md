# Reinforcement Learning (Q-Table)
### Leer en [English](README.md)

Una aplicación web estática en JavaScript que implementa un agente de Aprendizaje por Refuerzo (Reinforcement Learning) utilizando una Q-Table para navegar por un tablero interactivo. Este proyecto forma parte de mi reto de "52 Proyectos" para mejorar mis habilidades de programación.

## Características

- **Algoritmo Q-Learning**: Implementación de la ecuación de Bellman para la optimización de búsqueda de caminos.
- **Canvas Interactivo**: Dibuja o borra paredes y caminos directamente en el tablero en tiempo real.
- **Visualización Dinámica**: Gráficos en tiempo real para seguir las métricas de rendimiento.
- **Arquitectura Modular**: Separación clara entre la lógica de la IA, el estado del juego y el renderizado de la interfaz.
- **Métricas de Rendimiento**: Seguimiento de episodios, pasos, muertes y cálculo de promedios/mínimos.

## Requisitos

- Cualquier navegador web moderno (Chrome, Firefox, Edge, etc.).
- Sin necesidad de instalación (Proyecto JS estático).

## Estructura Modular

El proyecto está organizado en controladores especializados para asegurar la escalabilidad:
- `Qtable.js`: Lógica central del algoritmo de aprendizaje por refuerzo.
- `AIController.js`: Gestiona la toma de decisiones y el proceso de aprendizaje del agente.
- `PlayerController.js`: Maneja la interacción humana manual y la edición del tablero.
- `ChartRenderer.js`: Responsable de actualizar las gráficas de rendimiento.
- `BoardOrquestator.js`: Coordina la interacción entre todos los componentes y el bucle del juego.

## Proyecto

Parte de 52 proyectos para mejorar habilidades de programación - Semana 2

# Semana 2: Reinforcement Learning (Q-Table)

## ¿Qué entendí mejor?
- **Modularización**: Cómo desacoplar el algoritmo de aprendizaje de la lógica de renderizado, facilitando enormemente la depuración.
- **Ecuación de Bellman**: La aplicación práctica de recompensas y descuentos para actualizar los valores de estado-acción.
- **Exploración vs Explotación**: El equilibrio del parámetro `epsilon` para permitir que el agente descubra nuevas rutas mientras aprovecha sus mejores movimientos conocidos.

## ¿Qué me costó más trabajo?
- **Separación de Controladores**: Definir límites claros entre `AIController` y `PlayerController` para evitar conflictos de estado.
- **Sincronización de UI**: Sincronizar los pasos internos de la IA con los frames de animación del Canvas y las actualizaciones del gráfico en tiempo real sin caídas de rendimiento.

## ¿Qué decisión técnica fue clave?
- **Separación de Responsabilidades**: Implementar `PlayerController`, `AIController` y `ChartRenderer` como módulos independientes. Esto permitió probar la lógica de la IA de forma aislada sin preocuparse por la capa de visualización.
- **Dibujo en Tiempo Real**: Permitir que el usuario modifique el entorno dinámicamente mientras el agente está aprendiendo, lo que resalta la capacidad de adaptación de la Q-Table.

## ¿Dónde puedo usar estos conceptos a futuro?
- **IA en Videojuegos**: Crear NPCs que se adapten al comportamiento del jugador o naveguen por entornos procedimentales complejos.
- **Problemas de Optimización**: Resolver problemas de logística o rutas donde los caminos deben optimizarse en base a costos variables.
- **Simulaciones de Robótica**: Implementar lógicas básicas de navegación para agentes autónomos en entornos simulados.

## ¿Dónde me gustaría probarlo?
- Tengo interés en aplicar estos conceptos de RL usando **Python con TensorFlow o PyTorch** para pasar de Q-Tables a Redes Q Profundas (DQN) en espacios de estados más complejos.
- Implementar un agente similar en un entorno 3D usando **Three.js** para explorar la navegación espacial.

## Reflexión Final
Antes de este proyecto, el RL parecía una "caja negra". Construir una Q-Table desde cero y ver al agente fallar, aprender y finalmente dominar el tablero fue increíblemente gratificante. Desmitificó cómo las máquinas "aprenden" mediante prueba y error y reforzó la importancia de una arquitectura limpia y modular al tratar con lógica compleja.

# Autor
- Carlos Enrique Cochero Ramos
- GitHub: [caertos](https://github.com/caertos)

# Licencia
Este proyecto está bajo la Licencia MIT.
