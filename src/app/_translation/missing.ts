import { MissingTranslationHandlerParams, MissingTranslationHandler } from '@ngx-translate/core';

export class MissingTranslationService implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
      //return `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
      return "";
    }
  }