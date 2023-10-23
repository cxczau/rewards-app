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
    await db.Member.destroy({
      where: {
        id: 1,
      },
    });
    const member = await db.Member.findByPk(1);
    expect(member).toBeNull();
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
