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
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const nombre = req.body.nombre;
    const estado: boolean = req.body.estado;

    const nuevaEtapa = new etapasModel({
      idCreador,
      foranea,
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
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
    etapasModel
      .find({ foranea })
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
    const _id = new mongoose.Types.ObjectId(req.body.id);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const nombre: string = req.body.nombre;
    const estado: boolean = req.body.estado;

    const query = {
      nombre,
      estado,
    };

    etapasModel.findOne(
      { _id, foranea },
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

        etapasModel.findOneAndUpdate(
          { _id, foranea },
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
    const _id = new mongoose.Types.ObjectId(req.get("id"));
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));

    etapasModel.findOneAndDelete(
      { _id, foranea },
      {},
      (err: any, etapaDB: any) => {
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
      }
    );
  }

  obtenerEtapasOrdenadas(req: any, resp: Response): void {
    const colEtapas: string = req.get("colEtapas");
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));

    etapasOrdendas.findOne(
      { colEtapas, foranea },
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

  actualizarEtapasOrdenadas(req: any, resp: Response): void {
    const colEtapas: string = req.body.colEtapas;
    const etapas = req.body.etapas;
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
    etapasOrdendas.findOneAndUpdate(
      { colEtapas, foranea },
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
