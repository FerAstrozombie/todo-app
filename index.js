const nuevaTareaInput = document.querySelector("#nuevaTarea input");
const divTareas = document.querySelector("#tareas");
let borrarTareas, editarTareas, tareas;
let actualizarTarea = "";
let count;

window.onload = () => {
    actualizarTarea = "";
    count= Object.keys(localStorage).length;
    mostrarTareas();
}

const mostrarTareas = () => {
    if (Object.keys(localStorage).length > 0) {
        divTareas.style.display = "inline-block" 
    } else {
        divTareas.style.display = "none"
    }

    divTareas.innerHTML = "";

    let tareas = Object.keys(localStorage);
    tareas = tareas.sort();

    for(let key of tareas){
        let classValue = "";
        let value = localStorage.getItem(key);
        let tareasInnerDiv = document.createElement("div");
        tareasInnerDiv.classList.add("tarea");
        tareasInnerDiv.setAttribute("id", key);
        tareasInnerDiv.innerHTML = `<span id = "nombreTarea"> ${key.split("_")[1]}</span>`;
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("editar");
        botonEditar.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        if(!JSON.parse(value)){
            botonEditar.style.visibility = "visible"
        }else{
            botonEditar.style.visibility = "hidden";
            tareasInnerDiv.classList.add("completado");
        }
        tareasInnerDiv.appendChild(botonEditar);
        tareasInnerDiv.innerHTML += `<button class ="borrar"><i class="fa-solid fa-trash-can"></i></button>`
        divTareas.appendChild(tareasInnerDiv);
    }
    tareas = document.querySelectorAll(".tarea")
    tareas.forEach((element, index) =>{
        element.onclick = () =>{
            if(element.classList.contains("completado")){
                updateStorage(element.id.split("_")[0], element.innerText, false)
            }else{
                updateStorage(element.id.split("_")[0], element.innerText, true)
            }
        }
    })

    editarTareas = document.getElementsByClassName("editar");
    Array.from(editarTareas).forEach((element, index) =>{
        element.addEventListener("click", (e) =>{
            e.stopPropagation();
            disableButtons(true);
            let parent = element.parentElement;
            nuevaTareaInput.value = parent.querySelector("#nombreTarea").innerText;
            actualizarTarea = parent.id;
            parent.remove();
        })
    });

    borrarTareas = document.getElementsByClassName("borrar");
    Array.from(borrarTareas).forEach((element, index) =>{
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            let parent = element.parentElement;
            eliminarTarea(parent.id);
            parent.remove();
            count -= 1;
        })
    })
};

const disableButtons = (bool) => {
    let editarBotones = document.getElementsByClassName("editar");
    Array.from(editarBotones).forEach(element => {
        element.disabled = bool;
    });
}

const eliminarTarea = (valorTarea) => {
    localStorage.removeItem(valorTarea);
    mostrarTareas();
}

const updateStorage = (index, valorTarea, completado) => {
    localStorage.setItem(`${index}_${valorTarea}`, completado);
    mostrarTareas();
}

document.querySelector("#enviar").addEventListener("click", () => {
    disableButtons(false);
    if(nuevaTareaInput.value.length == 0){
        Swal.fire({
            icon: 'warning',
            text: 'Por favor ingresa una tarea',
        })
    }else{
        if(actualizarTarea == ""){
            updateStorage(count, nuevaTareaInput.value, false)
        }else{
            let existingCount = actualizarTarea.split("_")[0];
            eliminarTarea(actualizarTarea);
            updateStorage(existingCount, nuevaTareaInput.value, false);
            actualizarTarea = "";
        }
        count +=1;
        nuevaTareaInput.value = "";
    }
});