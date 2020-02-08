export const ERROR_CODE = {
  InvalidEggNumber: 'INVALID_EGG_NUMBER',
  InvalidSequence: 'INVALID_SEQUENCE',
  InvalidRotationAmount: 'INVALID_ROTATION_AMOUNT',
  IncubatorNotExist: 'INCUBATOR_NOT_EXIST',
};

export const ERROR_MESSAGE = {
  InvalidEggNumber: 'Egg number should be an integer between 0 and 20',
  InvalidSequence: 'Sequence should only contain integer and within egg range',
  InvalidRotationAmount: 'Rotation amount should between 0 and 1',
  IncubatorNotExist: 'Incubator hasn\'t been setted',
};
