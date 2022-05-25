import { UserDao, UpdateUserProps } from './user';
import { userInfo } from 'os';

describe('UserService', () => {
  let user: UserDao;
  const baseUser = {
    login: 't_login',
    passHash: 't_pass',
    name: 't_name',
    city: 't_city',
    phone: 't_phone',
    id: 'id',
  };

  beforeEach(() => {
    user = UserDao.fromLoginPass(baseUser.login, baseUser.passHash);
  });

  it('User with defined login and pass should be created', () => {
    const changedProps = user.getUpdatedProps();

    expect(user.login).toBe(baseUser.login);
    expect(user.passHash).toBe(baseUser.passHash);
    expect(user.id).toBeNull();
    expect(user.name).toBeNull();
    expect(user.city).toBeNull();
    expect(user.phone).toBeNull();
    expect(Object.keys(changedProps).length).toBe(0);
  });

  describe('Properties add - should change the value but updated props obj should be empty', () => {
    const checkingMap = new Map<keyof UserDao, string>();
    checkingMap.set('name', 'addName');
    checkingMap.set('phone', 'addPhone');
    checkingMap.set('city', 'addCity');

    for (const [p, cbName] of checkingMap) {
      it(p, () => {
        const propVal = baseUser[p];
        user[cbName](propVal);

        const cp = user.getUpdatedProps();

        expect(user[p]).toBe(propVal);
        expect(Object.keys(cp).length).toBe(0);
      });
    }
  });

  describe('Properties change - should change the value and save it in the updated props', () => {
    type UserProps = keyof UserDao;
    type TestingProps = Extract<
      UserProps,
      'name' | 'city' | 'phone' | 'passHash'
    >;

    const checkingMap = new Map<TestingProps, keyof UpdateUserProps>();
    checkingMap.set('name', 'name');
    checkingMap.set('city', 'city');
    checkingMap.set('phone', 'phone');
    checkingMap.set('passHash', 'pass');

    for (const [p, updPropName] of checkingMap) {
      it(p, () => {
        const newVal = userInfo[p] + 'changed';
        user[p] = newVal;
        const updProps = user.getUpdatedProps();

        expect(user[p]).toBe(newVal);
        expect(updProps).toHaveProperty(updPropName);
        expect(updProps[updPropName]).toBe(newVal);
      });
    }

    it('Should have all updated props', () => {
      const testValAdd = 'changed';
      for (const [p] of checkingMap) {
        user[p] = userInfo[p] + testValAdd;
      }

      const updProps = user.getUpdatedProps();

      for (const [p, updPName] of checkingMap) {
        const expVal = userInfo[p] + testValAdd;
        expect(updProps).toHaveProperty(updPName);
        expect(updProps[updPName]).toBe(expVal);
      }
    });
  });
});
