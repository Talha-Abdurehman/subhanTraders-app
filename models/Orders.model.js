const mongoose = require("mongoose");

const ProductItemSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_category: { type: String, required: true },
  product_quantity: { type: Number, required: true },
  product_price: { type: Number, required: true },
});

const OrdersSchema = mongoose.Schema(
  {
    business_name: { type: String },
    location: { type: String },
    phone_num: { type: Number },
    invoice_id: { type: String, required: true, unique: true },
    products: { type: [ProductItemSchema], required: true },
    payment_method: { type: String, enum: ["Cash", "Card", "Online Payment"] },
    // Remove "required: true" here:
    total_price: { type: Number }, 
  },
  { timestamps: true }
);

// Pre-save hook to calculate total_price
OrdersSchema.pre("save", function (next) {
  this.total_price = this.products.reduce(
    (total, product) => total + product.product_price * product.product_quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Orders", OrdersSchema);
