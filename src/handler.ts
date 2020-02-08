import { ApiHandler } from 'shared/api-interfaces';
import { IncubatorController } from 'controllers/incubator-controller';

const controller: IncubatorController = new IncubatorController();

export const putSettings: ApiHandler = controller.putSettings;
export const postRun: ApiHandler = controller.portRun;
