import { GetScrapDto, ScrapDto } from './models/scrap.dto';
import { ScrapType } from './models/scrap.model';
import { ScrapController } from './scrap.controller';
import { ScrapRepository } from './scrap.repository';
import { ScrapService } from './scrap.service';

describe('ScrapController', () => {
  let controller: ScrapController;
  let service: ScrapService;
  let repository: ScrapRepository;

  beforeEach(() => {
    service = new ScrapService(repository);
    controller = new ScrapController(service);
  });

  describe('findOne', () => {
    it('domain - http protocol', async () => {
      const request: GetScrapDto = {
        domain: 'https://www.amazon.com/dp/B0948QK4CL',
        type: ScrapType.PRODUCT,
      };

      const expectResult: ScrapDto = {
        domain: 'www.amazon.com',
        type: ScrapType.PRODUCT,
        url: 'https://assets.ohoolabs.com/js/scrap/product/amazon-d8c8450a7f9ea3615301.min.js',
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(expectResult));

      const actualResult = await controller.findOne(request);

      expect(actualResult.domain).toBe(expectResult.domain);
      expect(actualResult.type).toBe(expectResult.type);
      expect(actualResult.url).toBe(expectResult.url);
    });
  });

  it('domain', async () => {
    const request: GetScrapDto = {
      domain: 'www.amazon.com',
      type: ScrapType.PRODUCT,
    };

    const expectResult: ScrapDto = {
      domain: 'www.amazon.com',
      type: ScrapType.PRODUCT,
      url: 'https://assets.ohoolabs.com/js/scrap/product/amazon-d8c8450a7f9ea3615301.min.js',
    };

    jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(expectResult));

    const actualResult = await controller.findOne(request);

    expect(actualResult.domain).toBe(expectResult.domain);
    expect(actualResult.type).toBe(expectResult.type);
    expect(actualResult.url).toBe(expectResult.url);
  });
});
