import { UserRepository } from './user.repository';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { MarketingMethod } from './user.model';
import { LoginMethod } from '../auth/social-login/social-login.interface';
import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';

describe.skip('UserRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: UserRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(UserRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    await repository.create({
      id: 'test/id',
      phone: '123456789',
      loginMethod: LoginMethod.APPLE,
      email: 'aaa@bbb.com',
      name: 'test-user',
      ageRange: '',
      gender: '',
      marketingAgreedAt: new Date().getTime(),
      marketingAgreement: [MarketingMethod.EMAIL, MarketingMethod.SMS],
    });
  });

  it('test get', async () => {
    const items = [
      {
        id: 'test/id',
        phone: '123456789',
        loginMethod: LoginMethod.APPLE,
        email: 'aaa@bbb.com',
        name: 'test-user',
        marketingAgreedAt: new Date().getTime(),
        marketingAgreement: [MarketingMethod.EMAIL, MarketingMethod.SMS],
      },
    ];
    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findById(items[0].id);
    expect(actual.id).toBe(items[0].id);
    expect(actual.phone).toBe(items[0].phone);
    expect(actual.email).toBe(items[0].email);
  });
});
