import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { instalarEventosDoQuadro } from "./renderizacao.js";

let tarefasAtuais = [];

function aplicarFiltros(form, quadro) {
    const busca = form.querySelector("#busca-titulo").value.toLowerCase().trim();
    const statusFiltro = form.querySelector('input[name="filtro-status"]:checked')?.value || "todos";
    const prioridadeFiltro = form.querySelector('input[name="filtro-prioridade"]:checked')?.value || "todas";

    const tarefasFiltradas = tarefasAtuais.filter((tarefa) => {
        const bateuTitulo = tarefa.titulo.toLowerCase().includes(busca);
        const bateuStatus = statusFiltro === "todos" || tarefa.status === statusFiltro;
        const bateuPrioridade = prioridadeFiltro === "todas" || tarefa.prioridade.toLowerCase() === prioridadeFiltro.toLowerCase();

        return bateuTitulo && bateuStatus && bateuPrioridade;
    });

    if (tarefasFiltradas.length === 0) {
        renderizarEstado("vazio", null, quadro);
    } else {
        renderizarEstado("sucesso", tarefasFiltradas, quadro);
    }
}

function instalarEventosDeFiltro(quadro) {
    const form = document.querySelector("form");
    if (!form) return;

    // Impede o recarregamento da página ao enviar o formulário
    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        aplicarFiltros(form, quadro);
    });

    // Filtra instantaneamente ao digitar ou trocar os botões radio
    form.addEventListener("input", () => aplicarFiltros(form, quadro));
    form.addEventListener("change", () => aplicarFiltros(form, quadro));
}

async function inicializarAplicacao() {
    const quadro = document.querySelector('section[aria-labelledby="titulo-quadro"]');

    if (quadro) {
        instalarEventosDoQuadro(quadro, () => tarefasAtuais);
    }

    instalarEventosDeFiltro(quadro);
    renderizarEstado("carregando", null, quadro);

    try {
        const tarefas = await carregarTarefas("./dados.json");
        tarefasAtuais = tarefas;

        if (!Array.isArray(tarefas) || tarefas.length === 0) {
            renderizarEstado("vazio", null, quadro);
        } else {
            renderizarEstado("sucesso", tarefas, quadro);
        }
    } catch (erro) {
        let mensagemErro = "Ocorreu uma falha inesperada.";

        if (erro.name === "TypeError") {
            mensagemErro = "Falha de rede: Verifique sua conexão ou a disponibilidade do servidor.";
        } else if (erro.name === "SyntaxError") {
            mensagemErro = "Erro de formato: O arquivo JSON contém um erro de sintaxe.";
        } else if (erro.message) {
            mensagemErro = erro.message;
        }

        renderizarEstado("erro", mensagemErro, quadro);
    }
}

document.addEventListener("DOMContentLoaded", inicializarAplicacao);