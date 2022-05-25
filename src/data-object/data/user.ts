export interface UpdateUserProps {
  name?: string;
  city?: string;
  phone?: string;
  pass?: string;
}

export class UserDao {
  private constructor(l: string, p: string, id: number) {
    this.login = l;
    this._passHash = p;
    this.id = id;
  }
  static fromLoginPass(l: string, p: string): UserDao {
    return new UserDao(l, p, null);
  }
  static fromIdLoginPass(i: number, l: string, p: string): UserDao {
    return new UserDao(l, p, i);
  }

  public readonly id: number | null = null;
  public readonly login: string;
  private _passHash: string;

  private _name: string | null = null;
  private _city: string | null = null;
  private _phone: string | null = null;

  private _teamName: string | null = null;

  private updateObj: UpdateUserProps = {};

  public get passHash() {
    return this._passHash;
  }
  public set passHash(passHash: string) {
    this.updateObj.pass = passHash;

    this._passHash = passHash;
  }

  public get name() {
    return this._name;
  }
  public set name(name: string) {
    this.updateObj.name = name;

    this._name = name;
  }

  public get city() {
    return this._city;
  }
  public set city(city: string) {
    this.updateObj.city = city;

    this._city = city;
  }

  public get phone() {
    return this._phone;
  }
  public set phone(phone: string) {
    this.updateObj.phone = phone;

    this._phone = phone;
  }

  // Methods
  getUpdatedProps(): UpdateUserProps {
    return this.updateObj;
  }
  addCity(val: string): UserDao {
    this._city = val;

    return this;
  }
  addName(val: string): UserDao {
    this._name = val;

    return this;
  }
  addPhone(val: string): UserDao {
    this._phone = val;

    return this;
  }
}
