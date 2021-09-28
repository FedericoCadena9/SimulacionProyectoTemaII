//Variables globales
let x0;
let x1;
let i;
let myChart;
let menu
let btnGenerar = document.getElementById("btnGenerar");
let data = [];
let table = document.querySelector("#table");
let chart = document.getElementById("chart");
let divButtons = document.getElementById("divButtons");
let downloadLink = document.getElementById("btnExportar");
let nuevo = document.getElementById("btnModalNuevo");

//Errores y Advertencias
let warning = document.getElementById("warning")
let error = document.getElementById("error")

//Función Solo numeros en Inputs
function sonNumeros(evt) 
{
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        warning.classList.remove("hidden");
        return false;
        
    }
    warning.classList.add("hidden"); 
    error.classList.add("hidden"); 
    return true;
}


//Función Errores Inputs
function productosMediosErrores() 
{
    x0 = document.getElementById("x0").value
    x1 = document.getElementById("x1").value
    var x0length = x0.length
    var x1length = x1.length

    if(x0length == x1length )
    {
        if (x0length%2 == 0 && x1length%2 == 0)
            if(x0 == "" && x1 == "")
            {
                let ErrorText = document.getElementById("errorText").innerHTML = `Debes agregar al menos una semilla.`;
                error.classList.remove("hidden");
            }
            else
            {
                productosMedios()
            }
        else
        {
            let ErrorText = document.getElementById("errorText").innerHTML = `Los números no son pares entre sí`;
            error.classList.remove("hidden");
        }
    }
    else
    {
        if(x0length > x1length)
        {
            let ErrorText = document.getElementById("errorText").innerHTML = `La cifra ${x1} no cumple con las mismas cifras que ${x0}.`;
            error.classList.remove("hidden");
        }
        else
        {
            let ErrorText = document.getElementById("errorText").innerHTML = `La cifra ${x0} no cumple con las mismas cifras que ${x1}.`;
            error.classList.remove("hidden");
        }
    }
}

