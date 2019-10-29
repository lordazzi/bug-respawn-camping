import { JiraIntegrationApi } from '../jira/jira-integration.api';
import { ObjectUtil } from '../util/object.util';
import { ErrorNormalized } from './../error-handler/error-normalized.model';
import { ErrorToRegister } from './error-to-register.interface';

export class RespawnCampingService {

  private static instance: RespawnCampingService | null = null;

  private objectUtil = new ObjectUtil();
  private jiraApi = new JiraIntegrationApi();

  constructor() {
    if (!RespawnCampingService.instance) {
      RespawnCampingService.instance = this;
    }

    return RespawnCampingService.instance;
  }

  registerRespawnedBug(normalizerName: string, error: ErrorNormalized): void {
    const registrable = this.createRegistrableError(normalizerName, error);
    this.jiraApi
  }

  private createRegistrableError(normalizerName: string, error: ErrorNormalized): ErrorToRegister {
    const clonedError = this.objectUtil.clone(error);

    clonedError.id = `id-${normalizerName.toLowerCase()}-${clonedError.id}`;
    clonedError.labels.push('catch-by-respawn-camping');

    const aditionalInformation = `
      Environtment Information:
      User Agent: ${navigator.userAgent};
      Browser size: (${innerWidth} x ${innerHeight});
      Url: ${location.href};
      Time: ${this.getFormattedCurrentDate()};
    `;

    return {
      originName: normalizerName,
      aditionalInformation,
      error: clonedError
    };
  }

  private getFormattedCurrentDate(): string {
    const date = new Date();
    const decimalBase = 10;

    let d: string | number = date.getDate();
    d = d < decimalBase ? '0' + d : d;

    let m: string | number = date.getMonth() + 1;
    m = m < decimalBase ? '0' + m : m;

    const Y = date.getFullYear();

    let H: string | number = date.getHours();
    H = H < decimalBase ? '0' + H : H;

    let i: string | number = date.getMinutes();
    i = i < decimalBase ? '0' + i : i;

    let s: string | number = date.getSeconds();
    s = s < decimalBase ? '0' + s : s;

    return `[${d}/${m}/${Y} ${H}:${i}:${s}]`;
  }
}
