var Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.category_list = function (req, res, next) {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("category_list", {
        title: "All the categories we could possibly think of:",
        categories: result.categories,
      });
    }
  );
};

exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("category_detail", {
        category: result.category,
      });
    }
  );
};

exports.category_create_get = function (req, res, next) {
  res.render("category_form", {
    title: "Create New Category",
  });
};

exports.category_create_post = [
  // Validate and Sanitize
  body("categoryName", "Category name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process data post V&S
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.categoryName,
    });

    if (!errors.isEmpty()) {
      // If error re-renders the form
      // if (errors) return next(errors);
      res.render("category_form", {
        title: "Create New Category",
        categories: category,
        errorMessage: errors.errors[0],
      });
    } else {
      category.save(function (err) {
        if (err) return next(err);
        res.redirect(category.url);
      });
    }
  },
];

exports.category_update_get = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("category_form", {
        title: "Update Category",
        category: result.category,
      });
    }
  );
};

exports.category_update_post = [
  // Validate and Sanitize
  body("categoryName", "Category name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process post V&S
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.categoryName,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      if (err) return next(err);
      res.render("category_form", {
        title: "Update Category",
        category: category,
      });
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        function updateCategory(err) {
          if (err) return next(err);
          res.redirect(category.url);
        }
      );
    }
  },
];

exports.category_delete_get = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("category_delete", {
        title: "Delete Category",
        category: result.category,
      });
    }
  );
};

exports.category_delete_post = [
  (req, res, next) => {
    Category.findByIdAndRemove(req.params.id, function deleteCategory(err) {
      if (err) return next(err);
      res.redirect("/categories");
    });
  },
];
