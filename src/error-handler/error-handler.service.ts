import { RespawnCampingService } from '../respawn-camping/respawn-camping.service';
import { CustomErrorNormalizer } from './custom-error-nomalizar.interface';
import { NormalizerCLazz } from './normalizer-clazz.type';

export class ErrorHandlingService {

  private static instance: ErrorHandlingService | null = null;

  private camper = new RespawnCampingService();

  private errorNormalizer: {
    [name: string]: CustomErrorNormalizer<any>
  } = {};

  constructor() {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = this;
    }

    return ErrorHandlingService.instance;
  }

  declareCustomErrorNormalizer(clazzes: NormalizerCLazz[]): void {
    clazzes.forEach(clazz => {
      const normalizer = new clazz();
      this.errorNormalizer[normalizer.name] = normalizer;
    });
  }

  private identifyNormalizer(thrown: any): CustomErrorNormalizer<any> | null {
    const nameFound = Object.keys(this.errorNormalizer).find(name => this.errorNormalizer[name].typeCheck(thrown)) || null;

    return this.errorNormalizer[nameFound || ''] || null;
  }

  launch(thrownThing: any): void {
    const normalizer = this.identifyNormalizer(thrownThing);
    if (normalizer) {
      const normalized = normalizer.normalize(thrownThing);
      if (normalized) {
        this.camper.registerRespawnedBug(normalizer.name, normalized);
      }
    }
  }
}
