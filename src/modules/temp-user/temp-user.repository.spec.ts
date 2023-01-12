import { StartedDockerComposeEnvironment } from 'testcontainers';
import { LoginMethod } from '@modules/auth/social-login/social-login.interface';
import { TempUserRepository } from './temp-user.repository';
import generateNoDashUUID from '@utils/uuid.util';
import { CreateTempUser } from './temp-user.model';
import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';

describe.skip('TempUserRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: TempUserRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(TempUserRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    await repository.create({
      token: generateNoDashUUID(10),
      phone: '123456789',
      id: 'test/id',
      loginMethod: LoginMethod.APPLE,
      email: 'aaa@bbb.com',
      name: 'test-user',
      ageRange: '',
      gender: '',
    });
  });

  it('test get', async () => {
    const items: CreateTempUser[] = [
      {
        token: generateNoDashUUID(10),
        phone: '123456789',
        id: 'test/id',
        loginMethod: LoginMethod.APPLE,
        email: 'aaa@bbb.com',
        name: 'test-user',
      },
    ];
    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findByToken(items[0].token);
    expect(actual.token).toBe(items[0].token);
    expect(actual.phone).toBe(items[0].phone);
    expect(actual.email).toBe(items[0].email);
  });
});
