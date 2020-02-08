import { ApiHandler } from './shared/api-interfaces';
import { IncubatorController } from './controllers/incubator-controller';

const controller: IncubatorController = new IncubatorController();

/**
 * Lambda endpoint for putSettings
 */
export const putSettings: ApiHandler = controller.putSettings;

/**
 * Lambda endpoint for postRun
 */
export const postRun: ApiHandler = controller.portRun;
