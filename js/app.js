
//Variables
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
let tweets = []

//event listeners
eventListeners();

function eventListeners() {
    //cuando el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    //cuando el documento está listo
    document.addEventListener('DOMContentLoaded', () =>{
        //cuando el documento esté listo, me trae los tweets
        //y como son strings, los convierto en objetos(arreglo) con jsonparse
        //o si el arreglo esta vacio con || y un arreglo vacio []
        //entonces si hay tweets en el local storage, los convierto a objeto con parse
        //pero sino, entrego un objeto vacio
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];

        //crearhtml solo se ejecuta si hay algo en el arreglo,
        //sino solo me sincroniza el localstorage
        crearHTML();
        //si tweets tiene algo de antes al cargar el documento,
        //manda a llamar crearhtml y se cargan los tweets del localstorage
        //al documento
    })
}

//funciones

function agregarTweet(e) {
    e.preventDefault();
    //text area donde el usuario escribe
    //declaramos la variable tweet llamando el valor del textarea
    const tweet = document.querySelector('#tweet').value;
    //validar que hayan escrito algo
    if(tweet === ''){
        mostrarError('no puede ir vacio');
        //hacemos return para prevenir que se siga ejecutando este if
        return; 
    }
    //añadir al arreglo de tweets
    //le ponemos datenow para distinguir un tweet de otro por su fecha
    const tweetObj = {
        id: Date.now(),
        tweet: tweet
    }
    //con el spread operator (...) tomamos una copia de los tweets
    //y le agregamos el tweet actual, lo que el usuario escriba
    tweets = [...tweets, tweetObj]
    //una vez agregado, creamos el html
    crearHTML();
    //reiniciamos el formulario para que quede en blanco 
    //para que el usuario pueda volver a escribir
    formulario.reset();  
}

//mostrar mensaje de error
//la funcion toma un error
function mostrarError(error) {
    //creamos la variable mensajeError, que es un parrafo
    const mensajeError = document.createElement('p')
    //le colocamos texto al mensaje de error
    mensajeError.textContent = error;
    mensajeError.classList.add('error');
    //insertamos el mensaje de error en el html
    //al div contenido le agregamos el hijo mensajeerror
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);
    //hacemos settimeout para quitar el mensaje de error despues de un tiempo
    setTimeout(() => {
        mensajeError.remove()
    }, 3000);
}


//mostrar un listado de los tweets

function crearHTML(){
    limpiarHTML();
    //si tweets es mayor a 0, es decir tiene algo escrito
    if(tweets.length > 0){
        tweets.forEach(tweet => {
            //agregar boton para eliminar
            //creo la variable btneliminar, que sera un enlace (a)
            //y le agregamos classlist que ya esta en el custom.css
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            //creamos el texto de la X
            btnEliminar.innerText = 'X'
            //añadir funcion de eliminar al boton
            //como vamos a tener que pasarle parametros(cada nuevo
            //tweet, lo hacemos con arrowfunction)
            btnEliminar.onclick = () => {
                //le pasamos como parametro el id de cada tweet
                borrarTweet(tweet.id);
            }

            //creamos el html
            //creamos la variable li, donde ira cada tweet
            const li = document.createElement('li');
            //añadimos el texto
            li.innerText = tweet.tweet;

            //asignar el boton de cerrar a cada tweet
            li.appendChild(btnEliminar);


            //insertar en el html
            listaTweets.appendChild(li);
            
        });
    }
    sincronizarStorage();
}

//agregar los tweets actuales al localstorage
function sincronizarStorage(){
    //como tweets es un arreglo, lo tenemos que stringify 
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

//eliminar un tweet
function borrarTweet(id){
    //filter me crea un nuevo id. iteramos sobre cada tweet, 
    //y buscamos que el tweet.id sea diferente al id que le pasamos
    //porque si cierro uno, quiero que el nuevo arreglo se cree con el 
    //que no sea borrado
    //con esto nos filtrara todos los tweets excepto al que le dimos click
    //porque mostrara los que no tengan la misma id que el que borramos
    tweets = tweets.filter( tweet => tweet.id !== id);

    //y llamo a crearhtml para que vuelva a iterar sobre tweets
    //y me refresque la informacion de mi html
    crearHTML();

}
//limpiar el html
function limpiarHTML() {
    //si listatweets tiene algo de firstchild, lo quitamos
    while(listaTweets.firstChild){
        listaTweets.removeChild(listaTweets.firstChild);
    }
}