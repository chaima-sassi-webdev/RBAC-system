const User = require("../models/User");
const Activity = require("../models/Activity");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const transporter = require("../config/mailer");

let resetTokens = {};
// ================= CREATE USER =================

exports.createUser = async (req, res) => {

  try {
    const { name, email, password, role } = req.body;

    // Vérifier email
    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "Email déjà utilisé",
      });

    }

    // Vérifier super-admin
    if (role === "super_admin") {

      const superAdminExists = await User.findOne({
        role: "super_admin",
      });

      if (superAdminExists) {

        return res.status(400).json({
          message: "Un super-admin existe déjà",
        });

      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Sauvegarder activité
    await Activity.create({
      user: email,
      action: "New account created",
      type: "success",
    });

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
    });

  }
};

// ================= LOGIN USER =================

exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Vérifier utilisateur
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "Email incorrect",
      });

    }

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
console.log("PASSWORD DB:", user.password);
    if (!isMatch) {
     await User.findByIdAndUpdate(
      user._id,
      {
        $inc: { failedLoginAttempts: 1 }
      }
    );

      // ===== ALERT =====

      if (user.failedLoginAttempts >= 3) {

        await Activity.create({

          user: email,

          action: "Multiple failed logins",

          type: "warning",
        });

      }

      return res.status(400).json({
        message: "Mot de passe incorrect",
      });

    }
    // ===== RESET FAILED ATTEMPTS =====

    await User.findByIdAndUpdate(
  user._id,
  {
    failedLoginAttempts: 0,
    isActive: true,
    lastLogin: new Date(),
  }
);
    await user.save();
    
    // Sauvegarder activité login
    await Activity.create({
      user: email,
      action: "User logged in",
      type: "info"
    });

    // Succès login
    return res.status(200).json({

      message: "Connexion réussie",
      
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });

  }
};

// ================= FORGOT PASSWORD =================

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    // Vérifier utilisateur
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "Email introuvable",
      });

    }

    // Générer token
    const token = crypto.randomBytes(32).toString("hex");

    // Sauvegarder token
    user.resetToken = token;

    await user.save();

    // Sauvegarder activité
    await Activity.create({
      user: email,
      action: "Password reset requested",
      type: "warning",
    });

    // Lien reset
    const resetLink =
      `http://localhost:3000/reset-password/${token}`;

    // Envoyer email
    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Réinitialisation de mot de passe",

      html: `
        <h2>Reset Password</h2>

        <p>
          Cliquez sur le lien suivant :
        </p>

        <a href="${resetLink}">
          Reset Password
        </a>
      `,
    });

    console.log("Email sent:", info);

    return res.status(200).json({
      message: "Lien envoyé vers votre email",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });

  }
};


// ================= RESET PASSWORD =================

exports.resetPassword = async (req, res) => {

  try {

    const { token } = req.params;

    const { password } = req.body;

    // Vérifier token
    const user = await User.findOne({
      resetToken: token,
    });

    if (!user) {

      return res.status(400).json({
        message: "Token invalide",
      });

    }

    // Hasher nouveau password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Modifier password
    user.password = hashedPassword;

    // Supprimer token
    user.resetToken = undefined;

    await user.save();

    // Sauvegarder activité
    await Activity.create({
      user: user.email,
      action: "Password changed",
      type: "warning",
    });

    return res.status(200).json({
      message: "Mot de passe modifié",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });

  }
};

// ================= COUNT USERS =================

exports.countUsers = async (req, res) => {

  try {
    const count = await User.countDocuments();
    res.json({
      totalUsers: count,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: error.message,
    });

  }
};

// ================= USERS STATS =================

exports.getMonthlyUsers = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          createdAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            $month: {
              $ifNull: ["$createdAt", "$updatedAt"]
            }
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(stats);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ACTIVITIES =================

exports.getActivities = async (req, res) => {

  try {

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(activities);

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }
};

// GET ACTIVE / INACTIVE USERS
exports.getUsersStatus = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({
      isActive: true,
    });
    const inactiveUsers = await User.countDocuments ({
      isActive: { $ne: true},
    });
    res.status(200).json({
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = async (req,res) => {
  try {
    const {userId} = req.body;
    console.log(userId)
    const user = await User.findById(userId);
    console.log(user)
    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }
// ===== SET INACTIVE ======
user.isActive = false;
await user.save();

// ==== ACTIVITY ====
await Activity.create({
  user: user.email,
  action: "User logged out",
  type: "info",
});

return res.status(200).json({
  message: "Logout successful",
});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("+password");
    res.status(200).json(users);
  } catch(error){
    res.status(500).json({ message: error.message});
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found"});
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role =role;
    // true / false
    if (typeof isActive !== "undefined") {
      user.isActive = isActive;
    }
    await user.save();
    // ===== SAVE ACTIVITY =====

    await Activity.create({
      user: user.email,
      action: "User updated",
      type: "warning",
    });

    return res.status(200).json({

      message: "User updated successfully",

      user,

    });

  } catch(error){
   console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(req.params.id);
    await Activity.create({
      user: "system",
      action: "User deleted",
      type: "danger",
    });
    res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
}
exports.toggleUserStatus = async (req, res) => {
  try {
    const user =  await User.findById(req.params.id);
    if (!user){
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.isActive = !user.isActive;
    await user.save();
   
    await Activity.create({
      user: user.email,
      action: user.isActive
       ? "User unblocked"
       : "User blocked",
      type: user.isActive
       ? "success"
       : "danger",
    });
     res.status(200).json({
      message: "Status updated",
      isActive: user.isActive,
    });
    } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Activity.find({
      type: {
        $in: ["warning", "danger", "success"],
      },
    })
    .sort({ createdAt: -1})
    .limit(10);
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    
    // récupérer l'id
    const userId = req.params.id;

    // vérifier existence
    if (!req.user ||!req.user.id) {
      return res.status(400).json({
        message: "User ID is missing",
      });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword} = req.body;
    const user = await User.findById(req.params.id);

    if(!user) {
      return res.status(404).json({ message: "User not found"});
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if( !isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({
      message: "Password updated successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }
};

