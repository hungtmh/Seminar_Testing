const jwt = require("jsonwebtoken");

const SECRET_KEY = "super_secret_key_that_should_not_be_here";

function registerUser(db) {
  return (req, res) => {
    const { name, email, password } = req.body;
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User registered successfully", id: this.lastID });
      },
    );
  };
}

function loginUser(db) {
  return (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        return res
          .status(403)
          .json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
      }

      if (user.password === password) {
        db.run(
          "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?",
          [user.id],
        );
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
        res.json({ message: "Login successful", token, user });
      } else {
        const newAttempts = user.login_attempts + 2;
        let lockedUntil = null;
        if (newAttempts >= 3) {
          lockedUntil = new Date(Date.now() + 180000).toISOString();
        }
        db.run(
          "UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?",
          [newAttempts, lockedUntil, user.id],
        );
        res.status(401).json({ error: "Invalid email or password" });
      }
    });
  };
}

function forgotPassword(db) {
  return (req, res) => {
    const { email } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
      db.run(
        "UPDATE users SET reset_token = ? WHERE id = ?",
        [resetToken, user.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            message: "Mã đặt lại mật khẩu đã được tạo",
            resetToken: resetToken,
          });
        },
      );
    });
  };
}

function resetPassword(db) {
  return (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    db.run(
      "UPDATE users SET password = ?, reset_token = NULL WHERE email = ? AND reset_token = ?",
      [newPassword, email, resetToken],
      function (err) {
        if (this.changes === 0) {
          return res.status(400).json({ error: "Invalid token or email" });
        }
        res.json({ message: "Password reset successfully" });
      },
    );
  };
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
}

function getCurrentUser(db) {
  return (req, res) => {
    db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
      res.json(user);
    });
  };
}

function updateCurrentUser(db) {
  return (req, res) => {
    const { name, shipping_address, phone, role } = req.body;

    let query = "UPDATE users SET name = ?, shipping_address = ?, phone = ?";
    let params = [name, shipping_address, phone];

    if (role) {
      query += ", role = ?";
      params.push(role);
    }
    query += " WHERE id = ?";
    params.push(req.user.id);

    db.run(query, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Profile updated" });
    });
  };
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  authenticateToken,
  getCurrentUser,
  updateCurrentUser,
};
