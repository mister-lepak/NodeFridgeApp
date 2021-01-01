var express = require("express");
var router = express.Router();
var category_controller = require("../controllers/categoryController");
var iteminstance_controller = require("../controllers/iteminstanceController");
var section_controller = require("../controllers/sectionController");

/* iteminstance */
router.get("/", iteminstance_controller.index);

router.get("/items/", iteminstance_controller.iteminstance_list);

router.get("/item/create", iteminstance_controller.iteminstance_create_get);

router.post("/item/create", iteminstance_controller.iteminstance_create_post);

router.get("/item/:id", iteminstance_controller.iteminstance_detail);

router.get("/item/:id/update", iteminstance_controller.iteminstance_update_get);

router.post(
  "/item/:id/update",
  iteminstance_controller.iteminstance_update_post
);

router.get("/item/:id/delete", iteminstance_controller.iteminstance_delete_get);

router.post(
  "/item/:id/delete",
  iteminstance_controller.iteminstance_delete_post
);

// CATEGORY

router.get("/categories/", category_controller.category_list);

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id", category_controller.category_detail);

router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

router.get("/category/:id/delete", category_controller.category_delete_get);

router.post("/category/:id/delete", category_controller.category_delete_post);

// SECTION

router.get("/sections/", section_controller.section_list);

router.get("/section/create", section_controller.section_create_get);

router.post("/section/create", section_controller.section_create_post);

router.get("/section/:id", section_controller.section_detail);

router.get("/section/:id/update", section_controller.section_update_get);

router.post("/section/:id/update", section_controller.section_update_post);

router.get("/section/:id/delete", section_controller.section_delete_get);

router.post("/section/:id/delete", section_controller.section_delete_post);

module.exports = router;
