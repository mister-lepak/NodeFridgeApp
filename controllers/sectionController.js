var Section = require("../models/section");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.section_list = function (req, res, next) {
  async.parallel(
    {
      sections: function (callback) {
        Section.find().exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("section_list", {
        title: "Sections that the fridge have",
        sections: result.sections,
      });
    }
  );
};

exports.section_detail = function (req, res, next) {
  async.parallel(
    {
      section: function (callback) {
        Section.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("section_detail", {
        section: result.section,
      });
    }
  );
};

exports.section_create_get = function (req, res, next) {
  res.render("section_form", {
    title: "Create New Section",
  });
};

exports.section_create_post = [
  // Validate and Sanitize
  body("sectionName", "Section Name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process req post V&S
  (req, res, next) => {
    const errors = validationResult(req);

    const section = new Section({
      name: req.body.sectionName,
    });

    if (!errors.isEmpty()) {
      res.render("section_form", {
        section: section,
        errorMessage: errors.errors[0],
      });
    } else {
      section.save(function (err) {
        if (err) return next(err);
        res.redirect(section.url);
      });
    }
  },
];

exports.section_update_get = function (req, res, next) {
  async.parallel(
    {
      section: function (callback) {
        Section.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("section_form", {
        title: "Update Section",
        section: result.section,
      });
    }
  );
};

exports.section_update_post = [
  // Validate and Sanitize
  body("sectionName", "Section name cannot be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process post V&S
  (req, res, next) => {
    const errors = validationResult(req);

    const section = new Section({
      name: req.body.sectionName,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("section_form", {
        title: "Update Section",
        section: section,
      });
    } else {
      Section.findByIdAndUpdate(
        req.params.id,
        section,
        function deleteSection(err) {
          if (err) return next(err);
          res.redirect("/sections/");
        }
      );
    }
  },
];

exports.section_delete_get = function (req, res, next) {
  async.parallel(
    {
      section: function (callback) {
        Section.findById(req.params.id).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("section_delete", {
        title: "Delete Section",
        section: result.section,
      });
    }
  );
};

exports.section_delete_post = [
  (req, res, next) => {
    Section.findByIdAndRemove(req.params.id, function deleteSection(err) {
      if (err) return next(err);
      res.redirect("/sections/");
    });
  },
];
