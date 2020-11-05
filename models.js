const mongoose = require("mongoose");
const schema = require("./schema");

const model = mongoose.model;

const category = model("category", schema.categotySchema);
const subCategory = model("subcategory", schema.subCategorySchema);
const admin = model("admin", schema.adminSchema);
const area = model("area", schema.areaSchema);
const city = model("city", schema.citySchema);
const deliveryBoy = model("delivery_boys", schema.deliveryBoysSchema);
const deliveryBoyNotification = model("delivery_boy_notifications", schema.deliveryBoysNotificationsSchema);
const faq = model("faq", schema.faqSchema);
const fundTransfer = model("fund_transfers", schema.fundTransfersSchema);
const invoice = model("invoice", schema.invoiceSchema);
const notification = model("notifications", schema.notificationSchema);
const offer = model("offers", schema.offersSchema);
const order = model("orders", schema.ordersSchema);
const orderItem = model("order_items", schema.orderItemsSchema);
const paymentRequest = model("payment_requests", schema.paymentRequestSchema);
const product = model("products", schema.productSchema);
const productVariant = model("product_variant", schema.productVariantsSchema);
const promoCode = model("promoCodes", schema.promoCodesSchema);
const returnRequest = model("return_requests", schema.returnRequestSchema);
const section = model("sections", schema.sectionsSchema);
const seller = model("seller", schema.sellerSchema);
const setting = model("settings", schema.settingsSchema);
const slider = model("slider", schema.sliderSchema);
const timeSlot = model("time_slots", schema.timeSlotsSchema);
const transaction = model("transactions", schema.transactionsSchema);
const unit = model("unit", schema.unitSchema);
const user = model("users", schema.usersSchema);
const walletTransaction = model("wallet_transactions", schema.walletTransacionsSchema);
const taxModel = model("taxes", schema.taxesSchema);

const MODELS = {
    "category": category,
    "subCategory": subCategory,
    "admin": admin,
    "area": area,
    "city": city,
    "deliveryBoy": deliveryBoy,
    "deliveryBoyNotification": deliveryBoyNotification,
    "faq": faq,
    "fundTransfer": fundTransfer,
    "invoice": invoice,
    "notification": notification,
    "offer": offer,
    "order": order,
    "orderItem": orderItem,
    "paymentRequest": paymentRequest,
    "product": product,
    "productVariant": productVariant,
    "promoCode": promoCode,
    "returnRequest": returnRequest,
    "section": section,
    "seller": seller,
    "setting": setting,
    "slider": slider,
    "timeSlot": timeSlot,
    "transaction": transaction,
    "unit": unit,
    "user": user,
    "walletTransaction": walletTransaction,
    "taxes": taxModel
};

module.exports = MODELS;