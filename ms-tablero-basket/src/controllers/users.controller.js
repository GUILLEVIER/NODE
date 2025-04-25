const Users = require("../schema/users.schema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

const authUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        errors: errors.array(),
        CodeResult: STATUS_CODES.INVALID,
        message: "",
      });
    }
    const { email, password } = req.body;
    let user = await Users.findOne({ email });
    if (!user) {
      return res.json({
        errors: [],
        message: "El usuario no existe.",
        CodeResult: STATUS_CODES.INVALID,
        user: {},
        token: "",
      });
    }
    const successPassword = await bcrypt.compareSync(password, user.password);
    if (!successPassword) {
      return res.json({
        errors: [],
        message: "La contraseña es incorrecta.",
        CodeResult: STATUS_CODES.INVALID,
        user: {},
        token: "",
      });
    }
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET_PASS,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({
          errors: [],
          message: "",
          CodeResult: STATUS_CODES.SUCCESS,
          user,
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [],
      message: "Error al iniciar sesión.",
      CodeResult: STATUS_CODES.ERROR,
      user: {},
      token: "",
    });
  }
};

const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        errors: errors.array(),
        CodeResult: STATUS_CODES.INVALID,
        message: "",
      });
    }
    const { email, password } = req.body;
    let user = await Users.findOne({ email });
    if (user) {
      return res.status(200).json({
        errors: [],
        CodeResult: STATUS_CODES.INVALID,
        message: "Usuario ya existe.",
      });
    }
    user = new Users(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return res.status(200).json({
      errors: [],
      CodeResult: STATUS_CODES.SUCCESS,
      message: "Usuario agregado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [],
      CodeResult: STATUS_CODES.ERROR,
      message: "Error al añadir usuario.",
    });
  }
};

const getUsers = async (_, res) => {
  try {
    const users = await Users.find();
    return res.status(200).json({
      message: "Usuarios",
      users,
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener usuarios.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(200).json({
        message: "Usuario no existe.",
        user,
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    return res.status(200).json({
      message: "User",
      user,
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener usuario.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .json({ errors: errors.array(), CodeResult: STATUS_CODES.INVALID });
    }
    const { username, password, email } = req.body;
    let user = await Users.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(200).json({
        message: "Usuario no existe.",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.username = username.toLowerCase();
    user.password = await bcrypt.hash(password, salt);
    user.email = email;
    await user.save();
    return res.status(200).json({
      message: "Usuario actualizado.",
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al actualizar usuario.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(200).json({
        message: "Usuario no existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    await Users.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Usuario eliminado correctamente.",
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al eliminar usuario.",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

module.exports = {
  authUser,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
