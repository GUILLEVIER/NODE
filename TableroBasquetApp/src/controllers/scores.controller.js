const Score = require("../schema/scores.schema");
const { validationResult } = require("express-validator");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

const addScore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        errors: errors.array(),
        CodeResult: STATUS_CODES.INVALID,
        message: "",
      });
    }
    const score = new Score(req.body);
    await score.save();
    return res.status(200).json({
      errors: [],
      CodeResult: STATUS_CODES.SUCCESS,
      message: "Marcador agregado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [],
      CodeResult: STATUS_CODES.ERROR,
      message: "Error al añadir marcador.",
    });
  }
};

const getScores = async (_, res) => {
  try {
    const scores = await Score.find();
    return res.status(200).json({
      message: "Marcadores",
      scores,
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      scores: [],
      CodeResult: STATUS_CODES.ERROR,
      message: "Error al obtener marcadores.",
    });
  }
};

const getScoresCreatedBy = async (req, res) => {
  try {
    let scoresDb = await Score.find();
    let arrayScores = [];
    for (let i = 0; i < scoresDb.length; i++) {
      if (
        scoresDb[i].createdBy.replace(/\s/g, "") ===
        req.params.createdBy.replace(/\s/g, "")
      )
        arrayScores.push(scoresDb[i]);
    }
    return res.status(200).json({
      message: "Marcadores",
      scores: arrayScores,
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      scores: [],
      message: "Error al obtener marcadores.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

const updateScore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .json({ errors: errors.array(), CodeResult: STATUS_CODES.INVALID });
    }
    const {
      scoreHome,
      scoreVisit,
      foulsHome,
      foulsVisit,
      timeoutsHome,
      timeoutsVisit,
      period,
      dateCreation,
      createdBy,
    } = req.body;
    let score = await Score.findOne({ _id: req.params.id });
    if (!score) {
      return res.status(200).json({
        message: "Marcador no existe.",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    score.scoreHome = scoreHome;
    score.scoreVisit = scoreVisit;
    score.foulsHome = foulsHome;
    score.foulsVisit = foulsVisit;
    score.timeoutsHome = timeoutsHome;
    score.timeoutsVisit = timeoutsVisit;
    score.period = period;
    score.dateCreation = dateCreation;
    score.createdBy = createdBy;
    await score.save();
    return res.status(200).json({
      message: "Marcador actualizado.",
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al modificar marcador.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

const deleteScore = async (req, res) => {
  try {
    const score = await Score.findOne({ _id: req.params.id });
    if (!score) {
      return res.status(200).json({
        message: "Marcador no existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    await Score.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Marcador eliminado correctamente.",
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al eliminar marcador.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

module.exports = {
  addScore,
  getScores,
  getScoresCreatedBy,
  updateScore,
  deleteScore,
};
