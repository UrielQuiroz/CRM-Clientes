(function () {

    let DB;
    const frm = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        frm.addEventListener('submit', validarCliente);
    })

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function validarCliente(e) {
        e.preventDefault();
        console.log('Validando...');

        //Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
        }

        //Crear el objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }

        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function() {
            //console.log('Hubo un error');
            imprimirAlerta('Hubo un error');
        }

        transaction.oncomplete = function() {
            console.log('Cliente Agregado');
            imprimirAlerta('Cliente agregado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
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