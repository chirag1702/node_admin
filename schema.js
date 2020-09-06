const mongoose = require("mongoose");
const { Timestamp } = require("mongodb");
const schema = mongoose.Schema;


const category_schema = new schema({
    name: String,
    image: String,
    subtitle: String,
});

const sub_category_schema = new schema({
    category_id: String,
    name: String,
    subtitle: String,
    image: String,
    main_category: String,
    
});

const admin_schema = new schema({
    username: String,
    password: String,
    email: String,
    role: String,
    permissions: String,
});

const area_schema = new schema({
    name: String,
    city_id: String,
});

const city_schema = new schema({
    name: String,
});

const delivery_boys_schema = new schema({
    name: String,
    mobile: String,
    password: String,
    address: String,
    bonus: Number,
    balance: Number,
    status: Number,
    date_created: Date,
    fcm_id: String,
});

const delivery_boy_notifications_schema = new schema({
    delivery_boy_id: String,
    order_id: String,
    title: String,
    message: String,
    type: String,
    date_created: Date,
});

const faq_schema = new schema({
    question: String,
    answer: String,
    status: String,
});

const fund_transfers_schema = new schema({
    delivery_boy_id: String,
    type: String,
    opening_balance: Number,
    closing_balance: Number,
    amount: Number,
    status: String,
    message: String,
    date_created: Date,
});

const invoice_schema = new schema({
    invoice_date: Date,
    order_id: String,
    name: String,
    address: String,
    order_date: Date,
    phone_number: String,
    order_list: String,
    email: String,
    discount: Number,
    total_sale: Number,
    shipping_charge: Number,
    payment: String,
});

const notification_schema = new schema({
    title: String,
    message: String,
    type: String,
    type_id: String,
    image: String,
    date_sent: Date
});

const offers_schema = new schema({
    image: String,
    date_added: Date,
});

const orders_schema = new schema({
    user_id: String,
    delivery_boy_id: String,
    mobile: String,
    total: Number,
    total: Number,
    delivery_charge: Number,
    tax_amount: Number,
    tax_percentage: Number,
    wallet_balance: Number,
    discount: Number,
    promo_code: String,
    promo_discount: Number,
    final_total: Number,
    payment_method: String,
    address: String,
    latitude: String,
    longitude: String,
    delivery_time: String,
    status: String,
    active_status: String,
    date_added: Date,
});

const order_items_schema = new schema({
    user_id: Number,
    order_id: Number,
    product_variant_id: Number,
    quantity: Number,
    price: Number,
    discounted_price: Number,
    discount: Number,
    sub_total: Number,
    deliver_by: String,
    status: String,
    active_status: String,
    date_added: Date,
});

const payment_request_schema = new schema({
    user_id: Number,
    payment_type: String,
    payment_address: String,
    amount_requested: Number,
    remarks: String,
    status: Number,
    date_created: Date,
});

const product_schema = new schema({
    id: String,
    name: String,
    slug: String,
    category_id: String,
    sub_category_id: String,
    indicator: Number,
    image: String,
    other_images: String,
    description: String,
    status: Number,
    date_added: Date,
});

const product_variants_schema = new schema({
    product_id: Number,
    type: String,
    measurment: Number,
    measurment_unit_id: Number,
    price: Number,
    discounted_price: Number,
    serve_for: String,
    stock: Number,
    stock_unit_id: Number,
});

const promo_codes_schema = new schema({
    promo_code: String,
    message: String,
    start_date: String,
    end_date: String,
    no_of_users: Number,
    minimum_order_amount: Number,
    discount: Number,
    discount_type: String,
    max_discount_amount: Number,
    repeat_usage: Number,
    no_of_repeat_usage: Number,
    status: Number,
    date_created: Date,
    code_id: Number,
});

const return_request_schema = new schema({
    user_id: Number,
    product_id: Number,
    product_variant_id: Number,
    order_id: Number,
    order_item_id: Number,
    status: Number,
    remarks: String,
    date_created: Date,
});

