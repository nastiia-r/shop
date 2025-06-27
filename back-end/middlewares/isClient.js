export default function isClient(req, res, next) {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Client access only" });
  }
  next();
}
