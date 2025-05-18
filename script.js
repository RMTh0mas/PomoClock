const html = document.querySelector('html');
const btFoco = document.querySelector('.app__card-button--foco');
const btCurto = document.querySelector('.app__card-button--curto');
const btLongo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const startPauseBt = document.querySelector('#start-pause');
const playAudio = new Audio('/sons/play.wav');
const pauseAudio = new Audio('/sons/pause.mp3');
const beepAudio = new Audio('/sons/beep.mp3');
const textStartPauseBt = document.querySelector('#start-pause > span');
const tempoNaTela = document.querySelector('#timer');
const startPauseImg = document.querySelector('.app__card-primary-butto-icon')
const imagem = document.querySelector('.app__logo-image');

let tempoDecorridoEmSegundos = 1500
let intervaloId = null 

musica.loop = true

btFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500
    alterarContexto('foco')
    btFoco.classList.add('active')
})

btCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    alterarContexto('descanso-curto')
    btCurto.classList.add('active')
})

btLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-longo')
    btLongo.classList.add('active')
})

musicaFocoInput.addEventListener('click', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function(contexto) {
        contexto.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Hora de focar<br>
                <strong class="app__title-strong">Você consegue! 😉</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Bora dar uma respirada? 😮‍💨<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora do cafézinho ☕<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
        default:
            break;
    }
    
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos == 0) {
        beepAudio.play()
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if(intervaloId) {
        if (!musica.paused) {
            musica.pause()
            musicaFocoInput.checked = false
        }
        startPauseImg.setAttribute('src', '/imagens/play_arrow.png')
        textStartPauseBt.textContent = "Começar"
        pauseAudio.play()
        zerar()
        return
    }
    startPauseImg.setAttribute('src', '/imagens/pause.png')
    playAudio.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    textStartPauseBt.textContent = "Pausar"
    if (html.getAttribute("data-contexto") === "foco") {
        titulo.innerHTML = `
        Hora de focar<br>
            <strong class="app__title-strong">Você consegue! 😉</strong>
        `
    }
}

function zerar() {
    clearInterval(intervaloId)
    intervaloId = null
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos*1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('taskButton');
const lista = document.querySelector('.app__task-list');
const MAX_LENGTH = 50;

if (!input || !addBtn || !lista) {
    console.error('Elementos não encontrados no DOM.');
}

document.addEventListener('DOMContentLoaded', loadTasks);
addBtn.addEventListener('click', () => {
    if (addBtn && input) adicionarTarefa();
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') adicionarTarefa();
  });

  
lista.addEventListener('click', handleListClick);

function saveToStorage(tasks) {
    if (!tasks || !Array.isArray(tasks)) {
        console.error('Invalid tasks array.');
        return;
    }
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to storage:', error);
    }
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    saved.forEach(task => renderTask(task));
}

function adicionarTarefa() {
    if (!input || !lista) {
        console.error('Elementos não encontrados no DOM.');
        return;
    }

    const taskText = input.value.trim();

    if (taskText.length > MAX_LENGTH) {
        return alert(`Tarefa muito longa! Use até ${MAX_LENGTH} caracteres.`);
    }

    try {
        const task = { id: Date.now(), text: taskText, completed: false };
        renderTask(task);

        // salva no storage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        saveToStorage(tasks);
        input.value = '';
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
}

function renderTask({ id, text, completed }) {
    if (!id || !text) {
        console.error('Error: Invalid task object:', { id, text, completed });
        return;
    }

    const li = document.createElement('li');
    li.dataset.id = id;
    li.classList.add('app__task-item');
    if (completed) li.classList.add('completed');

    try {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.dataset.action = 'toggle';
        const span = document.createElement('span');
        span.textContent = text;

        label.className = 'checkbox-label';
        label.append(checkbox, span);

        const div = document.createElement('div');
        const editBtn = document.createElement('button');
        editBtn.textContent = ' ';
        editBtn.className = 'edit';
        editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editBtn.dataset.action = 'edit';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = ' ';
        removeBtn.className = 'remove';
        removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
        removeBtn.dataset.action = 'remove';
        div.className = 'task-actions';
        div.append(editBtn, removeBtn);

        li.append(label, div);
        lista.appendChild(li);
    } catch (error) {
        console.error('Erro ao renderizar tarefa:', error);
    }
}

function handleListClick(e) {
    if (!e || !e.target || !e.target.dataset || !e.target.dataset.action) return;

    const action = e.target.dataset.action;
    const li = e.target.closest('li');
    if (!li) {
        console.error('Erro ao encontrar o elemento <li> pai.');
        return;
    }

    const id = Number(li.dataset.id);
    if (isNaN(id)) {
        console.error('Erro ao converter o id para um número.');
        return;
    }

    let tasks;
    try {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    } catch (error) {
        console.error('Erro ao carregar tarefas do armazenamento:', error);
        tasks = [];
    }

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        console.error('Erro ao encontrar a tarefa com o id:', id);
        return;
    }

    switch (action) {
        case 'toggle':
            tasks[index].completed = e.target.checked;
            li.classList.toggle('completed');
            break;

        case 'edit': {
            const span = li.querySelector('label > span');
            if (!span) {
                console.error('Erro ao encontrar o elemento <span> dentro do <li>.');
                return;
            }

            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.className = 'edit-input';
            input.style.width = (span.offsetWidth + 20) + 'px';

            // Substitui o span pelo input
            span.parentNode.replaceChild(input, span);

            // Força o navegador a re-renderizar o input
            input.style.display = 'none';
            setTimeout(() => {
                input.style.display = 'block';
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }, 0);

            // Função de finalização
            function finish(save) {
                if (save) {
                    const newText = input.value.trim() || span.textContent;
                    span.textContent = newText;
                    tasks[index].text = newText;
                    saveToStorage(tasks);
                }
                if (input.parentNode) {
                    input.parentNode.replaceChild(span, input);
                }
            }

            // Evento blur
            input.addEventListener('blur', () => finish(true));

            // Evento keydown
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') finish(true);
                if (e.key === 'Escape') finish(false);
            });
            break;
        }

        case 'remove': {
            // Remove a tarefa do array de tarefas
            tasks.splice(index, 1);

            // Atualiza o armazenamento local
            saveToStorage(tasks);

            // Remove o elemento <li> correspondente do DOM
            li.remove();
            break;
        }
    }

    saveToStorage(tasks);
}

