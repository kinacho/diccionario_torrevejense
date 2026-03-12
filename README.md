# Diccionario Torrevejense

Una aplicación moderna para explorar el léxico y las expresiones propias de Torrevieja. Este proyecto digitaliza y pone a disposición del usuario la riqueza lingüística de la región con una interfaz intuitiva y potentes herramientas de búsqueda.

## ✨ Características

- 🔍 **Búsqueda Avanzada**: Búsqueda difusa (fuzzy search) para encontrar palabras incluso con errores tipográficos.
- 📅 **Palabra del Día**: Aprende un término nuevo cada día de forma automática.
- 🎲 **Palabra Aleatoria**: Déjate sorprender por el vocabulario local.
- 📊 **Estadísticas**: Visualización de datos sobre el contenido del diccionario (entradas por letra, campos, etc.).
- 📑 **Navegación Alfabética**: Explora el diccionario de la A a la Z.
- ⭐ **Favoritos**: Guarda tus palabras preferidas para consultarlas rápidamente.
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles y escritorio.

## 🛠️ Tecnologías

Este proyecto está construido con lo último en desarrollo web:

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Lucide Svelte](https://lucide.dev/)
- **Motor de Búsqueda**: [Fuse.js](https://www.fusejs.io/)
- **Gráficos**: [Chart.js](https://www.chartjs.org/) con [Svelte ChartJS](https://github.com/Svelte-ChartJS/svelte-chartjs)
- **Animaciones**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## 🚀 Comenzando

### Requisitos previos

- Node.js (versión 18 o superior)
- npm o pnpm

### Instalación

1. Clona el repositorio:
   ```bash
   git clone [url-del-repositorio]
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Visita `http://localhost:5173` para ver la aplicación en funcionamiento.

### Construcción para producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

## 📂 Estructura del Proyecto

```text
/src
  /lib
    /components  - Componentes UI reutilizables
    /data        - Contiene el archivo dictionary.json con los datos
    dictionary.ts - Lógica central de manejo de datos y búsqueda
  /routes        - Páginas y lógica de enrutamiento de SvelteKit
```

## 📝 Licencia

Este proyecto es privado. Todos los derechos reservados.
