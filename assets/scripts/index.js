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
    const adicionarNomeBtn = document.getElementById("sortearBtn");
    if (sortearBtn) {
        sortearBtn.addEventListener("click", sortearNome);
    }
});


function removerNome(id) {
    const nomeRef = ref(db, "nomes/" + id);
    remove(nomeRef).then(() => {
        document.getElementById("mensagem").textContent = "Nome removido com sucesso!";
    });
}

function sortearNome() {
    const nomesRef = ref(db, "nomes");

    get(nomesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const listaNomes = snapshot.val();
            const chaves = Object.keys(listaNomes);

            if (chaves.length === 0) {
                document.getElementById("mensagem").textContent = "Não há nomes para sortear.";
                return;
            }

            // Sortear um nome aleatório
            const chaveSorteada = chaves[Math.floor(Math.random() * chaves.length)];
            const nomeSorteado = listaNomes[chaveSorteada];

            // Exibir o nome sorteado na tela
            const mensagem = document.getElementById("sorteado");
            mensagem.innerHTML = `<p id="nomeSort">O nome sorteado foi: <span style="font-size: 40px; text-decoration: underline;">${nomeSorteado}</span></p>`

            // Remover o nome sorteado do banco de dados
            removerNome(chaveSorteada);
        }
    }).catch(error => {
        console.error("Erro ao sortear nome:", error);
        document.getElementById("mensagem").textContent = "Erro ao sortear nome.";
    });
}