const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Cadastrar = require("./database/Cadastrar");
const multer = require('multer');

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();  // Armazenar os arquivos em memória
const upload = multer({ storage: storage });

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o BD feita com sucesso!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

//configuração do EJS
app.set('view engine', 'ejs');


// Configuração do Express
app.use(express.static('public'));  // Arquivos estáticos (como imagens)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get("/", (req, res) => {
    Cadastrar.findAll({ raw: true, order: [["id", 'DESC']] })
        .then(cadastra => {
            res.render("index", { cadastra: cadastra });
        });
});

app.get("/cadastrar", (req, res) => {
    res.render("cadastrar");
});

// Rota para salvar o cadastro com imagem
app.post("/salvarcadastro", upload.single('imagem'), (req, res) => {
    const nome = req.body.nome;
    const descricao = req.body.descricao;
    const preco = req.body.preco;
    const imagem = req.file ? req.file.buffer : null;  // Pega o arquivo da imagem

    Cadastrar.create({
        nome: nome,
        descricao: descricao,
        preco: preco,
        imagem: imagem  // Armazenando o conteúdo binário da imagem no banco de dados
    }).then(() => {
        res.redirect("/");
    }).catch((error) => {
        console.log(error);
        res.status(500).send("Erro ao salvar o cadastro");
    });
});


app.get("/produto/:id", (req, res) => {
    const id = req.params.id;

    // Buscar o produto no banco de dados usando o ID
    Cadastrar.findByPk(id).then(produto => {
        if (produto) {
            res.render("produto", { produto: produto });
        } else {
            res.status(404).send("Produto não encontrado");
        }
    }).catch(error => {
        console.log(error);
        res.status(500).send("Erro ao buscar produto");
    });
});

app.get('/images/:id', (req, res) => {
    const id = req.params.id;

    // Buscar o produto pelo ID
    Cadastrar.findByPk(id).then(produto => {
        if (produto && produto.imagem) {
            res.contentType('image/jpeg');  // ou o tipo adequado dependendo da imagem
            res.send(produto.imagem);  // Envia a imagem como resposta
        } else {
            res.status(404).send("Imagem não encontrada");
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send("Erro ao carregar a imagem");
    });
});

// Rota para deletar o produto
app.post("/deletar/:id", (req, res) => {
    const id = req.params.id;

    // Encontrar o produto pelo ID e deletá-lo
    Cadastrar.destroy({
        where: { id: id }
    }).then(() => {
        res.redirect("/");  // Redireciona de volta para a página inicial após a exclusão
    }).catch((error) => {
        console.log(error);
        res.status(500).send("Erro ao deletar o produto");
    });
});

// Iniciar o servidor
app.listen(4000, () => {
    console.log("App rodando na porta 4000");
});