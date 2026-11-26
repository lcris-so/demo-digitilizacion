# Netflix: del DVD al streaming

Web estática de cuatro páginas, hecha a partir del dossier de la Fase I de Digitalización (2º DAM Tarde) de Luis Cristian Sanchez Oliva. Usa Bootstrap 5.3.9 por CDN para la rejilla y el menú móvil, una hoja de estilos propia con tema oscuro y el motor de scroll Scrollcraft (licencia MIT) en Inicio y Evolución.

## Estructura

```text
├── index.html       Inicio: el sobre rojo se abre al hacer scroll, cifras, accesos y dato curioso
├── empresa.html     Ficha: identidad e historia, organización y presencia geográfica
├── evolucion.html   Antes y después fijado en pantalla y línea temporal horizontal de 7 hitos
├── recursos.html    Vídeo oficial, galería, registro de fuentes y conclusión
├── css/
│   ├── style.css        Estilos comunes del sitio
│   ├── escenas.css      Escenas de scroll de Inicio y Evolución
│   └── scrollcraft.css  Motor Scrollcraft (tercero, sin modificar)
├── js/
│   ├── main.js          Apariciones al hacer scroll y contadores
│   ├── escenas.js       Arranque del motor, disco de la línea temporal y saltos entre hitos
│   ├── scrollcraft.js   Motor Scrollcraft (tercero, sin modificar)
│   └── LICENSE-scrollcraft.txt
└── img/             Figuras de la sala de prensa oficial de Netflix
```

## Cómo abrirla

Abre `index.html` en el navegador o usa Live Server en VS Code. Necesita conexión a Internet para cargar Bootstrap desde jsDelivr.

## Personalizar

- Colores: variables de `:root` en `css/style.css` y tokens `--sc-*` en `css/escenas.css`.
- El menú y el pie se repiten en los cuatro HTML; si cambias uno, cambia los demás y mantén `aria-current="page"` en la página actual.
