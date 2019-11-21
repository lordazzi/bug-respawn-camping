import { RespawnCampingService } from '../respawn-camping/respawn-camping.service';
import { CommonErrorNormalizer } from './common-error.normalizer';
import { CustomErrorNormalizer } from './custom-error-nomalizar.interface';
import { NormalizerCLazz } from './normalizer-clazz.type';

export class ErrorHandlingService {

  private static instance: ErrorHandlingService | null = null;

  private camper = new RespawnCampingService();

  private errorNormalizer: {
    [name: string]: CustomErrorNormalizer<unknown>
  } = {};

  constructor() {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = this;
      this.initHandler();
    }

    return ErrorHandlingService.instance;
  }

  declareCustomErrorNormalizer(clazzes: NormalizerCLazz[]): void {
    clazzes.forEach(clazz => {
      const normalizer = new clazz();
      this.errorNormalizer[normalizer.name] = normalizer;
    });
  }

  private identifyNormalizer(thrown: unknown): CustomErrorNormalizer<unknown> | null {
    const nameFound = Object.keys(this.errorNormalizer).find(name => this.errorNormalizer[name].typeCheck(thrown)) || null;

    return this.errorNormalizer[nameFound || ''] || null;
  }

  launch(thrownThing: unknown): void {
    const normalizer = this.identifyNormalizer(thrownThing);
    if (normalizer) {
      const normalized = normalizer.normalize(thrownThing);
      if (normalized) {
        this.camper.registerRespawnedBug(normalizer.name, normalized);
      }
    }
  }

  private initHandler(): void {
    addEventListener('error', event => this.launch(event));
    this.declareCustomErrorNormalizer([CommonErrorNormalizer]);
  }
}
