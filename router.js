var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var db = require('./db_operations');
const { route } = require("./Authrouter");
// var app = express();


var variationData = 0;

router.post("/add-variation", (req, res) => {
    res.render("./views/Forms/form-elements.ejs", { "additionData" : variationData });
});

router.post("/add-product", (req, res) => {
    res.send("Added!!");
});


router.use(bodyParser.urlencoded({ extended: true }));



router.get("/admin", (req, res) => {
    res.render("Authentication/admin", {"title": "Admin"});
});

router.post("/login", (req, res) => {
   var username = req.body.username;
   var password = req.body.userpass;
   var data = {"username": username, "password": password};
   
   if (!username || !password) {
       res.send("Please fill all the fields!!");
   }
   else {
       var loginCheck = db.getRowCount(data, "admin");
       if (loginCheck == 1) {
           res.render("Dashboard/dashboard");
       }

       else {
           res.send("Login failed!!");
       }
   }
})


// Dashboard
router.get("/", function(req, res) {
  res.render("Dashboard/dashboard");
});

// Calendar
router.get("/calendar", function(req, res) {
  res.render("Calendar/calendar");
});

// Email
router.get("/email-inbox", function(req, res) {
  res.render("Email/email-inbox");
});

router.get("/email-compose", function(req, res) {
  res.render("Email/email-compose");
});

router.get("/email-read", function(req, res) {
  res.render("Email/email-read");
});

// Charts
router.get("/charts-chartist", function(req, res) {
  res.render("Chart/charts-chartist");
});

router.get("/charts-chartjs", function(req, res) {
  res.render("Chart/charts-chartjs");
});

router.get("/charts-flot", function(req, res) {
  res.render("Chart/charts-flot");
});

router.get("/charts-knob", function(req, res) {
  res.render("Chart/charts-knob");
});

router.get("/charts-morris", function(req, res) {
  res.render("Chart/charts-morris");
});

router.get("/charts-sparkline", function(req, res) {
  res.render("Chart/charts-sparkline");
});

// Email-template
router.get("/email-template-Alert", function(req, res) {
  res.render("Email-template/email-template-Alert");
});

router.get("/email-template-basic", function(req, res) {
  res.render("Email-template/email-template-basic");
});

router.get("/email-template-Billing", function(req, res) {
  res.render("Email-template/email-template-Billing");
});

// Forms
router.get("/form-advanced", function(req, res) {
  res.render("Forms/form-advanced");
});

router.get("/form-editors", function(req, res) {
  res.render("Forms/form-editors");
});

router.get("/form-elements", function(req, res) {
  res.render("Forms/form-elements");
});

router.get("/form-mask", function(req, res) {
  res.render("Forms/form-mask");
});

router.get("/form-repeater", function(req, res) {
  res.render("Forms/form-repeater");
});

router.get("/form-uploads", function(req, res) {
  res.render("Forms/form-uploads");
});

router.get("/form-validation", function(req, res) {
  res.render("Forms/form-validation");
});

router.get("/form-wizard", function(req, res) {
  res.render("Forms/form-wizard");
});

router.get("/form-xeditable", function(req, res) {
  res.render("Forms/form-xeditable");
});

// Icons
router.get("/icons-dripicons", function(req, res) {
  res.render("Icons/icons-dripicons");
});
router.get("/icons-fontawesome", function(req, res) {
  res.render("Icons/icons-fontawesome");
});
router.get("/icons-ion", function(req, res) {
  res.render("Icons/icons-ion");
});
router.get("/icons-material", function(req, res) {
  res.render("Icons/icons-material");
});
router.get("/icons-themify", function(req, res) {
  res.render("Icons/icons-themify");
});
router.get("/icons-typicons", function(req, res) {
  res.render("Icons/icons-typicons");
});

// Maps
router.get("/maps-google", function(req, res) {
  res.render("Maps/maps-google");
});
router.get("/maps-vector", function(req, res) {
  res.render("Maps/maps-vector");
});

// Tables
router.get("/tables-basic", function(req, res) {
  res.render("Tables/tables-basic");
});
router.get("/tables-datatable", function(req, res) {
  res.render("Tables/tables-datatable");
});
router.get("/tables-editable", function(req, res) {
  res.render("Tables/tables-editable");
});
router.get("/tables-responsive", function(req, res) {
  res.render("Tables/tables-responsive");
});

