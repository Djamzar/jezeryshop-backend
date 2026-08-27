import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    productName: { type: String, required: true, default: "RoadSafe Emergency Kit" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    client: {
      nom: { type: String, required: true, trim: true },
      telephone: { type: String, required: true, trim: true },
      wilaya: { type: String, required: true, trim: true },
      adresse: { type: String, required: true, trim: true },
      note: { type: String, trim: true, default: "" },
    },
    status: {
      type: String,
      enum: ["en_attente", "confirmee", "livree", "annulee"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);
