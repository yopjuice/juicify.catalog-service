import {  Injectable } from '@nestjs/common';
import { ConfigService, Path, PathValue } from '@nestjs/config';
import { AllConfigs } from './interfaces/all-configs.interface';

// Custom config service to override basic methods (if needed)
@Injectable()
export class MyConfigService extends ConfigService<AllConfigs, true> {

  override get(propertyPath: Path<AllConfigs>): PathValue<AllConfigs, Path<AllConfigs>> {
    return super.get(propertyPath, { infer: true });
  }
}
