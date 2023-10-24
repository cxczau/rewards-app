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

  test('create member', async () => {
    expect.assertions(1);
    const member = await db.Member.create({
      id: 1,
      ...MEMBER_MOCK,
    });
    expect(member.id).toEqual(1);
  });

  test('get member', async () => {
    expect.assertions(2);
    const member = await db.Member.findByPk(1);
    expect(member.firstName).toEqual(MEMBER_MOCK.firstName);
    expect(member.lastName).toEqual(MEMBER_MOCK.lastName);
  });

  test('delete member', async () => {
    expect.assertions(1);
    await db.Member.update(
      { deletedAt: new Date() },
      { where: { id: 1 } },
    );
    const member = await db.Member.findByPk(1);
    expect(member.deletedAt).not.toEqual(null);
  });
});

describe('Reward', () => {
  const REWARD_MOCK = {
    name: 'Test Reward',
    description: 'Test Reward Description',
    cost: 100,
  };

  test('create reward', async () => {
    expect.assertions(1);
    const reward = await db.Reward.create({
      id: 1,
      ...REWARD_MOCK,
    });
    expect(reward.id).toEqual(1);
  });

  test('get reward', async () => {
    expect.assertions(2);
    const reward = await db.Reward.findByPk(1);
    expect(reward.firstName).toEqual(REWARD_MOCK.firstName);
    expect(reward.lastName).toEqual(REWARD_MOCK.lastName);
  });

  test('delete reward', async () => {
    expect.assertions(1);
    await db.Reward.destroy({
      where: {
        id: 1,
      },
    });
    const reward = await db.Reward.findByPk(1);
    expect(reward).toBeNull();
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
