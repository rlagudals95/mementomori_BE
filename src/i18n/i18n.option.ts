import {
  AcceptLanguageResolver,
  I18nOptions,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

export function i18nOptions(): I18nOptions {
  return {
    fallbackLanguage: process.env.I18N_DEFAULT_LANG,
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
    ],
    loaderOptions: {
      path: __dirname,
      watch: true,
    },
    typesOutputPath: join(__dirname, '../../src/i18n/i18n.generated.ts'),
  };
}
