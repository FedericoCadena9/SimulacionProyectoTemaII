let x0;
let x1;
let i;
let myChart;
let data = [];
let arreglo_i = [];
let arreglo_xi = [];
let arreglo_ui = [];
let ope1 = [];
let ope2 = [];
let ope3 = [];
let ope4 = [];
let ope5 = [];
var parametros = [];
var Dcritico = 0;
var mayor =0;
var solucion = "";
modalText =document.getElementById("modalText")
let nuevo = document.getElementById("btnModalNuevo");
let titulo = document.getElementById("mensaje");
let tabla= '';
let chart = document.getElementById("chart");

function crearTabla(data){
  var todasFilas = data.split(/\r?\n|\r/);
  console.log(todasFilas.length);
  if(todasFilas.length > 200){
    openModal();
    titulo.innerHTML =`${"Recuerda..."}`
    modalText.innerHTML = `${"La prueba Kolmogorov solo permite trabajar hasta con 200 datos. Elige otro archivo."}`;
    document.getElementById("archivo").value = "";
  }else{
  tabla = '<table class="min-w-full bg-white">';
  for (let fila = 0; fila < todasFilas.length; fila++) {
    if (fila === 0) {
      tabla += '<thead class="text-000000 bg-gray-800">';
      tabla += '<tr class="bg-gray-100">';
    } else {
      tabla += '<tr>';
    }
    const celdasFila = todasFilas[fila].split(',');
    for (let rowCell = 0; rowCell < celdasFila.length; rowCell++) {
      if (fila === 0) {
        tabla += '<th class="w-1/3 px-4 py-3 text-sm font-semibold text-center">';
        tabla += celdasFila[rowCell];
        tabla += '</th>';
      } else {
        tabla += '<td class="w-1/3 px-4 py-3 text-center">';
        tabla += celdasFila[rowCell];
        tabla += '</td>';
      }
    }
    if (fila === 0) {
      tabla += '</tr>';
      tabla += '</thead>';
      tabla += '<tbody class="text-gray-700">';
    } else {
      tabla += '</tr>';
    }
  } 
  tabla += '</tbody>';
  tabla += '</table>';
  document.querySelector('#tablaGenerada').innerHTML = tabla;
  }
}
   
const botonEjecutar = document.querySelector('#btnEjecutar');

botonEjecutar.onclick = function(){
  let content = document.querySelector("#content")
  content.classList.remove("hidden");
  $("table tbody tr","#tablaGenerada").each(function(i,e){
    var tr = [];
    $(this).find("td").each(function(){
      var td = {};
      td = $(this).text();
      tr.push(td);
    });
    parametros.push(tr);    
  });

  chart.classList.remove("hidden");

  leerArreglo();
  ordenarArregloUi();
  datosObject();
  operacionesArreglo();
  numeroMayor();
  nConfianza();
  resolucion();
  tablaPrueba();
  openModal();
  titulo.innerHTML =`${"Proceso concluido"}`
  modalText.innerHTML = `${solucion}`
}

function leerArreglo(valor,indice){
  for(var i=0; i<parametros.length; i++){
    for(var j=0; j<parametros.length; j++){
      if(j == 0){
        arreglo_i.push(parseFloat(parametros[i][j]));
      }else if(j == 1){
        arreglo_xi.push(parseFloat(parametros[i][j]).toFixed(4)); 
        parseFloat(arreglo_xi);
      }else if(j == 2){
        arreglo_ui.push(parseFloat(parametros[i][j]).toFixed(4));
        
      }
    }
  }
  console.log(arreglo_i)
}

function operacionesArreglo(){
  let totalDatos = parametros.length;
  for(var i=0; i<parametros.length; i++){
    ope1.push(((arreglo_i[i])/totalDatos).toFixed(4));//i/n
    ope2.push((ope1[i]-(arreglo_ui[i])).toFixed(4));//(i/n)-ui
    ope3.push((arreglo_i[i]-1).toFixed(4));//i-1
    ope4.push((ope3[i]/totalDatos).toFixed(4));//(i-1)/n
    ope5.push((arreglo_ui[i]-((arreglo_i[i]-1)/totalDatos)).toFixed(4));//ui´-((i-1)/un)
  }
}
 
function tablaPrueba(){
  let datos= new Array ('i','ui´','i/n','(i/n)-ui´','i-1','(i-1)/n','ui´-((i-1)/n)');
   tabla = '<table class="min-w-full bg-white">';
  for (let fila = 0; fila < parametros.length + 1; fila++) {
    if (fila === 0) {
      tabla += '<thead class="text-000000 bg-gray-800">';
      tabla += '<tr class="bg-gray-100">';
    } else {
      tabla += '<tr>';
    }
    for (let rowCell = 0; rowCell < datos.length; rowCell++) {
      if (fila === 0) {
        tabla += '<th class="w-1/3 px-4 py-3 text-sm font-semibold text-center">';
        if(rowCell == 0){
          tabla += datos[0]
        }else if(rowCell == 1){
          tabla += datos[1]
        }else if(rowCell == 2){
          tabla += datos[2]
        }else if(rowCell == 3){
          tabla += datos[3]
        }else if(rowCell == 4){
          tabla += datos[4]
        }else if(rowCell == 5){
          tabla += datos[5]
        }else if(rowCell == 6){
          tabla += datos[6]   
        }     
        tabla += '</th>';
      }else {
        tabla += '<td class="w-1/3 px-4 py-3 text-center">';
        if(rowCell == 0){
        tabla += arreglo_i[fila-1]
        }else if(rowCell == 1){
          tabla += parseFloat(arreglo_ui[fila-1])
        }else if(rowCell ==2){
          tabla += parseFloat(ope1[fila-1])
        }else if(rowCell ==3){
          tabla += parseFloat(ope2[fila-1])
        }else if(rowCell ==4){
          tabla += parseFloat(ope3[fila-1])
        }else if(rowCell == 5){
          tabla += parseFloat(ope4[fila-1])
        }else if(rowCell == 6){
          tabla += parseFloat(ope5[fila-1])
        }
        tabla += '</td>';
      }
    }
    if (fila === 0) {
      tabla += '</tr>';
      tabla += '</thead>';
      tabla += '<tbody class="text-gray-700">';
    } else {
      tabla += '</tr>';
    }
  } 
  tabla += '</tbody>';
  tabla += '</table>';
  document.querySelector('#tablaGenerada2').innerHTML = tabla;
}
   
