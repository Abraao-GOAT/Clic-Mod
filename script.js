let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

let roupas = JSON.parse(localStorage.getItem("roupasClicMod")) || [
  {
    nome: "Jaqueta jeans",
    tamanho: "M",
    estado: "Ótimo",
    tipo: "Venda",
    preco: 45,
    descricao: "Jaqueta em bom estado, pouco usada.",
    imagem: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80"
  },
  {
    nome: "Camisa social",
    tamanho: "G",
    estado: "Bom",
    tipo: "Troca",
    preco: 0,
    descricao: "Aceito troca por camiseta casual.",
    imagem: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    nome: "Vestido floral",
    tamanho: "P",
    estado: "Ótimo",
    tipo: "Doação",
    preco: 0,
    descricao: "Vestido para doação, bem conservado.",
    imagem: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
  }
];

function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });

  document.getElementById(id).classList.add("ativa");

  if (id === "feed") {
    renderizarRoupas();
  }

  if (id === "perfil") {
    atualizarPerfil();
  }
}

function cadastrar() {
  const nome = document.getElementById("cadNome").value.trim();
  const email = document.getElementById("cadEmail").value.trim();
  const senha = document.getElementById("cadSenha").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuario = { nome, email, senha, pontos: 0 };
  localStorage.setItem("usuarioClicMod", JSON.stringify(usuario));
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  usuarioLogado = usuario;

  alert("Conta criada com sucesso!");
  mostrarTela("feed");
}

function entrar() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();

  const usuario = JSON.parse(localStorage.getItem("usuarioClicMod"));

  if (!usuario) {
    alert("Nenhuma conta cadastrada. Crie uma conta primeiro.");
    return;
  }

  if (usuario.email === email && usuario.senha === senha) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    usuarioLogado = usuario;
    alert("Login realizado com sucesso!");
    mostrarTela("feed");
  } else {
    alert("E-mail ou senha incorretos.");
  }
}

function renderizarRoupas() {
  const lista = document.getElementById("listaRoupas");
  const busca = document.getElementById("busca").value.toLowerCase();
  const filtroTipo = document.getElementById("filtroTipo").value;

  lista.innerHTML = "";

  const roupasFiltradas = roupas.filter(roupa => {
    const combinaBusca = roupa.nome.toLowerCase().includes(busca) || roupa.descricao.toLowerCase().includes(busca);
    const combinaTipo = filtroTipo === "" || roupa.tipo === filtroTipo;
    return combinaBusca && combinaTipo;
  });

  if (roupasFiltradas.length === 0) {
    lista.innerHTML = "<p>Nenhuma roupa encontrada.</p>";
    return;
  }

  roupasFiltradas.forEach((roupa, index) => {
    const card = document.createElement("div");
    card.className = "card-roupa";

    const precoTexto = roupa.tipo === "Venda" ? `R$ ${Number(roupa.preco).toFixed(2)}` : roupa.tipo;

    card.innerHTML = `
      <img src="${roupa.imagem}" alt="${roupa.nome}">
      <div class="info-roupa">
        <span class="badge">${roupa.tipo}</span>
        <h3>${roupa.nome}</h3>
        <p><strong>Tamanho:</strong> ${roupa.tamanho}</p>
        <p><strong>Estado:</strong> ${roupa.estado}</p>
        <p>${roupa.descricao}</p>
        <p class="preco">${precoTexto}</p>
        <button class="btn-principal" onclick="tenhoInteresse(${index})">Tenho interesse</button>
      </div>
    `;

    lista.appendChild(card);
  });
}

function publicarRoupa() {
  const nome = document.getElementById("nomeRoupa").value.trim();
  const tamanho = document.getElementById("tamanhoRoupa").value;
  const estado = document.getElementById("estadoRoupa").value;
  const tipo = document.getElementById("tipoRoupa").value;
  const preco = document.getElementById("precoRoupa").value || 0;
  const descricao = document.getElementById("descRoupa").value.trim();
  const foto = document.getElementById("fotoRoupa").files[0];

  if (!nome || !tamanho || !estado || !descricao) {
    alert("Preencha os campos principais da roupa.");
    return;
  }

  if (tipo === "Venda" && Number(preco) <= 0) {
    alert("Para venda, informe um preço maior que zero.");
    return;
  }

  if (foto) {
    const leitor = new FileReader();
    leitor.onload = function(evento) {
      salvarRoupa(nome, tamanho, estado, tipo, preco, descricao, evento.target.result);
    };
    leitor.readAsDataURL(foto);
  } else {
    salvarRoupa(
      nome,
      tamanho,
      estado,
      tipo,
      preco,
      descricao,
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80"
    );
  }
}

function salvarRoupa(nome, tamanho, estado, tipo, preco, descricao, imagem) {
  const novaRoupa = {
    nome,
    tamanho,
    estado,
    tipo,
    preco: Number(preco),
    descricao,
    imagem
  };

  roupas.unshift(novaRoupa);
  localStorage.setItem("roupasClicMod", JSON.stringify(roupas));

  if (usuarioLogado) {
    usuarioLogado.pontos = (usuarioLogado.pontos || 0) + 10;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    localStorage.setItem("usuarioClicMod", JSON.stringify(usuarioLogado));
  }

  limparFormularioRoupa();

  alert("Roupa publicada com sucesso! Você ganhou 10 pontos sustentáveis.");
  mostrarTela("feed");
}

function limparFormularioRoupa() {
  document.getElementById("fotoRoupa").value = "";
  document.getElementById("nomeRoupa").value = "";
  document.getElementById("tamanhoRoupa").value = "";
  document.getElementById("estadoRoupa").value = "";
  document.getElementById("tipoRoupa").value = "Venda";
  document.getElementById("precoRoupa").value = "";
  document.getElementById("descRoupa").value = "";
}

function tenhoInteresse(index) {
  const roupa = roupas[index];
  alert(`Interesse registrado em: ${roupa.nome}\nEm uma versão futura, isso abriria o chat com o vendedor.`);
}

function atualizarPerfil() {
  const nome = document.getElementById("perfilNome");
  const pontos = document.getElementById("pontos");

  if (usuarioLogado) {
    nome.textContent = usuarioLogado.nome;
    pontos.textContent = usuarioLogado.pontos || 0;
  } else {
    nome.textContent = "Visitante";
    pontos.textContent = "0";
  }
}

renderizarRoupas();
atualizarPerfil();
