import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  discountCode: {
    type: String,
    default: null,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
  },
  subTotal: {
    type: Number,
    required: true,
    default: 0, // Total before discount and tax
  },
  total: {
    type: Number,
    required: true,
    default: 0, // Final total after applying discount and tax
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', async function (next) {
  this.subTotal = this.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );
  this.total = this.subTotal + this.tax - this.discountAmount;
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
