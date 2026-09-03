import { renderizarTarefas } from "./renderizacao.js";

export function renderizarEstado(estado, dados = null, quadro = null) {
    const regiaoStatus = document.getElementById("regiao-status");
    if (!regiaoStatus) return;

    regiaoStatus.textContent = "";
    regiaoStatus.className = "regiao-status";

    switch (estado) {
        case "carregando":
            regiaoStatus.textContent = "Carregando tarefas, aguarde...";
            regiaoStatus.classList.add("status-carregando");
            if (quadro) quadro.style.display = "none";
            break;

        case "sucesso":
            const quantidade = Array.isArray(dados) ? dados.length : 0;
            regiaoStatus.textContent = `Sucesso: ${quantidade} tarefa(s) carregada(s).`;
            regiaoStatus.classList.add("status-sucesso");
            if (quadro) quadro.style.display = "";
            renderizarTarefas(dados, quadro);
            break;

        case "vazio":
            regiaoStatus.textContent = "Nenhuma tarefa encontrada no quadro.";
            regiaoStatus.classList.add("status-vazio");
            if (quadro) quadro.style.display = "none";
            renderizarTarefas([], quadro);
            break;

        case "erro":
            regiaoStatus.textContent = `Erro: ${dados}`;
            regiaoStatus.classList.add("status-erro");
            if (quadro) quadro.style.display = "none";
            renderizarTarefas([], quadro);
            break;
    }
}