// funcion para que dependiendo de la extension del archivo le asigne automaticamente un icono
function obtenerIcono(nombre, esCarpeta) {
    if (esCarpeta) return "📁";
    const ext = nombre.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return "📕";
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return "🖼️";
    if (['xls', 'xlsx', 'csv'].includes(ext)) return "📊";
    if (['doc', 'docx', 'txt'].includes(ext)) return "📝";
    if (['mp4', 'mov', 'avi'].includes(ext)) return "🎥";
    if (['zip', 'rar', '7z'].includes(ext)) return "📦";
    return "📄"; 
}
const esImagen = (nombre) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(nombre.split('.').pop().toLowerCase());

// creamos una lista de 45 elementos de prueba
let listaTotal = [];
const tipos = [{ext:'pdf', tipo:'Informe'}, {ext:'jpg', tipo:'Foto'}, {ext:'xlsx', tipo:'Presupuesto'}, {ext:'png', tipo:'Logo'}, {ext:'zip', tipo:'Recursos'}];

for (let i = 1; i <= 45; i++) {
    let esCarpeta = (i % 5 === 0);
    let tipo = tipos[i % tipos.length];
    let nombre = esCarpeta ? `Carpeta ${i}` : `${tipo.tipo}_${i}.${tipo.ext}`;
    let esImg = esImagen(nombre);
    
    listaTotal.push({
        nombre,
        tamaño: esCarpeta ? "-" : `${(Math.random() * 10).toFixed(1)} MB`,
        fecha: `0${(i % 9) + 1}/06/2026`,
        fechaNum: new Date(2026, 5, (i % 9) + 1).getTime(),
        icono: obtenerIcono(nombre, esCarpeta),
        esImagen: esImg,
        //asignamos una foto aleatoria de prueba si se trata de uan imagen
        urlImg: esImg ? `https://picsum.photos/800/600?random=${i}` : null
    });
}

let listaVisible = [...listaTotal]; //copia de listaTotal
let limite = 15; //vamos de 15 en 15 en el scroll
const cajaArchivos = document.getElementById('caja-archivos');
const zonaContenido = document.querySelector('.contenido');

// funcion para pintar archivos con el scroll
function pintarArchivos() {
    cajaArchivos.innerHTML = ''; 
    listaVisible.slice(0, limite).forEach(archivo => {
        const caja = document.createElement('div');
        caja.className = 'archivo';
        caja.innerHTML = `
            <div class="datos-basicos">
                <span>${archivo.icono}</span>
                <span>${archivo.nombre}</span>
            </div>
            <div class="detalles">
                <span>${archivo.tamaño}</span>
                <span>${archivo.fecha}</span>
            </div>
            <button class="btn-eliminar">Eliminar</button>
        `;
        cajaArchivos.appendChild(caja);
    });
}
pintarArchivos();


zonaContenido.addEventListener('scroll', () => {
    if (zonaContenido.scrollTop + zonaContenido.clientHeight >= zonaContenido.scrollHeight - 10 && limite < listaVisible.length) {
        limite += 15; pintarArchivos(); 
    }
});

// buscador
document.querySelector('.buscador').addEventListener('input', (evento) => {
    listaVisible = listaTotal.filter(a => a.nombre.toLowerCase().includes(evento.target.value.toLowerCase()));
    limite = 15; pintarArchivos();
});

//filtro por nombre, fecha, tamaño
document.getElementById('filtro').addEventListener('change', (evento) => {
    const op = evento.target.value;
    listaVisible.sort((a, b) => op === 'nombre' ? a.nombre.localeCompare(b.nombre) : op === 'fecha' ? b.fechaNum - a.fechaNum : op === 'tamaño' ? (parseFloat(b.tamaño)||0) - (parseFloat(a.tamaño)||0) : 0);
    limite = 15; pintarArchivos();
});

