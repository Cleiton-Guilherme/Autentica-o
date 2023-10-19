const express = require ("express");
const connectToDatabase = require("./database/database");
const authService = require("./service/auth.service");
const app = express();
const jwt = require("jsonwebtoken");

connectToDatabase();

const port = 3000;
const segredo = "123456789";

app. use(express.json());

app.get("/", (req,res) =>{
    console.log(token());
    res.send("Hello World");
});

app.post("/login", async (req,res) => {
try{
    const { email, senha } = req.body;
    const user = await authService.loginService(email);

    if(!user){
       return res.status(400).send({ message: "Usuario não encontrado, tente novamente"});
    }

    if(senha != user.senha){
        return res.status(400).send({ message: "Senha inválida"});
    }

    user.token = token();
    await authService.updateToken(user);
    console.log(user);

    const token = authService.generateToken({user}, segredo);
    res.status(200).send({
        user,
        token
    });
    }catch(err){
    console.log(`erro : $ {err}`);
  }
});

app.post("/validar", async (req,res) => {
    const {email, token} = req.body;

    const user = await authService.loginService(email);

    if(!user){
        return res.status(400).send({message: "Usuario não encontrado, tente novemente "});
    }

    if(token != user.token){
        return res.status(400).send({message: "token incorreto ou expirado, tente novamente"});
    }

    user.token = "";
    await authService.updateToken(user);

    res.status(200).send(user);
});

const token = function(){
    let token = Math.random().toString(36).substring(2);
    return token;
}

app.get("/teste-token", (req,res) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({ message: "O token não foi informado!"});
    }

    const parts = authHeader.split(" ");

    if(parts.lenght != 2){
        return  res.status(401).send({ message: "token inválido!"});
    }

    const [scheme , token] = parts;

    if(!/^Bearer$/i.test(scheme)) {
    return  res.status(401).send({ message: "token malformatado!"});
    }

    jwt.verify(token, segredo,(err, decoded) => {

        if(err){
            console.log(`erro: ${err}`);
            return res.status(500).send({ message: "Erro interno, tente novemente"});
        }
        console.log(decode);
        res.send(decoded);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
