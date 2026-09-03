export async function carregarTarefas(url = "./dados.json") {
    const resposta = await fetch(url);
    
    if (!resposta.ok) {
        throw new Error(`Erro de protocolo (${resposta.status}): Não foi possível carregar os dados.`);
    }

    const documento = await resposta.json();
    return documento.tarefas;
}