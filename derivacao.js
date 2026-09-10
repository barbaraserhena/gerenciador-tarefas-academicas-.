import { obterTarefasVisiveis } from "./derivacao.js";

export function criarCartao(tarefa) {
    const article = document.createElement("article");
    article.className = "cartao";
    article.dataset.tarefaId = tarefa.id;

    const titulo = document.createElement("h4");
    titulo.textContent = tarefa.titulo;

    const detalhes = document.createElement("p");
    detalhes.textContent = `Prioridade: ${tarefa.prioridade.toUpperCase()} | Prazo: ${tarefa.prazo}`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.acao = "ver-detalhes";

    const span = document.createElement("span");
    span.textContent = "Ver Detalhes";
    botao.appendChild(span);

    article.append(titulo, detalhes, botao);
    return article;
}

export function atualizarInterface(estado) {
    const regiaoStatus = document.getElementById("regiao-status");
    const quadro = document.querySelector("[data-quadro]");
    if (!regiaoStatus || !quadro) return;

    // Trata carregando e erro de rede/JSON
    if (estado.carregando) {
        regiaoStatus.textContent = "Carregando tarefas, aguarde...";
        return;
    }

    if (estado.erro) {
        regiaoStatus.textContent = `Erro ao carregar dados: ${estado.erro}`;
        return;
    }

    if (estado.tarefas.length === 0) {
        regiaoStatus.textContent = "Nenhuma tarefa cadastrada no arquivo de dados.";
        renderizarColunas([], quadro);
        return;
    }

    // Deriva a lista e atualiza contagens
    const visiveis = obterTarefasVisiveis(estado);
    const totalOriginal = estado.tarefas.length;
    const totalVisiveis = visiveis.length;

    if (totalVisiveis === 0) {
        regiaoStatus.textContent = "Nenhuma tarefa encontrada para os filtros aplicados.";
    } else {
        regiaoStatus.textContent = `Exibindo ${totalVisiveis} de ${totalOriginal} tarefa(s).`;
    }

    renderizarColunas(visiveis, quadro);
}

function renderizarColunas(tarefasVisiveis, quadro) {
    const colunas = quadro.querySelectorAll("[data-lista-status]");

    colunas.forEach(coluna => {
        const statusColuna = coluna.dataset.listaStatus;
        const tarefasDaColuna = tarefasVisiveis.filter(t => t.status === statusColuna);
        const novosCartoes = tarefasDaColuna.map(criarCartao);

        // Substituição limpa com replaceChildren
        coluna.replaceChildren(...novosCartoes);
    });
}

export function instalarEventosQuadro(quadro, estado) {
    // Evento delegado único instalado no ancestral fixo
    quadro.addEventListener("click", (evento) => {
        if (!(evento.target instanceof Element)) return;

        const botao = evento.target.closest('button[data-acao="ver-detalhes"]');
        if (!botao || !quadro.contains(botao)) return;

        const cartao = botao.closest("[data-tarefa-id]");
        const id = cartao?.dataset.tarefaId;
        const tarefa = estado.tarefas.find(item => item.id === id);

        if (tarefa) {
            console.log("Tarefa clicada:", tarefa);
        }
    });
}
