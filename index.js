let grid, pontuacao, jogoIniciado

document.getElementById('novo-jogo').addEventListener('click', iniciarJogo)
document.getElementById('tente-novamente').addEventListener('click', iniciarJogo)

document.addEventListener('keydown', lidarComEntrada)

function iniciarJogo() {
    grid = criarGradeVazia()
    pontuacao = 0
    jogoIniciado = false
    atualizarPontuacao()
    adicionarTileAleatorio()
    adicionarTileAleatorio()
    desenharGrade()
    esconderMensagemFimDeJogo()
}

function criarGradeVazia() {
    return [...Array(4)].map(() => Array(4).fill(0))
}

function adicionarTileAleatorio() {
    let tilesVazios = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0)
                tilesVazios.push({ i, j })
        }
    }
    if (tilesVazios.length) {
        let { i, j } = tilesVazios[Math.floor(Math.random() * tilesVazios.length)]

        grid[i][j] = Math.random() > 0.9 ? 4 : 2
    }
}

function desenharGrade() {
    const containerGrade = document.getElementById('grid')

    containerGrade.innerHTML = ''

    grid.forEach((linha, i) => {
        linha.forEach((valor, j) => {
            let tile = document.createElement('div');
            tile.className = 'tile' + (valor ? ` tile-${valor}` : '')
            tile.textContent = valor || ''
            containerGrade.appendChild(tile)
        })
    })

    if (jogoAcabou()) {
        mostrarMensagemFimDeJogo()
    }
}

function lidarComEntrada(e) {
    if (jogoAcabou())
        return

    let tecla = e.key

    if (tecla === 'ArrowUp' || tecla === 'ArrowDown' || tecla === 'ArrowLeft' || tecla === 'ArrowRight') {

        if (!jogoIniciado) {
            jogoIniciado = true
        }

        let gradeAntiga = JSON.stringify(grid)

        moverTiles(tecla)
        fundirTiles(tecla)
        moverTiles(tecla)

        if (gradeAntiga !== JSON.stringify(grid)) {
            adicionarTileAleatorio()
        }

        desenharGrade()
        atualizarPontuacao()
    }
}

function moverTiles(direcao) {
    let eVertical = direcao === 'ArrowUp' || direcao === 'ArrowDown'
    let eParaFrente = direcao === 'ArrowRight' || direcao === 'ArrowDown'

    for (let i = 0; i < 4; i++) {
        let linha = [];
        for (let j = 0; j < 4; j++) {
            let celula = eVertical ? grid[j][i] : grid[i][j]
            if (celula) linha.push(celula)
        }

        let faltando = 4 - linha.length
        let zeros = Array(faltando).fill(0)
        linha = eParaFrente ? zeros.concat(linha) : linha.concat(zeros)

        for (let j = 0; j < 4; j++) {
            if (eVertical) {
                grid[j][i] = linha[j]
            } else {
                grid[i][j] = linha[j]
            }
        }
    }
}

function fundirTiles(direcao) {
    let eVertical = direcao === 'ArrowUp' || direcao === 'ArrowDown'
    let eParaFrente = direcao === 'ArrowRight' || direcao === 'ArrowDown'

    for (let i = 0; i < 4; i++) {
        for (let j = eParaFrente ? 3 : 0; eParaFrente ? j > 0 : j < 3; eParaFrente ? j-- : j++) {
            let atual = eVertical ? grid[j][i] : grid[i][j];
            let proximo = eVertical ? grid[eParaFrente ? j - 1 : j + 1][i] : grid[i][eParaFrente ? j - 1 : j + 1];
            if (atual !== 0 && atual === proximo) {
                let tileFundido = atual * 2;
                eVertical ? grid[j][i] = tileFundido : grid[i][j] = tileFundido;
                eVertical ? grid[eParaFrente ? j - 1 : j + 1][i] = 0 : grid[i][eParaFrente ? j - 1 : j + 1] = 0;
                pontuacao += tileFundido
                break;
            }
        }
    }
}

function atualizarPontuacao() {
    document.querySelector('#pontuacao > span').textContent = pontuacao
}

function jogoAcabou() {
    return gradeCheia() && !podeFazerMovimento()
}

function gradeCheia() {
    return grid.every(linha => linha.every(celula => celula !== 0))
}

function podeFazerMovimento() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let valor = grid[i][j]

            if (valor !== 0) {
                if (i < 3 && valor === grid[i + 1][j]) return true;
                if (j < 3 && valor === grid[i][j + 1]) return true;
            }
        }
    }
    return false
}

function mostrarMensagemFimDeJogo() {
    const mensagemFimDeJogo = document.getElementById('fim-de-jogo')
    mensagemFimDeJogo.style.cssText = 'display: block; '
}

function esconderMensagemFimDeJogo() {
    const mensagemFimDeJogo = document.getElementById('fim-de-jogo')
    mensagemFimDeJogo.style.cssText = 'display: none; '
    iniciarJogo()
}

iniciarJogo()