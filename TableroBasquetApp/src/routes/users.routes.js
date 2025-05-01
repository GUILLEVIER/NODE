const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const {
  authUser,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const router = Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No autorizado",
      error: true,
    });
  }
  jwt.verify(token, process.env.SECRET_PASS, (err, resp) => {
    if (err) {
      return res.status(403).json({
        message: "Token expirado",
        error: true,
      });
    }
    req.user = resp.user;
    next();
  });
};

const validUser = [
  check("email", "Se debe ingresar correo").not().isEmpty(),
  check("username", "Se debe ingresar usuario.").not().isEmpty(),
  check("password", "Se debe ingresar contraseña.").not().isEmpty(),
];

const validateLogin = [
  check("email", "Se debe ingresar correo").not().isEmpty(),
  check("password", "Se debe ingresar contraseña.").not().isEmpty(),
];

router.post("/login", validateLogin, authUser);
router.post("/add", validUser, addUser);
router.get("/", authenticateToken, getUsers);
router.get("/:id", authenticateToken, getUserById);
router.patch("/:id", authenticateToken, validUser, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;
