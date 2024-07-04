const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    criptomoneda : '',
    moneda: ''
}


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomoneda();
    criptomonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);
    formulario.addEventListener('submit', submitFormulario);
})

function consultarCriptomoneda(){

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( response => response.json())
        .then(result => obtenerCriptomonedas(result.Data))
        .then(criptomonedas => selectCriptomnedas(criptomonedas))
}

// Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
})

function selectCriptomnedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
       
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;

    console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();

    //validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //consultar api
    consultarApi();
    
}

function mostrarAlerta(msg){
    const error = document.querySelector('.error');
    if(!error){
        const divError = document.createElement('div');
        divError.classList.add('error');
        divError.textContent = msg;
        formulario.appendChild(divError);

        setTimeout(() => {
            divError.remove();
        }, 2000);
    }
    
}

function consultarApi(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpinner();
    fetch(url)
        .then(response => response.json())
        .then(cotizacion => {
            mostrarCotizacionHtml(cotizacion.DISPLAY[criptomoneda][moneda],criptomoneda,moneda);
        })
}

function mostrarCotizacionHtml(cotizacion,criptomoneda,moneda){
    limpiarHtml();
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio de la criptomoneda ${criptomoneda} en ${moneda} es de: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación de las útlimas 24 hrs: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`;
    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHtml();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `
    resultado.appendChild(spinner);
}