import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  //  implement here
  try {
    const authHeader = req.headers.authorization;

    //  Check header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 1. Extract token
    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // 4. Attach to request
    req.user = user;

    // 5. Call next()
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export default authMiddleware;