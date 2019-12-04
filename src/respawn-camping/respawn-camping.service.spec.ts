import { CommonErrorNormalizer } from '../error-handler/common-error.normalizer';
import { ErrorNormalized } from '../error-handler/error-normalized.model';
import { ErrorToRegister } from './error-to-register.interface';
import { RespawnCampingService } from './respawn-camping.service';

interface RespawnCampingServiceMock {
  createRegistrableError(normalizerName: string, error: ErrorNormalized): ErrorToRegister;
}

describe('[RespawnCampingService]', () => {
  const commonErrorNormalizer = new CommonErrorNormalizer();
  const respawnCampingService = (new RespawnCampingService() as any as RespawnCampingServiceMock);

  it('conversão em ErrorToRegister usando o conversor CommonErrorNormalizer', () => {
    const normalized = commonErrorNormalizer.normalize(<ErrorEvent><any>{
      error: new Error('Script error.')
    });

    const errorToRegister = respawnCampingService.createRegistrableError(commonErrorNormalizer.name, normalized);

    expect(errorToRegister.originName).toBe('error-event');
    expect(typeof errorToRegister.aditionalInformation).toBe('string');
    expect(errorToRegister.error.labels[0]).toBe('runtime-thown-error-error');
    expect(errorToRegister.error.labels[1]).toBe('catch-by-respawn-camping');
    // tslint:disable-next-line:no-magic-numbers
    expect(errorToRegister.error.labels[2]).toBe('id-error-event-runtime-thown-errorscript-erro');
  });
});