function leerArchivo(evt){
  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.onload = (e) =>{
    crearTabla(e.target.result)
  };
  reader.readAsText(file);
}
document.querySelector('#archivo').addEventListener('change', leerArchivo ,false);

function ordenarArregloUi(){
  arreglo_ui.sort();
}

function numeroMayor(){
  var max1 = Math.max.apply(null, ope2);
  var max2 = Math.max.apply(null, ope5);

  for (var i = 0; i < ope2.length; i++) {
    if (ope2[i] > max1){
      max1 = ope2[i];
    }
  }
  for (var i = 0; i < ope5.length; i++) {
    if (ope5[i] > max2){
      max2 = ope5[i];
    }
  }
  document.querySelector('#dMas').value = max1;
  document.querySelector('#dMenos').value = max2;

  var numMax = [max1, max2];
  for(i = 0; i < 2; i++){
    if (numMax[i] > mayor){
      mayor = numMax[i];
    }
}
  document.querySelector('#d').value = mayor;
}

function resolucion(){
  document.querySelector('#d2').value = mayor;
  document.querySelector('#dValorCritico').value = Dcritico;
  if( mayor > Dcritico ){
    document.querySelector('#operador').value = '  > ';
    solucion ="\t\tSe acepta la hipótesis nula.\nEl conjunto presenta uniformidad en el intervalo [0,1].";
    document.getElementById('validar').innerHTML = solucion;
  }else{
    document.querySelector('#operador').value = '  < ';
    solucion ="\t\tSe rechaza la hipótesis nula.\nEl conjunto no presenta uniformidad en el intervalo [0,1].";
    document.getElementById('validar').innerHTML = solucion;
  }
}

function nConfianza(){
  if(document.querySelector('#radioNoventa').checked == true){
    Dcritico = 0.1928
  } if(document.querySelector('#radioNoventayCinco').checked == true){
    Dcritico = 0.2150
  } if(document.querySelector('#radioNoventayNueve').checked == true){
    Dcritico = 0.2577
  }
}

function datosObject(){
  for(var i=0; i<arreglo_i.length; i++){
    datoi = arreglo_i[i];
    ui= arreglo_ui[i];
    data[i] = {
    datoi: i + 1,
    ui: ui
    }
  }
  let n = data.map(function(elem){
        return elem.datoi
    })
    //Mapeo de array para Ui
    let pseudo = data.map(function(elem){
        return elem.ui
    })

//Generación de Gráfico con CHartJS
    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: n, // n es la variable que ocupamos, estos serán nuestros indicadores en la gráfica
            datasets: [{
                label: 'Numeros psuedoaleatorios (Ui)',
                data: pseudo, //pseudo son los elementos que se graficarán en la gráfica.
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

// Boton Nuevo para abrir Modal
let btnNuevo = document.querySelector("#btnNuevo")
btnNuevo.addEventListener('click', () => {
    openModalNuevo()
})

//Botón Nuevo para limpiar datos
nuevo.addEventListener('click', () => {
  document.getElementById("d2").value = "";
  document.getElementById("dValorCritico").value = "";
  document.getElementById("operador").value = "";
  document.getElementById("dMenos").value = "";
  document.getElementById("dMas").value = "";
  document.getElementById("archivo").value = "";
  document.getElementById("validar").value = "";
  document.getElementById("d").value = "";
  document.querySelector('#tablaGenerada').innerHTML = "";
  document.querySelector('#tablaGenerada2').innerHTML = "";
  document.getElementById("radioNoventa").checked =false;
  document.getElementById("radioNoventayCinco").checked =false;
  document.getElementById("radioNoventayNueve").checked = false;
  document.querySelector('#tablaGenerada').innerHTML= "";
  let content = document.getElementById("content").classList.add("hidden");
  arreglo_i.length=0;
  arreglo_xi.length=0;
  arreglo_ui.length=0;
  ope1.length=0;
  ope2.length=0;
  ope3.length=0;
  ope4.length=0;
  ope5.length=0;
  parametros = [];
  datoi=0;
  ui=0;
  data=[]
  Dcritico=0;
  mayor = 0;
  chart.classList.add("hidden");
  document.querySelector('#chart').innerHTML = '<canvas id="myChart"></canvas>'
  modalCloseNuevo()
})

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