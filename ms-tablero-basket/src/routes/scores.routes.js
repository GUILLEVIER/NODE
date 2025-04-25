const { Router } = require("express");
const { check } = require("express-validator");
const {
  addScore,
  getScores,
  getScoresCreatedBy,
  updateScore,
  deleteScore,
} = require("../controllers/scores.controller");
const jwt = require("jsonwebtoken");

const router = Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Se debe ingresar token",
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

const validScore = [
  check("homeTeam", "Se debe ingresar nombre de local").not().isEmpty(),
  check("visitTeam", "Se debe ingresar nombre de visita").not().isEmpty(),
  check("scoreHome", "Se debe ingresar marcador de local").not().isEmpty(),
  check("scoreVisit", "Se debe ingresar marcador de visita").not().isEmpty(),
  check("foulsHome", "Se debe ingresar faltas de local").not().isEmpty(),
  check("foulsVisit", "Se debe ingresar faltas de visita").not().isEmpty(),
  check("timeoutsHome", "Se debe ingresar tiempos de espera de local")
    .not()
    .isEmpty(),
  check("timeoutsVisit", "Se debe ingresar tiempos de espera de visita")
    .not()
    .isEmpty(),
  check("period", "Se debe ingresar periodo").not().isEmpty(),
  check("dateCreation", "Se debe ingresar fecha de creación").not().isEmpty(),
  check("createdBy", "Se debe ingresar creador").not().isEmpty(),
];

router.post("/add", authenticateToken, validScore, addScore);
router.get("/", authenticateToken, getScores);
router.get("/:createdBy", authenticateToken, getScoresCreatedBy);
router.patch("/:id", authenticateToken, validScore, updateScore);
router.delete("/:id", authenticateToken, deleteScore);

module.exports = router;
