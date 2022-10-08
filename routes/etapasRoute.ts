import { Router, Response, Request } from "express";
import { verificaToken } from "../auth/auth";
import { EtapasClass } from "../class/EtapasClass";

const etapasRouter = Router();

etapasRouter.post(
  "/crearEtapa",
  [verificaToken],
  (req: Request, resp: Response) => {
    const crearEtapa = new EtapasClass();
    crearEtapa.crearEtapa(req, resp);
  }
);

etapasRouter.get(
  "/obtenerEtapas",
  [verificaToken],
  (req: Request, resp: Response) => {
    const obtenerEtapas = new EtapasClass();
    obtenerEtapas.obtenerEtapas(req, resp);
  }
);

etapasRouter.put(
  "/editarEtapa",
  [verificaToken],
  (req: Request, resp: Response) => {
    const editarEtapa = new EtapasClass();
    editarEtapa.editarEtapa(req, resp);
  }
);

etapasRouter.delete(
  "/eliminarEtapa",
  [verificaToken],
  (req: Request, resp: Response) => {
    const eliminarEtapa = new EtapasClass();
    eliminarEtapa.eliminarEtapa(req, resp);
  }
);

etapasRouter.get(
  "/obtenerEtapasOrdenadas",
  [verificaToken],
  (req: Request, resp: Response) => {
    const obtenerEtapasOrdenadas = new EtapasClass();
    obtenerEtapasOrdenadas.obtenerEtapasOrdenadas(req, resp);
  }
);

etapasRouter.put(
  "/actualizarEtapasOrdenadas",
  [verificaToken],
  (req: Request, resp: Response) => {
    const actualizarEtapasOrdenadas = new EtapasClass();
    actualizarEtapasOrdenadas.actualizarEtapasOrdenadas(req, resp);
  }
);

export default etapasRouter;
