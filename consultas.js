const bcrypt = require('bcryptjs')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    allowExitOnIdle: true,
})


const registrarUsuario = async (user) => {
  let { email, password, rol, lenguage } = user;
  const query = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
  const encryptedPassword = bcrypt.hashSync(password);
  password = encryptedPassword;
  const values = [email, encryptedPassword, rol, lenguage];
  await pool.query(query, values);
};


  const obtenerDatosUsuario = async(email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
   
    if (!rowCount) {
      throw { code: 401, message: "Email incorrecto" }
    }
      delete usuario.password
      return usuario
  }  

  const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)

    if (!passwordEsCorrecta || !rowCount)
      throw { code: 401, message: "Email o contraseña incorrecta" }
}



module.exports = { registrarUsuario, obtenerDatosUsuario, verificarCredenciales }
