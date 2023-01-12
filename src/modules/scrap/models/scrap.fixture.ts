import { CreateScrap } from './scrap.dto';
import { ScrapType } from './scrap.model';

export function createDummyScrap(
  domain: string,
  type: ScrapType,
  url: string,
): CreateScrap {
  return {
    domain,
    type,
    url,
  };
}
