import { CustomErrorNormalizer } from './custom-error-nomalizar.interface';
import { ErrorNormalized } from './error-normalized.model';

export class CommonErrorNormalizer implements CustomErrorNormalizer<ErrorEvent> {

  name = 'error-event';

  typeCheck(possibleErrorEvent: any): possibleErrorEvent is ErrorEvent {
    if (possibleErrorEvent instanceof ErrorEvent) {
      return true;
    }

    return false;
  }

  normalize(errorEvent: ErrorEvent): ErrorNormalized | null {
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
      labels.push(`${id}-${error.name}`);

      id += error.message;
      title += error.message;

      content += `\n      
        Message: ${error.message}.
        Stack: ${error.stack}.`;
    } else {
      labels.push(`${id}-${errorEvent.message}`);
    }

    return {
      id, title, content, labels
    };
  }
}