const sections_schema = new schema({
    title: String,
    short_description: String,
    style: String,
    product_ids: String,
    date_added: Date,
});

const seller_schema = new schema({
    name: String,
    mobile: String,
    email: String,
    company_name: String,
    personal_address: String,
    companey_address: String,
    dob: Date,
    account_details: String,
    password: String,
    gst_no: String,
    pan_no: String,
    status: String,
    commission: String,
    balance: Number,
    last_login_ip: String,
    last_updated: Date,
    date_created: Date,
});

const settings_schema = new schema({
    app_name: String,
    support_number: Number,
    support_email: String,
    current_version: String,
    min_version: String,
    version_status_check: Number,
    store_currency: String,
    gst: Number,
    cgst: Number,
    sgst: Number,
    igst: Number,
    delivery_charge: Number,
    min_free_delivery_amount: Number,
    system_time_zone: String,
    refer_and_earn_enable: Number,
    min_refer_and_earn_amount: Number,
    refer_and_earn_bonus: Number,
    refer_and_earn_method: String,
    max_refer_and_earn_amount: Number,
    min_withdraw_amount: Number,
    max_days_to_return_item: Number,
    delivery_boy_bonus: Number,
    from_email: String,
    reply_to_email: String,
});

const slider_schema = new schema({
    type: String,
    type_id: String,
    image: String,
    date_added: Date,
});

const time_slots_schema = new schema({
    title: String,
    from_time: String,
    to_time: String,
    last_order_time: String,
    status: Number
});

const transactions_schema = new schema({
    user_id: Number,
    order_id: String,
    type: String,
    txn_id: String,
    payu_txn_id: String,
    amount: Number,
    status: Number,
    message: String,
    transaction_date: Date,
    date_created: Date,
});

const unit_schema = new schema({
    name: String,
    short_code: String,
    parent_id: Number,
    conversion: Number
});

const users_schema = new schema({
    name: String,
    email: String,
    country_code: String,
    mobile: String,
    dob: String,
    city: String,
    area: String,
    street: String,
    pincode: String,
    apikey: String,
    balance: Number,
    refferal_code: String,
    friends_code: String,
    fcm_id: String,
    latitude: String,
    longitude: String,
    password: String,
    status: Number,
    created_at: Number,
});

const wallet_transactions_schema = new schema({
    user_id: Number,
    type: String,
    amount: Number,
    message: String,
    status: Number,
    date_created: Date,
    last_updated: Date,
});

const SCHEMAS = {
    "categotySchema": category_schema,
    "subCategorySchema": sub_category_schema,
    "adminSchema": admin_schema,
    "areaSchema": area_schema,
    "citySchema": city_schema,
    "deliveryBoysSchema": delivery_boys_schema,
    "deliveryBoysNotificationsSchema": delivery_boy_notifications_schema,
    "faqSchema": faq_schema,
    "fundTransfersSchema": fund_transfers_schema,
    "invoiceSchema": invoice_schema,
    "notificationSchema": notification_schema,
    "offersSchema": offers_schema,
    "ordersSchema": orders_schema,
    "orderItemsSchema": order_items_schema,
    "paymentRequestSchema": payment_request_schema,
    "productSchema": product_schema,
    "productVariantsSchema": product_variants_schema,
    "promoCodesSchema": promo_codes_schema,
    "returnRequestSchema": return_request_schema,
    "sectionsSchema": sections_schema,
    "sellerSchema": seller_schema,
    "settingsSchema": settings_schema,
    "sliderSchema": slider_schema,
    "timeSlotsSchema": time_slots_schema,
    "transactionsSchema": transactions_schema,
    "unitSchema": unit_schema,
    "usersSchema": users_schema,
    "walletTransacionsSchema": wallet_transactions_schema,
};


module.exports = SCHEMAS;