// UI
router.get("/ui-alerts", function(req, res) {
  res.render("Ui/ui-alerts");
});
router.get("/ui-buttons", function(req, res) {
  res.render("Ui/ui-buttons");
});
router.get("/ui-cards", function(req, res) {
  res.render("Ui/ui-cards");
});
router.get("/ui-carousel", function(req, res) {
  res.render("Ui/ui-carousel");
});
router.get("/ui-colors", function(req, res) {
  res.render("Ui/ui-colors");
});
router.get("/ui-dropdowns", function(req, res) {
  res.render("Ui/ui-dropdowns");
});
router.get("/ui-general", function(req, res) {
  res.render("Ui/ui-general");
});
router.get("/ui-grid", function(req, res) {
  res.render("Ui/ui-grid");
});
router.get("/ui-images", function(req, res) {
  res.render("Ui/ui-images");
});
router.get("/ui-lightbox", function(req, res) {
  res.render("Ui/ui-lightbox");
});
router.get("/ui-modals", function(req, res) {
  res.render("Ui/ui-modals");
});
router.get("/ui-progressbars", function(req, res) {
  res.render("Ui/ui-progressbars");
});
router.get("/ui-rangeslider", function(req, res) {
  res.render("Ui/ui-rangeslider");
});
router.get("/ui-rating", function(req, res) {
  res.render("Ui/ui-rating");
});
router.get("/ui-session-timeout", function(req, res) {
  res.render("Ui/ui-session-timeout");
});
router.get("/ui-sweet-alert", function(req, res) {
  res.render("Ui/ui-sweet-alert");
});
router.get("/ui-tabs-accordions", function(req, res) {
  res.render("Ui/ui-tabs-accordions");
});
router.get("/ui-typography", function(req, res) {
  res.render("Ui/ui-typography");
});
router.get("/ui-video", function(req, res) {
  res.render("Ui/ui-video");
});

// Layout related pages
router.get("/horizontal", function(req, res) {
  res.render("Dashboard/dashboard-horizontal", { layout: "horizontal-layout" });
});

router.get("/layouts-compact-sidebar", function(req, res) {
  res.render("Dashboard/dashboard-compact", { layout: "compact-layout" });
});

router.get("/layouts-icon-sidebar", function(req, res) {
  res.render("Dashboard/dashboard-icon", { layout: "icon-layout" });
});

router.get("/layouts-boxed", function(req, res) {
  res.render("Dashboard/dashboard-boxed", { layout: "boxed-layout" });
});

// Color Theme vertical
router.get("/vertical-dark", function(req, res) {
  res.render("Dashboard/dashboard", { layout: "vertical-dark-layout" });
});

router.get("/vertical-rtl", function(req, res) {
  res.render("Dashboard/dashboard", { layout: "vertical-rtl-layout" });
});

// Color Theme Horizontal
router.get("/horizontal-dark", function(req, res) {
  res.render("Dashboard/dashboard", { layout: "horizontal-dark-layout" });
});

router.get("/horizontal-rtl", function(req, res) {
  res.render("Dashboard/dashboard", { layout: "horizontal-rtl-layout" });
});

router.get("/horizontal-layouts-boxed", function(req, res) {
  res.render("Dashboard/dashboard", { layout: "horizontal-layouts-boxed" });
});

router.get("/horizontal-layouts-topbar-light", function(req, res) {
  res.render("Dashboard/dashboard", {
    layout: "horizontal-layouts-topbar-light"
  });
});

// Extra Pages
router.get("/pages-timeline", function(req, res) {
  res.render("Authentication/pages-timeline");
});

router.get("/pages-invoice", function(req, res) {
  res.render("Authentication/pages-invoice");
});

router.get("/pages-directory", function(req, res) {
  res.render("Authentication/pages-directory");
});
router.get("/pages-faq", function(req, res) {
  res.render("Authentication/pages-faq");
});
router.get("/pages-gallery", function(req, res) {
  res.render("Authentication/pages-gallery");
});
router.get("/pages-blank", function(req, res) {
  res.render("Authentication/pages-blank");
});
router.get("/pages-pricing", function(req, res) {
  res.render("Authentication/pages-pricing");
});

module.exports = router;
