INSTRUCCIONES PARA EJECUTAR EL PROYECTO

1. Descarga el repositorio en tu ordenador
2. Descomprime la carpeta
3. Doble click en index.html(src/main/webapp) y se abrira directamente en tu navegador

DECISIONES TECNICAS Y SU JUSTIFICACION

1. Arquitectura. El proyecto se ha desarrollado usando HTML, CSS Y JavaScript, separando logica, estilos y estructura en diferentes carpetas.
    - Justificacion: He optado por este enfoque para garantiza una carga inicial rapida y un rendimiento optimo para el proyecto. Además de ser el entorno tecnológico donde tengo mayor experiencia y solidez, la separación estricta de responsabilidades permite que el código sea mucho más limpio, fácil de mantener y de escalar en el futuro.

2. Gestion del estado en memoria. Los datos de los archivos ("listaTotal") están completamente separados de la vista HTML.
    - Justificacion:  Leer o buscar elementos directamente en el HTML es una operación muy lenta y al procesar los filtros y la ordenación en la memoria de JavaScript, la interfaz responde en milisegundos, simulando el comportamiento ágil de un backend real.

3. Scroll infinito y delegación de eventos. Los archivos se renderizan en pequeños bloques de 15 al hacer scroll, y se utiliza un       unico "event listener" para toda la cuadrícula en lugar de uno por archivo.
    - Justificacion: Evita la sobrecarga del navegador y el consumo excesivo de memoria RAM. Esta estrategia permite escalar la aplicación a miles de archivos sin que la página se congele o pierda fluidez.

4. Previsualizacion local nativa: Se implemento la API "URL.createObjectURL()" para el visualizador de imágenes.
    -Justificacion: Permite generar enlaces temporales directamente en el ordenador del usuario al arrastrar una foto. Esto proporciona una previsualización inmediata sin necesidad de consumir recursos de red enviando la foto primero a un servidor.

MEJORAS

1. Conexion a un backend
2. Navegación por las carpetas subidas
3. Subida real de archivos
4. Funcionamiento real del menu lateral
5. Poder renombrar los archivos subidos o seleccionar varios archivos a la vez para ya sea adjuntarlos, borrarlos...
6. Opcion para crear nuevas carpetas, ficheros...
