import express from "express";
import shopController from "../controllers/shopController.js";

const router = express.Router();
router.get("/product/:gender/:id", shopController.getProduct);
router.get(
  ["/price/:gender/:category", "/price/:gender/:category/:categoryItem"],
  shopController.findPrice
);
router.get("/search", shopController.getSearchProducts);
router.post("/register", shopController.registerClient);
router.post("/login", shopController.loginClient);
router.get(
  ["/:gender", "/:gender/:category", "/:gender/:category/:categoryItem"],
  shopController.getAllProducts
);
router.post("/", shopController.addProduct);
export default router;
