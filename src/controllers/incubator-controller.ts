import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../shared/api-interfaces';
import { ResponseBuilder } from '../shared/response-builder';
import { ApiResult, ApiInput } from '../interfaces/api';
import { IncubatorRepo } from '../repository/incubator-repo';
import * as config from '../constant/config';
import * as errors from '../constant/errors';

const incubatorRepo = new IncubatorRepo();

export class IncubatorController {
  public putSettings: ApiHandler = async (
    event: ApiEvent, _: ApiContext, callback: ApiCallback,
  ): Promise<void> => {
    const {
      number_of_eggs: eggAmount,
      sequence: sequenceString,
      rotation_amount: rotationAmount,
    } = JSON.parse(event.body) as ApiInput;
    const sequence = sequenceString.split(/\s+/).map(s => +s);
    const validSequence = sequence.filter(seq => seq >= config.MIN_EGG_AMOUNT
      && seq <= eggAmount && Number.isInteger(seq));

    if (eggAmount < config.MIN_EGG_AMOUNT
      || eggAmount > config.MAX_EGG_AMOUNT
      || !Number.isInteger(eggAmount)) {
      console.error(errors.ERROR_MESSAGE.InvalidEggNumber);
      ResponseBuilder.badRequest(
        errors.ERROR_CODE.InvalidEggNumber,
        errors.ERROR_MESSAGE.InvalidEggNumber,
        callback,
      );
      return undefined;
    }

    if (sequence.length !== validSequence.length) {
      console.error(errors.ERROR_MESSAGE.InvalidSequence);
      ResponseBuilder.badRequest(
        errors.ERROR_CODE.InvalidSequence,
        errors.ERROR_MESSAGE.InvalidSequence,
        callback,
      );
      return undefined;
    }

    if (rotationAmount < config.MIN_ROTATION_AMOUNT
      || rotationAmount > config.MAX_ROTATION_AMOUNT) {
      console.error(errors.ERROR_MESSAGE.InvalidRotationAmount);
      ResponseBuilder.badRequest(
        errors.ERROR_CODE.InvalidRotationAmount,
        errors.ERROR_MESSAGE.InvalidRotationAmount,
        callback,
      );
      return undefined;
    }

    const incubator = await incubatorRepo.createIncubator(
      eggAmount, validSequence, rotationAmount);

    const apiResult = {
      report: {
        number_of_eggs: incubator.eggs.length,
        sequence: incubator.sequence.join(' '),
        rotation_amount: incubator.rotation,
        rotations: incubator.eggs.map(egg => ({
          egg: egg.id,
          was_rotated: egg.rotated,
        })),
      },
    } as ApiResult;

    ResponseBuilder.ok<ApiResult>(apiResult, callback);
  }

  public portRun: ApiHandler = async (
    _: ApiEvent, __: ApiContext, callback: ApiCallback,
  ): Promise<void> => {
    const incubator = await incubatorRepo.rotateEggs();

    if (!incubator) {
      ResponseBuilder.badRequest(
        errors.ERROR_CODE.IncubatorNotExist,
        errors.ERROR_MESSAGE.IncubatorNotExist,
        callback,
      );
      return undefined;
    }

    const apiResult = {
      report: {
        number_of_eggs: incubator.eggs.length,
        sequence: incubator.sequence.join(' '),
        rotation_amount: incubator.rotation,
        rotations: incubator.eggs.map(egg => ({
          egg: egg.id,
          was_rotated: egg.rotated,
        })),
      },
    } as ApiResult;

    ResponseBuilder.ok<ApiResult>(apiResult, callback);
  }
}
