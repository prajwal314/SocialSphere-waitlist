const Waitlist = require("../models/Waitlist");
const dns = require("dns").promises;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "throwaway.email", "yopmail.com", "sharklasers.com", "temp-mail.org",
  "fakeinbox.com", "mailexpire.com", "mytemp.email", "trashmail.com",
  "dispostable.com", "spamgourmet.com", "maildrop.cc", "getnada.com",
  "tempinbox.com", "emailondeck.com", "inboxkitten.com", "moakt.com",
  "throwaway.email", "burnermail.io", "tempmail.net", "temp-mail.io",
  "fakemail.net", "mailnator.com", "tempemail.co", "tempmail.dev",
  "mail-temp.com", "fake-mail.com",
]);

async function verifyEmailDomain(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  if (DISPOSABLE_DOMAINS.has(domain)) {
    throw new Error("Disposable email addresses are not allowed");
  }

  try {
    const addresses = await dns.resolveMx(domain);
    if (!addresses || addresses.length === 0) {
      throw new Error("Email domain does not accept emails");
    }
  } catch (err) {
    if (err.message.includes("Disposable") || err.message.includes("does not accept")) {
      throw err;
    }
    throw new Error("Email domain does not appear to be valid");
  }

  return true;
}

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

    await verifyEmailDomain(email.trim());

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
    if (error.message && (error.message.includes("Disposable") || error.message.includes("domain") || error.message.includes("accept emails"))) {
      return res.status(400).json({ message: error.message });
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
