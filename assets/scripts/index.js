//============================== Firebase ===================================//

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCi-KJx8uy7d65R1qEDzp9SVlB6C7J-_T8",
    authDomain: "amigooculto-ec51f.firebaseapp.com",
    databaseURL: "https://amigooculto-ec51f-default-rtdb.firebaseio.com",
    projectId: "amigooculto-ec51f",
    storageBucket: "amigooculto-ec51f.appspot.com",
    messagingSenderId: "146272948107",
    appId: "1:146272948107:web:1a8611350ea5719300a98e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//===========================================================================//


// Associando botão de sortear
document.addEventListener("DOMContentLoaded", function () {
    const sortearBtn = document.getElementById("sortearBtn"); // Corrigido de adicionarNomeBtn para sortearBtn
    if (sortearBtn) {
        sortearBtn.addEventListener("click", sortearNome);
    }
});


function removerNome(id) {
    const nomeRef = ref(db, "nomes/" + id);
    // Remove o nome, mas não exibe mensagem de sucesso para não sobrescrever o nome sorteado
    return remove(nomeRef); 
}

// Função para adicionar o nome novamente no banco de dados
function adicionarNomeNovamente(nome) {
    const nomesRef = ref(db, "nomes");
    const novoNomeRef = push(nomesRef);
    return set(novoNomeRef, nome);
}

// Função para sortear novamente caso o usuário tenha tirado ele mesmo
function sortearNovamente(chaveAntiga, nomeAntigo) {
    // 1. Recoloca o nome antigo no banco de dados
    adicionarNomeNovamente(nomeAntigo)
        .then(() => {
            // 2. Realiza um novo sorteio
            document.getElementById("mensagem").textContent = "Nome recolocado. Sorteando novamente...";
            document.getElementById("sorteado").innerHTML = ""; // Limpa o nome anterior
            sortearNome();
        })
        .catch(error => {
            console.error("Erro ao recolocar nome:", error);
            document.getElementById("mensagem").textContent = "Erro ao tentar sortear novamente.";
        });
}


function sortearNome() {
    const nomesRef = ref(db, "nomes");

    get(nomesRef).then((snapshot) => {
        const mensagemGeral = document.getElementById("mensagem");
        const sorteadoDiv = document.getElementById("sorteado");
        
        // Limpa a mensagem e o botão de sorteio anterior
        mensagemGeral.textContent = "";
        sorteadoDiv.innerHTML = "";


        if (snapshot.exists()) {
            const listaNomes = snapshot.val();
            const chaves = Object.keys(listaNomes);

            if (chaves.length === 0) {
                mensagemGeral.textContent = "Não há nomes para sortear.";
                return;
            }

            // Sortear um nome aleatório
            const chaveSorteada = chaves[Math.floor(Math.random() * chaves.length)];
            const nomeSorteado = listaNomes[chaveSorteada];

            // Exibir o nome sorteado na tela
            sorteadoDiv.innerHTML = `<p id="nomeSort">Seu nome sorteado foi: <span style="font-size: 40px; text-decoration: underline;">${nomeSorteado}</span></p>
                                     <p style="margin-top: 15px;">Tirou você mesmo?</p>
                                     <button id="sortearNovamenteBtn" class="sortear-novamente-btn">Sim</button>`;

            // 1. Remove o nome sorteado do banco de dados (o processo de 'recolocar' será feito se o usuário clicar em 'Sim')
            removerNome(chaveSorteada)
                .then(() => {
                    // 2. Adiciona o listener para o botão "Sim" *após* a remoção ser iniciada
                    const sortearNovamenteBtn = document.getElementById("sortearNovamenteBtn");
                    if (sortearNovamenteBtn) {
                        sortearNovamenteBtn.addEventListener("click", () => sortearNovamente(chaveSorteada, nomeSorteado));
                    }
                })
                .catch(error => {
                    console.error("Erro ao remover nome sorteado:", error);
                    mensagemGeral.textContent = "Erro ao sortear nome e remover temporariamente.";
                });

        } else {
            mensagemGeral.textContent = "Não há nomes para sortear.";
        }
    }).catch(error => {
        console.error("Erro ao sortear nome:", error);
        document.getElementById("mensagem").textContent = "Erro ao sortear nome.";
    });
}