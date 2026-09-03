export function criarCartao(tarefa) {
    const cartao = document.createElement("article");
    cartao.className = "cartao";
    cartao.dataset.tarefaId = tarefa.id;

    const titulo = document.createElement("h3");
    titulo.textContent = tarefa.titulo;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.acao = "ver-detalhes";

    const span = document.createElement("span");
    span.textContent = "Ver detalhes";
    botao.append(span);

    cartao.append(titulo, botao);
    return cartao;
}

export function renderizarTarefas(tarefas, quadro) {
    if (!quadro) return;

    const statusList = ["a-fazer", "em-andamento", "em-revisao", "concluida"];

    statusList.forEach(status => {
        const colunaUl = quadro.querySelector(`[data-lista-status="${status}"]`);
        if (!colunaUl) return;

        const tarefasFiltradas = tarefas.filter(t => t.status === status);
        const cartoes = tarefasFiltradas.map(criarCartao);

        colunaUl.replaceChildren(...cartoes);
    });
}

export function instalarEventosDoQuadro(quadro, obterTarefas) {
    quadro.addEventListener("click", (evento) => {
        if (!(evento.target instanceof Element)) return;

        const botao = evento.target.closest('button[data-acao="ver-detalhes"]');
        if (!botao || !quadro.contains(botao)) return;

        const cartao = botao.closest("[data-tarefa-id]");
        const listaTarefas = obterTarefas();
        const tarefa = listaTarefas.find((item) => String(item.id) === cartao?.dataset.tarefaId);

        if (!tarefa) return;
        console.log("Detalhes da tarefa:", tarefa);
    });
}