// funcion para subir archivos
function subirArchivo(archivos) {

    for (let archivo of archivos) {
        let esUnaImagen = archivo.type.includes('image');
        
        // creamos la tarjeta del archivo subido
        let nuevoArchivo = {
            nombre: archivo.name,
            tamaño: Math.round(archivo.size / 1024) + ' KB',
            fecha: "Hoy", 
            fechaNum: Date.now(),
            icono: obtenerIcono(archivo.name, false),
            esImagen: esUnaImagen, 
            urlImg: esUnaImagen ? URL.createObjectURL(archivo) : null
        };
        
        listaTotal.unshift(nuevoArchivo); 
        listaVisible.unshift(nuevoArchivo);
    }
    pintarArchivos();
}

const entrada = document.getElementById('entrada-archivo');
document.getElementById('boton-subir').addEventListener('click', () => entrada.click());
entrada.addEventListener('change', (e) => { subirArchivo(e.target.files); entrada.value = ''; });

//arrastrar  soltar
zonaContenido.addEventListener('dragover', (e) => { e.preventDefault(); zonaContenido.classList.add('arrastrando'); });
zonaContenido.addEventListener('dragleave', () => zonaContenido.classList.remove('arrastrando'));
zonaContenido.addEventListener('drop', (e) => { e.preventDefault(); zonaContenido.classList.remove('arrastrando'); subirArchivo(e.dataTransfer.files); });

//previsualizar la imagen o eliminar archivo
cajaArchivos.addEventListener('click', (evento) => {
    const caja = evento.target.closest('.archivo');
    if (!caja) return; 
    const nombre = caja.querySelector('.datos-basicos span:last-child').textContent;

    if (evento.target.className === 'btn-eliminar') {
        if (confirm('¿Seguro que quieres eliminarlo?')) {
            listaTotal = listaTotal.filter(a => a.nombre !== nombre);
            listaVisible = listaVisible.filter(a => a.nombre !== nombre);
            pintarArchivos(); 
        }
        return; 
    }
    const datos = listaTotal.find(a => a.nombre === nombre);
    if (datos && datos.esImagen) abrirVistaPrevia(datos.urlImg);
});

// cambiar vistas(cuadricula o lista)
const btnVista = document.getElementById('btn-alternar-vista');
btnVista.addEventListener('click', () => {
    const esGrid = cajaArchivos.className === 'vista-cuadricula';
    cajaArchivos.className = esGrid ? 'vista-lista' : 'vista-cuadricula';
    btnVista.textContent = esGrid ? 'Cambiar a Vista Cuadrícula' : 'Cambiar a Vista Lista';
});

//menu despegable del perfil
const menuPerfil = document.getElementById('desplegable-perfil');
document.getElementById('boton-perfil').addEventListener('click', (e) => { e.stopPropagation(); menuPerfil.classList.toggle('oculto'); });

//menu lateral para el movil para que se abra y cierre
const menuLat = document.querySelector('.menu-lateral');
document.getElementById('btn-menu').addEventListener('click', (e) => { e.stopPropagation(); menuLat.classList.toggle('abierto'); });

//para que el menu se cierre cuando hacemos click fuera del menu
window.addEventListener('click', (e) => { 
    menuPerfil.classList.add('oculto');
    if (!menuLat.contains(e.target)) menuLat.classList.remove('abierto'); 
});

//activar modo oscuro o modo claro
const btnOscuro = document.getElementById('btn-modo-oscuro');
btnOscuro.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    btnOscuro.textContent = document.body.classList.contains('modo-oscuro') ? 'Modo claro' : 'Modo oscuro';
});

// 9. MODAL DE IMÁGENES
const fondoModal = document.getElementById('modal-preview');
const imgModal = document.getElementById('imagen-modal');
const cerrarVistaPrevia = () => { 
    fondoModal.classList.add('oculto'); 
    imgModal.src = ''; 
};
//funcion para abrir la vista previa de la foto
function abrirVistaPrevia(url) { 
    imgModal.src = url; 
    fondoModal.classList.remove('oculto'); 
}
document.getElementById('cerrar-modal').addEventListener('click', cerrarVistaPrevia);
/// cerrar vista previa
fondoModal.addEventListener('click', (e) => {
    if (e.target === fondoModal) cerrarVistaPrevia(); 
});