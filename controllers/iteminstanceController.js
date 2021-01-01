const Iteminstance = require("../models/iteminstance");
const Section = require("../models/section");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Iteminstance.countDocuments({}, callback);
      },
      // item_good_count: function (callback) {
      //   Iteminstance.countDocuments({ status: "good" }, callback);
      // },
      // item_warning_count: function (callback) {
      //   Iteminstance.countDocuments({ status: "warning" }, callback);
      // },
      // item_danger_count: function (callback) {
      //   Iteminstance.countDocuments({ status: "danger" }, callback);
      // },
      // iteminstance: function (callback) {
      //   Iteminstance.find().exec(callback);
      // },
    },
    function (err, result) {
      if (err) return next(err);
      // console.log(result.iteminstance[5].status);
      res.render("index", {
        title: "Fridge App",
        data: result,
      });
    }
  );
};

exports.iteminstance_list = function (req, res, next) {
  async.parallel(
    {
      iteminstances: function (callback) {
        Iteminstance.find().exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("iteminstance_list", {
        title: "List of all items in the fridge",
        iteminstances: result.iteminstances,
      });
    }
  );
};

exports.iteminstance_detail = function (req, res, next) {
  async.parallel(
    {
      iteminstance: function (callback) {
        Iteminstance.findById(req.params.id)
          .populate("section")
          .populate("category")
          .exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("iteminstance_detail", {
        iteminstance: result.iteminstance,
      });
    }
  );
};

exports.iteminstance_create_get = function (req, res, next) {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().exec(callback);
      },
      sections: function (callback) {
        Section.find().exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      console.log(result);
      res.render("iteminstance_form", {
        title: "Create Item Instance",
        categories: result.categories,
        sections: result.sections,
      });
    }
  );
};

exports.iteminstance_create_post = [
  // Validate and Sanitize fields
  body("itemName", "Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemStock", "Stock info must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemPrice", "Price info must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemExpiryDate", "Expiry date must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemCategory").escape(),
  body("itemSection").escape(),

  // Process request after V&S
  (req, res, next) => {
    // Extract validation result into errors variable
    const errors = validationResult(req);
    // Create variable with cleaned data from form.
    const iteminstance = new Iteminstance({
      name: req.body.itemName,
      stock: req.body.itemStock,
      expiryDate: req.body.itemExpiryDate,
      category: req.body.itemCategory,
      section: req.body.itemSection,
      price: req.body.itemPrice,
    });
    // Check for errors
    if (!errors.isEmpty()) {
      // If error exists, then rerender the form
      async.parallel(
        {
          categories: function (callback) {
            Category.find().exec(callback);
          },
          sections: function (callback) {
            Section.find().exec(callback);
          },
        },
        function (err, result) {
          if (err) return next(err);
          res.render("iteminstance_form", {
            title: "Create Item Instance",
            iteminstance: iteminstance,
            categories: result.categories,
            selected_category: iteminstance.category,
            sections: result.sections,
            selected_section: iteminstance.section,
          });
        }
      );
    } else {
      // If no error, save the data
      iteminstance.save(function (err) {
        if (err) return next(err);
        res.redirect(iteminstance.url);
      });
    }
  },
];

exports.iteminstance_update_get = function (req, res, next) {
  async.parallel(
    {
      iteminstance: function (callback) {
        Iteminstance.findById(req.params.id)
          // .populate("category")
          // .populate("section")
          .exec(callback);
      },
      categories: function (callback) {
        Category.find().exec(callback);
      },
      sections: function (callback) {
        Section.find().exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("iteminstance_form", {
        title: "Update Item",
        iteminstance: result.iteminstance,
        categories: result.categories,
        selected_category: result.iteminstance.category,
        sections: result.sections,
        selected_section: result.iteminstance.section,
      });
    }
  );
};

exports.iteminstance_update_post = [
  // Validate and Sanitize
  body("itemName", "Item name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemStock", "Item stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemPrice", "Price info must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemExpiryDate", "Expiry date must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemCategory").escape(),
  body("itemSection").escape(),

  // Process post V&S
  (req, res, next) => {
    const errors = validationResult(req);

    const iteminstance = new Iteminstance({
      name: req.body.itemName,
      stock: req.body.itemStock,
      price: req.body.itemPrice,
      expiryDate: req.body.itemExpiryDate,
      category: req.body.itemCategory,
      section: req.body.itemSection,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: function (callback) {
            Category.find().exec(callback);
          },
          sections: function (callback) {
            Section.find().exec(callback);
          },
        },
        function (err, result) {
          if (err) return next(err);
          res.render("iteminstance_form", {
            title: "Update Item",
            iteminstance: iteminstance,
            selected_category: iteminstance.category,
            categories: result.categories,
            selected_section: iteminstance.section,
            sections: result.sections,
            errors: errors,
          });
        }
      );
    } else {
      Iteminstance.findByIdAndUpdate(
        req.params.id,
        iteminstance,
        function updateIteminstance(err) {
          if (err) return next(err);
          res.redirect(iteminstance.url);
        }
      );
    }
  },
];

exports.iteminstance_delete_get = function (req, res, next) {
  async.parallel(
    {
      iteminstance: function (callback) {
        Iteminstance.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("iteminstance_delete", {
        title: "Create Item",
        iteminstance: result.iteminstance,
      });
    }
  );
};

exports.iteminstance_delete_post = [
  (req, res, next) => {
    Iteminstance.findByIdAndDelete(
      req.params.id,
      function deleteIteminstance(err) {
        if (err) return next(err);
        res.redirect("/items/");
      }
    );
  },
];
