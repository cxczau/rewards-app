const db = require('./database');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

describe('Member', () => {
  const MEMBER_MOCK = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@email.com',
    birthday: '1990-01-01',
  };

  test('should create member', async () => {
    expect.assertions(1);
    const member = await db.Member.create({
      id: 1,
      ...MEMBER_MOCK,
    });
    expect(member.id).toEqual(1);
  });

  test('should not create member with same email', async () => {
    expect.assertions(1);
    try {
      await db.Member.create({
        id: 2,
        ...MEMBER_MOCK,
      });
    } catch (err) {
      expect(err.errors[0].message).toEqual('email must be unique');
    }
  });

  test('should get member', async () => {
    expect.assertions(2);
    const member = await db.Member.findByPk(1);
    expect(member.firstName).toEqual(MEMBER_MOCK.firstName);
    expect(member.lastName).toEqual(MEMBER_MOCK.lastName);
  });

  test('should fetch all members', async () => {
    expect.assertions(1);
    const members = await db.Member.findAll();
    expect(members.length).toEqual(1);
  });

  test('should delete member', async () => {
    expect.assertions(1);
    await db.Member.update(
      { deletedAt: new Date() },
      { where: { id: 1 } },
    );
    const member = await db.Member.findByPk(1);
    expect(member.deletedAt).not.toEqual(null);
  });

  test('should undelete member', async () => {
    expect.assertions(1);
    await db.Member.update(
      { deletedAt: null },
      { where: { id: 1 } },
    );
    const member = await db.Member.findByPk(1);
    expect(member.deletedAt).toEqual(null);
  });
});

describe('Reward', () => {
  const REWARD_MOCK = {
    name: 'Test Reward',
    description: 'Test Reward Description',
    cost: 100,
  };

  test('should create reward', async () => {
    expect.assertions(1);
    const reward = await db.Reward.create({
      id: 1,
      ...REWARD_MOCK,
    });
    expect(reward.id).toEqual(1);
  });

  test('should not create reward with same name', async () => {
    expect.assertions(1);
    try {
      await db.Reward.create({
        id: 2,
        ...REWARD_MOCK,
      });
    } catch (err) {
      expect(err.errors[0].message).toEqual('name must be unique');
    }
  });

  test('should get reward', async () => {
    expect.assertions(2);
    const reward = await db.Reward.findByPk(1);
    expect(reward.firstName).toEqual(REWARD_MOCK.firstName);
    expect(reward.lastName).toEqual(REWARD_MOCK.lastName);
  });

  test('should delete reward', async () => {
    expect.assertions(1);
    await db.Reward.update(
      { deletedAt: new Date() },
      { where: { id: 1 } },
    );
    const reward = await db.Reward.findByPk(1);
    expect(reward.deletedAt).not.toEqual(null);
  });

  test('should undelete reward', async () => {
    expect.assertions(1);
    await db.Reward.update(
      { deletedAt: null },
      { where: { id: 1 } },
    );
    const reward = await db.Reward.findByPk(1);
    expect(reward.deletedAt).toEqual(null);
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
