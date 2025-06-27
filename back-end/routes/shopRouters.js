import express from "express";
import shopController from "../controllers/shopController.js";
import authController from "../controllers/auth.controller.js";
import { getProfile } from "../controllers/user.controller.js";
import isClient from "../middlewares/isClient.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/product/:gender/:id", shopController.getProduct);
router.get(
  ["/price/:gender/:category", "/price/:gender/:category/:categoryItem"],
  shopController.findPrice
);
router.get("/search", shopController.getSearchProducts);
router.post("/register", authController.registerClient);
router.post("/login", authController.loginClient);
router.get("/profile", verifyToken, isClient, getProfile);

router.get(
  ["/:gender", "/:gender/:category", "/:gender/:category/:categoryItem"],
  shopController.getAllProducts
);
router.post("/", shopController.addProduct);
export default router;
