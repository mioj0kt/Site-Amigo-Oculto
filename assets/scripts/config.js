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


// Associando botão de adicionar
document.addEventListener("DOMContentLoaded", function () {
    const adicionarNomeBtn = document.getElementById("adicionarNomeBtn");
    if (adicionarNomeBtn) {
        adicionarNomeBtn.addEventListener("click", adicionarNome);
    }
    carregarNomes();
});


function adicionarNome() {
    const nomeInput = document.getElementById('nomeInput');
    const mensagem = document.getElementById('mensagem');
    const nome = nomeInput.value.trim();

    if (!nome) {
        mensagem.textContent = "Por favor, insira um nome válido.";
        mensagem.style.color = "red";
        return;
    }

    const nomesRef = ref(db, "nomes");
    const novoNomeRef = push(nomesRef);

    set(novoNomeRef, nome)
        .then(() => {
            mensagem.textContent = "Nome adicionado com sucesso!";
            mensagem.style.color = "green";
            nomeInput.value = "";
            carregarNomes();
        })
        .catch(error => {
            console.error("Erro ao adicionar nome:", error);
            mensagem.textContent = "Erro ao adicionar nome.";
            mensagem.style.color = "red";
        });
}

function carregarNomes() {
    const nomesRef = ref(db, "nomes");
    get(nomesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const listaNomes = snapshot.val();
            const ul = document.getElementById("listaNomes");
            ul.innerHTML = "";

            Object.keys(listaNomes).forEach((key) => {
                const li = document.createElement("li");
                li.innerText = listaNomes[key];

                // Botão remover para cada nome
                const botaoRemover = document.createElement("button");
                botaoRemover.innerText = "Remover";
                botaoRemover.classList.add("remover");
                botaoRemover.onclick = () => removerNome(key);

                li.appendChild(botaoRemover);
                ul.appendChild(li);
            });
        }
    });
}

function removerNome(id) {
    const nomeRef = ref(db, "nomes/" + id);
    remove(nomeRef).then(() => {
        document.getElementById("mensagem").textContent = "Nome removido com sucesso!";
        document.getElementById("mensagem").style.color = "green";
        carregarNomes();
    }).catch(error => {
        document.getElementById("mensagem").textContent = "Erro ao remover nome.";
        document.getElementById("mensagem").style.color = "red";
    });
}

window.onload = carregarNomes;