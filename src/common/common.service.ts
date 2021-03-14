import { Injectable } from '@nestjs/common';
import { CoreOutput } from './dtos/output.dto';

@Injectable()
export class CommonService {
  readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occurred.',
  };

  errorMsg(msg: string): CoreOutput {
    return { ok: false, error: msg };
  }
}
