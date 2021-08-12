(function() {

    let DB;
    let idCliente;
    const nombreInput =  document.querySelector('#nombre');
    const emailInput =  document.querySelector('#email');
    const telefonoInput =  document.querySelector('#telefono');
    const empresaInput =  document.querySelector('#empresa');

    const frm = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //Actualizar un cliente 
        frm.addEventListener('submit', actualizarCliente);

        //Verificar en id de la URL
        const parametroURL = new URLSearchParams(window.location.search);
        idCliente = parametroURL.get('id');
        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);           
            }, 100);

        }
    });

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }

        }
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }
        
        const transaction = DB.transaction('crm', 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Actializado correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error');
        }
    }


    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }


    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }


    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        }
    
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    

function imprimirAlerta(msj, tipo) {

    const alerta = document.querySelector('.alerta');

    if (!alerta) {

        //Crear alerta 
        const divMsj = document.createElement('div');
        divMsj.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

        if (tipo === 'error') {
            divMsj.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        }
        else {
            divMsj.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divMsj.textContent = msj;
        frm.appendChild(divMsj);

        setTimeout(() => {
            divMsj.remove();
        }, 3000);

    }

}


})();