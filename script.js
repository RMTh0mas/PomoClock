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