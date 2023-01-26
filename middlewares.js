const jwt = require("jsonwebtoken")
const { secretKey } = require("./secretKey")


const verificarCredencial = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      res
        .status(401)
        .send({ message: "No se recibieron las credenciales en esta consulta" })
    }
    next()
  }

const verificarToken = (req, res, next) => {

		const token = req.header("Authorization").split("Bearer ")[1]
		if(!token) throw {code: 401, message: "Debe incluir el token en la cabecera"}

    const tokenValido = jwt.verify(token, secretKey)
    if(!tokenValido) throw {code: 401, message: "El token es inválido"}
		next()
}
  

const reporteConsulta = async(req, res, next) => {
  const url = req.url;
  console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    `);
  next();
};
   

module.exports = { verificarCredencial, reporteConsulta, verificarToken };