const Waitlist = require("../models/Waitlist");

exports.joinWaitlist = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const existing = await Waitlist.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "You're already on the waitlist ❤️" });
    }

    const entry = await Waitlist.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    res.status(201).json({
      message: "Successfully joined the waitlist! 🎉",
      data: { id: entry._id, name: entry.name, email: entry.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You're already on the waitlist ❤️" });
    }
    console.error("Join waitlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getWaitlist = async (req, res) => {
  try {
    const entries = await Waitlist.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error("Get waitlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
