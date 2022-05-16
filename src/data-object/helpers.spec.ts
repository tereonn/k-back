import { UpdateUserProps } from './data/user';
import { userPropsToUpdInput } from './helpers';

describe('userPropsToUpdInput', () => {
  const testData: UpdateUserProps = {
    city: 'test',
    pass: 'pass',
    name: 'name',
    phone: 'phone',
  };

  it('Should return correct object with correct data', () => {
    const result = userPropsToUpdInput(testData);

    expect(result).toHaveProperty('UserInfo');
    expect(result.UserInfo).toHaveProperty('update');
    const uInfo = result.UserInfo.update;

    expect(result).toHaveProperty('pass');
    expect(result.pass).toBe(testData.pass);

    expect(uInfo).toHaveProperty('name');
    expect(uInfo.name).toBe(testData.name);
    expect(uInfo).toHaveProperty('phone');
    expect(uInfo.phone).toBe(testData.phone);
    expect(uInfo).toHaveProperty('phone');
    expect(uInfo.phone).toBe(testData.phone);
  });
});
