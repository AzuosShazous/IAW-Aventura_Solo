let passos = {
  1: {
    text: `Bem-vindo ao "Shadow of the Colossus Simulator", um mini simulador de SotC. Nesta estória, tu és um herói, (ou melhor, um vilão) em busca de derrotar gigantes colossos para ressuscitar a sua amada. `,
    choices: [
      { text: "Iniciar a aventura", next: 2 },
    ],
  },
  2: {
    text: `Você está diante do primeiro colosso chamado Valus, um minotauro que acopla consigo uma espécie de bastão. Você deseja `,
    choices: [
      { text: "escalar o colosso", next: 3 },
      { text: "observar o ambiente", next: 4 },
    ],
  },
  3: {
    text: `Você escala o colosso, mas ele balança muito. Você deseja `,
    choices: [
      { text: "segurar mais forte", next: 5 },
      { text: "soltar-se da pelagem do colosso", next: 6 },
    ],
  },
  4: {
    text: `Ao observar ao redor, você nota que o colosso está se aproximando. Você deseja `,
    choices: [
      { text: "correr pela arena", next: 7 },
      { text: "atirar uma flecha na sua perna", next: 10 },
    ],
  },
  5: {
    text: `Você agarrou fortemente e não caiu do colosso. Diante disso, você escala ainda mais o colosso e encontra o ponto vital na cabeça da criatura. Você deseja `,
    choices: [
      { text: "atacar seu ponto fraco", next: 9 },
      { text: "esperar um pouco mais para atacar", next: 8 },
    ],
  },
  6: {
    text: `Você soltou-se, mas morreu por queda. Fim de jogo.`,
    end: true,
  },
  7: {
    text: `Na realidade, você tentou correr, mas o colosso te acertou com o seu bastão. Infelizmente, você foi morto. Tente escolher ações melhores.`,
    end: true,
  },
  8: {
    text: `Você esperou um pouco, entretanto o colosso balançou muito, derrubou você e pisou em cima de ti. Infelizmente, a sua jogatina não foi boa.`,
    end: true,
  },
  9: {
    text: `Você atacou o ponto fraco do colosso e matou-o. Parabéns! Espere pelos próximos colossos. `,
    end: true,
  },
  10: {
    text: `Você atirou a flecha na perna do colosso e o derrubou. Você deseja `,
    choices: [
      { text: "avançar e escalar a criatura colossal", next: 11 },
      { text: "esperar para avançar", next: 12 },
    ], 
  },
  11: {
    text: `Você avançou, mas o colosso deu-te um soco. Infelizmente, fim de game. `,
    end: true,
  },
  12: {
    text: `Você esperou um tempo, todavia o colosso arremessou bastão, que te acertou e matou-te facilmente. Parece que suas escolhas estão péssimas. `,
    end: true,
  },
}


let chave_progresso = "shadow_colossus_progress"
let chave_path = "shadow_colossus_path"


const carregarProgresso = () => {
  let progress = localStorage.getItem(chave_progresso)
  return progress !== null ? parseInt(progress, 10) : 1
}

const salvarProgresso = (step) => localStorage.setItem(chave_progresso, step)

const carregarPath = () => JSON.parse(localStorage.getItem(chave_path)) || []
const salvaPath = (path) => localStorage.setItem(chave_path, JSON.stringify(path))


const atualizarURL = (step) => {
  let params = new URLSearchParams(window.location.search)
  params.set("step", step)
  window.history.pushState({ step }, "", `${window.location.pathname}?${params}`)
}


const renderizarStep = (step) => {
  let story = document.getElementById("story")
  story.textContent = ""

  
  if (!passos[step] || step <= 0) {
    let mensagem_erro = document.createElement("p")
    mensagem_erro.textContent = "O passo selecionado é inválido. Por favor, volte ao passo anterior."
    story.appendChild(mensagem_erro)

    let reinit_link = document.createElement("a")
    reinit_link.href = "#"
    reinit_link.id = "restart"
    reinit_link.textContent = "Voltar ao último passo válido"
    story.appendChild(reinit_link)

    reinit_link.addEventListener("click", (event) => {
      event.preventDefault()
      let ultimo_step = carregarProgresso()
      renderizarStep(ultimo_step)
      atualizarURL(ultimo_step)
    })

    return
  }

  const atual_step = passos[step]
  const path = carregarPath()


  if (step !== 1) {
    if (path.length >= step) {
      path.splice(step - 1)
    }
  }

  
  const paragrafo_texto = document.createElement("p")
  let texto_base = document.createTextNode(atual_step.text)
  paragrafo_texto.appendChild(texto_base)

  
  if (atual_step.choices) {
    atual_step.choices.forEach(({ text, next }, index) => {
      const link = document.createElement("a")
      link.href = "#"
      link.textContent = text

      link.addEventListener("click", (event) => {
        event.preventDefault()

        if (next <= 0 || !passos[next]) {
          renderizarStep(0)
          return
        }

        if (step !== 1) {
          path.push(text)
          salvaPath(path)
        }

        salvarProgresso(next)
        atualizarURL(next)
        renderizarStep(next)
      })

      paragrafo_texto.appendChild(link)

      
      if (index < atual_step.choices.length - 1) {
        paragrafo_texto.appendChild(document.createTextNode(" ou "))
      } else {
        paragrafo_texto.appendChild(document.createTextNode("."))
      }
    })
  }

  story.appendChild(paragrafo_texto)

  
  if (atual_step.end) {
    let paragrafo_path = document.createElement("p")
    paragrafo_path.textContent = `Você seguiu este caminho: ${path.join(" → ")}`
    story.appendChild(paragrafo_path)

    let reinit_link = document.createElement("a")
    reinit_link.href = "#"
    reinit_link.id = "restart"
    reinit_link.textContent = "Recomeçar a aventura"
    story.appendChild(reinit_link)

    reinit_link.addEventListener("click", (event) => {
      event.preventDefault()
      localStorage.removeItem(chave_progresso)
      localStorage.removeItem(chave_path)
      atualizarURL(1)
      renderizarStep(1)
    })
  }
}


const init = () => {
  let titulo = document.createElement("h1")
  titulo.textContent = "Shadow of the Colossus Simulator"
  document.getElementById("container").prepend(titulo)

  let params = new URLSearchParams(window.location.search)
  let step = params.has("step") ? parseInt(params.get("step"), 10) : carregarProgresso()

  if (step === 0) {
    renderizarStep(0)
  } else if (!params.has("step")) {
    atualizarURL(step)
  }

  renderizarStep(step)
}


window.addEventListener("popstate", (event) => {
  let step = event.state && typeof event.state.step === "number" ? event.state.step : 1

  let path = carregarPath()
  if (path.length > 0) {
    path.pop()
    salvaPath(path)
  }

  renderizarStep(step)
})

window.addEventListener("load", init)