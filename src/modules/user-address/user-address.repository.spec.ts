import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { CreateUserAddress } from './models/user-address.dto';
import { UserAddressRepository } from './user-address.repository';

describe.skip('UserAddressRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: UserAddressRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(UserAddressRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    const item: CreateUserAddress = {
      userId: 'testuser1',
      addressId: 'testaddress1',
      displayName: '기본배송지',
      recipientName: 'MR. Kim',
      recipientPhone: '123456',
      countryCode: '',
      zipCode: '421023',
      address1: '',
      address2: '',
    };

    await repository.create(item);
  });

  it('test findOne', async () => {
    const item: CreateUserAddress = {
      userId: 'testuser1',
      addressId: 'testaddress1',
      displayName: '기본배송지',
      recipientName: 'MR. Kim',
      recipientPhone: '123456',
      countryCode: '',
      zipCode: '421023',
      address1: '',
      address2: '',
    };

    await repository.create(item);

    const actual = await repository.findOne(item.userId, item.addressId);

    expect(actual.displayName).toBe(item.displayName);
    expect(actual.recipientName).toBe(item.recipientName);
  });

  it('test findByUserId', async () => {
    const items: CreateUserAddress[] = [
      {
        userId: 'testuser1',
        addressId: 'testaddress1',
        displayName: '기본배송지',
        recipientName: 'MR. Kim',
        recipientPhone: '123456',
        countryCode: 'KR',
        zipCode: '421023',
        address1: 'myaddress1',
        address2: 'myaddress2',
      },
      {
        userId: 'testuser1',
        addressId: 'myaddress1',
        displayName: '부모님배송지',
        recipientName: 'Ms. Lee',
        recipientPhone: '456789',
        countryCode: 'US',
        zipCode: '345678',
        address1: 'parentsaddress1',
        address2: 'parentsaddress2',
      },
    ];

    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findByUserId(items[0].userId);

    const actual0 = actual
      .filter((i) => i.addressId === items[0].addressId)
      .shift();
    const actual1 = actual
      .filter((i) => i.addressId === items[1].addressId)
      .shift();

    expect(actual0.displayName).toBe(items[0].displayName);
    expect(actual0.recipientName).toBe(items[0].recipientName);
    expect(actual1.displayName).toBe(items[1].displayName);
    expect(actual1.recipientName).toBe(items[1].recipientName);
  });

  it('test delete', async () => {
    const item: CreateUserAddress = {
      userId: 'testuser1',
      addressId: 'testaddress1',
      displayName: '기본배송지',
      recipientName: 'MR. Kim',
      recipientPhone: '123456',
      countryCode: '',
      zipCode: '421023',
      address1: '',
      address2: '',
    };

    await repository.create(item);

    await repository.delete(item.userId, item.addressId);

    const actual = await repository.findByUserId(item.userId);
    expect(actual.length).toBe(0);
  });
});
