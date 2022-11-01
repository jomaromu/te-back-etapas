import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// Interface
import { EtapaModelInterface } from "../interfaces/etapas";

// crear esquema
const Schema = mongoose.Schema;

const etapasSchema = new Schema({
  idCreador: { type: Schema.Types.ObjectId, ref: "userWorker" },
  nombre: {
    type: String,
    required: [true, "Debe ingresar un nombre"],
  },
  estado: { type: Boolean, default: true },
  foranea: { type: Schema.Types.ObjectId, ref: "userWorker" },
});

// validacion para único elemento
etapasSchema.plugin(uniqueValidator, { message: "{PATH}, ya existe!!" });

export = mongoose.model<EtapaModelInterface>("etapas", etapasSchema);
