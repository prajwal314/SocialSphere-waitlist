const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "You're already on the waitlist ❤️" });
  }

  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
