import { Response } from "express";
import { CallbackError } from "mongoose";
const mongoose = require("mongoose");
import Server from "./server";

// Interfaces
import { EtapaModelInterface } from "../interfaces/etapas";

// Modelo
import etapasModel from "../models/etapasModel";
import etapasOrdendas from "../models/etapasOrdendas";

export class EtapasClass {
  constructor() {}

  crearEtapa(req: any, resp: Response): void {
    const idCreador = new mongoose.Types.ObjectId(req.usuario._id);
    const nombre = req.body.nombre;
    const estado: boolean = req.body.estado;

    const nuevaEtapa = new etapasModel({
      idCreador,
      nombre,
      estado,
    });

    nuevaEtapa.save((err: CallbackError, etapaDB: EtapaModelInterface) => {
      if (err) {
        return resp.json({
          ok: false,
          mensaje: `Error interno`,
          err,
        });
      } else {
        return resp.json({
          ok: true,
          mensaje: "Etapa creada",
          etapaDB,
        });
      }
    });
  }

  obtenerEtapas(req: any, resp: Response): void {
    etapasModel
      .find({})
      .populate("idCreador")
      .exec((err: any, etapasDB: any) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        } else {
          return resp.json({
            ok: true,
            etapasDB,
          });
        }
      });
  }

  editarEtapa(req: any, resp: Response): any {
    const id = new mongoose.Types.ObjectId(req.body.id);
    const nombre: string = req.body.nombre;
    const estado: boolean = req.body.estado;

    const query = {
      nombre,
      estado,
    };

    etapasModel.findById(
      id,
      (err: CallbackError, etapaDB: EtapaModelInterface) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        }

        if (!etapaDB) {
          return resp.json({
            ok: false,
            mensaje: `No se encontró una etapa con ese ID`,
          });
        }

        if (!query.nombre) {
          query.nombre = etapaDB.nombre;
        }

        etapasModel.findByIdAndUpdate(
          id,
          query,
          { new: true },
          (err: CallbackError, etapaDB: any) => {
            if (err) {
              return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err,
              });
            } else {
              return resp.json({
                ok: true,
                mensaje: "Etapa actualizada",
                etapaDB,
              });
            }
          }
        );
      }
    );
  }

  eliminarEtapa(req: any, resp: Response): void {
    const id = new mongoose.Types.ObjectId(req.get("id"));

    etapasModel.findByIdAndDelete(id, {}, (err: any, etapaDB: any) => {
      if (err) {
        return resp.json({
          ok: false,
          mensaje: `Error interno`,
          err,
        });
      } else {
        return resp.json({
          ok: true,
          mensaje: "Etapa eliminada",
          etapaDB,
        });
      }
    });
  }

  obtenerEtapasOrdenadas(req: any, resp: Response): void {
    const colEtapas: string = req.get("colEtapas");

    etapasOrdendas.findOne({ colEtapas }, (err: any, etapasOrdenadaDB: any) => {
      if (err) {
        return resp.json({
          ok: false,
          err,
        });
      } else {
        return resp.json({
          ok: true,
          etapasOrdenadaDB,
        });
      }
    });
  }

  actualizarEtapasOrdenadas(req: any, resp: Response): void {
    const colEtapas: string = req.body.colEtapas;
    const etapas = req.body.etapas;
    etapasOrdendas.findOneAndUpdate(
      { colEtapas },
      { $set: { etapas } },
      { upsert: true, new: true },
      (err: any, etapasOrdenadaDB: any) => {
        if (err) {
          return resp.json({
            ok: false,
            err,
          });
        } else {
          return resp.json({
            ok: true,
            etapasOrdenadaDB,
          });
        }
      }
    );
  }
}
