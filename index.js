const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");


const app = express();

const {secretKey} = require('./secretKey')

const { verificarCredenciales, obtenerDatosUsuario, registrarUsuario} = require('./consultas')
const { verificarCredencial, verificarToken, reporteConsulta } = require('./middlewares')

app.use(cors())
app.use(express.json())


app.post("/usuarios", verificarCredencial, reporteConsulta,  async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})


app.get("/usuarios", verificarToken, reporteConsulta, async (req, res) => {
    try {
        const token = req.header("Authorization").split("Bearer ")[1]
        const { email } = jwt.decode(token)
        const usuario = await obtenerDatosUsuario(email)
        res.json(usuario)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})


app.post("/login", reporteConsulta, async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, secretKey)
        res.send(token)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

   })


   app.listen(3000, console.log("SERVER ON"))