//Añadir 0s a la izquierda
function zfill(number, width) {
    var numberOutput = Math.abs(number); 
    var length = number.toString().length; 
    var cero = "0";
    
    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString()); 
        } else {
            return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (cero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((cero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}

//Función Generar Productos Medios (Operaciones)
function productosMedios()
{
    //Variables
    x0 = document.getElementById("x0").value
    x1 = document.getElementById("x1").value
    sem0 = document.getElementById("x0").value
    sem1 = document.getElementById("x1").value
    modalText =document.getElementById("modalText")

    //Clases
    btnGenerar.disabled = true
    btnGenerar.classList.add("disabled:opacity-50")
    btnGenerar.classList.add("cursor-not-allowed")
    table.classList.remove("hidden");
    chart.classList.remove("hidden");
    divButtons.classList.remove("hidden");
    menu = document.getElementById("menu");
    menu.classList.remove('h-screen')
    menu.classList.add('min-h-full')

    //Proceso
    let ui2 = '0'
    let match = false;
    for (i = 0; i <= data.length && !match; i++) 
    {
        //Multiplicación de semillas
        let producto = x0 * x1;
        //Conseguir doble de longitud
        let longitud = x0.length * 2;
        //Añadir ceros en caso de que longitud < 4n
        let funcionTrans = zfill(producto, longitud);
        //Extraer numeros centrales
        let fin = longitud / 2
        let inicio = fin / 2
        strFuncionTrans = funcionTrans.toString();
        sigSemilla = strFuncionTrans.substr(inicio, fin)
        // Iterar proceso
        x0 = x1;
        x1 = sigSemilla;
        let ui = '0.' + sigSemilla

        //Guardar datos en un Object
        data[i] = {
            i: i + 1,
            xi: x0,
            ui: ui
        }

        //Comprobar si se ha repetido un número en Array
        if(data[i].ui == ui2)
        {
            match = true
            
        }

        //Guardar ultima cifra para comparar
        ui2 = data[Object.keys(data)[Object.keys(data).length-1]].ui
    }

    //Modal
    openModal()
    modalText.innerHTML = `Con X0 = ${sem0} y X1 = ${sem1} se obtuvieron ${i} números pseudoaleatorios.`

    //Exportar a CSV
    const csvString = [
        [
            "i",
            "xi",
            "ui"
        ],
        ...data.map(item => [
            item.i,
            item.xi,
            item.ui
        ])
    ]
    .map(e => e.join(",")) 
    .join("\n");

    // Exportar para descargar
    let blob = new Blob(["\ufeff", csvString]);
    let url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `PM_${sem0}_${sem1}_${i}.csv`;
    
    //Gráfica 

    //Mapeo de array para i
    let n = data.map(function(elem)
    {
        return elem.i
    })

    //Mapeo de array para Ui
    let pseudo = data.map(function(elem)
    {
        return elem.ui
    })

    //Generación de Gráfico con CHartJS
    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: n,
            datasets: [{
                label: 'Numeros psuedoaleatorios (Ui)',
                data: pseudo,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
}

//Crear tabla
btnGenerar.addEventListener('click', () => {
    

    data.forEach( dat => {
        let row = document.createElement('tr')
        row.classList.add('text-gray-700')

        Object.values(dat).forEach(text => {
            let cell = document.createElement('td')
            cell.classList.add('px-4')
            cell.classList.add('py-3')
            cell.classList.add('border')

            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell)
        })

        table.appendChild(row)
    })
});

// Boton Modal Exportar para Exportar a CSV

let btnModal = document.querySelector("#btnModal")
btnModal.addEventListener('click', () => {
    openModalCsv()
})
const exportCSV = () => {
    downloadLink.click();
}


// Boton Nuevo para abrir Modal
let btnNuevo = document.querySelector("#btnNuevo")
btnNuevo.addEventListener('click', () => {
    openModalNuevo()
})

//Botón Nuevo para limpiar datos
nuevo.addEventListener('click', () => {
    data = []
    document.getElementById("x0").value = "";
    document.getElementById("x1").value = "";
    btnGenerar.disabled = false
    btnGenerar.classList.remove("disabled:opacity-50")
    btnGenerar.classList.remove("cursor-not-allowed")
    table.innerHTML = "";
    chart.classList.add("hidden");
    divButtons.classList.add("hidden");
    menu.classList.add('h-screen');
    menu.classList.remove('min-h-full');
    document.querySelector('#chart').innerHTML = '<canvas id="myChart"></canvas>'
    x0 = ''
    x1 = ''
    modalCloseNuevo()
    
})


/////////////////////////////////////////////

//Modal

const modal = document.querySelector('.main-modal');
const closeButton = document.querySelectorAll('.modal-close');

const modalClose = () => 
{
	modal.classList.remove('fadeIn');
	modal.classList.add('fadeOut');
	setTimeout(() => {
		modal.style.display = 'none';
	}, 500);
}

const openModal = () => 
{
	modal.classList.remove('fadeOut');
	modal.classList.add('fadeIn');
	modal.style.display = 'flex';
}

for (let i = 0; i < closeButton.length; i++) {

    const elements = closeButton[i];

    elements.onclick = (e) => modalClose();

    modal.style.display = 'none';

    window.onclick = function (event) {
        if (event.target == modal) modalClose();
    }
}


//Modal CSV

const modalCsv = document.querySelector('.main-modal-csv');
const cancelButton = document.querySelectorAll('.modal-close-csv');

const modalCloseCsv = () => 
{
	modalCsv.classList.remove('fadeIn');
	modalCsv.classList.add('fadeOut');
	setTimeout(() => {
		modalCsv.style.display = 'none';
	}, 500);
}

const openModalCsv = () => 
{
	modalCsv.classList.remove('fadeOut');
	modalCsv.classList.add('fadeIn');
	modalCsv.style.display = 'flex';
}

for (let i = 0; i < cancelButton.length; i++) {

    const elements = cancelButton[i];

    elements.onclick = (e) => modalCloseCsv();

    modal.style.display = 'none';

    window.onclick = function (event) {
        if (event.target == modalCsv) modalCloseCsv();
    }
}

//Modal Nuevo
const modalNuevo = document.querySelector('.main-modal-nuevo');
const cancelNuevoButton = document.querySelectorAll('.modal-close-nuevo');

const modalCloseNuevo = () => 
{
	modalNuevo.classList.remove('fadeIn');
	modalNuevo.classList.add('fadeOut');
	setTimeout(() => {
		modalNuevo.style.display = 'none';
	}, 500);
}

const openModalNuevo = () => 
{
	modalNuevo.classList.remove('fadeOut');
	modalNuevo.classList.add('fadeIn');
	modalNuevo.style.display = 'flex';
}

for (let i = 0; i < cancelNuevoButton.length; i++) {

    const elements = cancelNuevoButton[i];

    elements.onclick = (e) => modalCloseNuevo();

    modal.style.display = 'none';

    window.onclick = function (event) {
        if (event.target == modalNuevo) modalCloseNuevo();
    }
}
