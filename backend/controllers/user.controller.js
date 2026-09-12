import User from "../models/User.js";

// Get Logged-in User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Logged-in User Profile
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      headline,
      education,
      experience,
      preferredRole,
      preferredLocation,
      skills,
      certifications,
      linkedin,
      github,
      portfolio,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only if values are provided
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (headline !== undefined) user.headline = headline;
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;
    if (preferredRole !== undefined) user.preferredRole = preferredRole;
    if (preferredLocation !== undefined)
      user.preferredLocation = preferredLocation;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    }
    if (certifications !== undefined) {
      user.certifications = Array.isArray(certifications)
        ? certifications
        : JSON.parse(certifications);
    }
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;
    if (portfolio !== undefined) user.portfolio = portfolio;
    const profilePicture = req.files?.profilePicture?.[0];
    const resume = req.files?.resume?.[0];

    if (profilePicture) {
      user.profilePicture = `/uploads/resumes/${profilePicture.filename}`;
    }
    if (resume) {
      user.resumeFile = `/uploads/resumes/${resume.filename}`;
      user.resumeFileName = resume.originalname;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
