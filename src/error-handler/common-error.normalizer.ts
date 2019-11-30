import { CustomErrorNormalizer } from './custom-error-nomalizar.interface';
import { ErrorNormalized } from './error-normalized.model';

export class CommonErrorNormalizer implements CustomErrorNormalizer<ErrorEvent> {

  private static NOT_ALPHANUMERIC_CHAR = /[^a-z0-9\s]/ig;

  name = 'error-event';

  typeCheck(possibleErrorEvent: unknown): possibleErrorEvent is ErrorEvent {
    if (possibleErrorEvent instanceof ErrorEvent) {
      return true;
    }

    return false;
  }

  normalize(errorEvent: ErrorEvent): ErrorNormalized | null {
    const messageSizeLimitInIdContext = 40;
    let id = '';
    let content = '';
    let title = '';
    let error: Error | null = null;
    const labels: string[] = [];

    if (errorEvent.error && errorEvent.error.rejection) {
      id = 'runtime-in-promise';
      title = 'Promise broken';
      content = 'The error was caught in an unhandled promise.\n';
      error = errorEvent.error.rejection;
    } else if (errorEvent.error) {
      id = 'runtime-thown-error';
      title = 'Error thrown';
      content = 'The error was thrown in the application body.\n';
      error = errorEvent.error;
    } else {
      id = 'script-error';
      title = 'Script error';
      content = errorEvent.message;
    }

    if (error) {
      content += `Error Type: ${error.name}.`;
      labels.push(`${id}-${error.name.toLowerCase()}`);

      id += error.message
        .substr(0, messageSizeLimitInIdContext)
        .trim()
        .replace(CommonErrorNormalizer.NOT_ALPHANUMERIC_CHAR, '')
        .replace(/\s+/g, '-')
        .toLowerCase();

      title += error.message;

      content += `\n      
        Message: ${error.message}.
        Stack: ${error.stack}.`;
    } else {
      labels.push(`${id}-${errorEvent.message.toLowerCase()}`);
    }

    return {
      id, title, content, labels
    };
  }
}
