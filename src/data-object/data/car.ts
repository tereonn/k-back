import { Prisma, Car } from '@prisma/client';

export type CarData = {
  name: string;
  model: string;
  number: string;
  color: string;
  ownerId: number;
};

export class CarDao {
  private _id: number | null;
  private _name: string;
  private _model: string;
  private _number: string;
  private _color: string;
  private _ownerId: number;
  private updProps: Partial<CarDao> = {};

  private constructor(id: number | null) {
    this._id = id;
  }
  static fromData(data: CarData) {
    const c = new CarDao(null);
    c._name = data.name;
    c._model = data.model;
    c._number = data.number;
    c._color = data.color;
    c._ownerId = data.ownerId;

    return c;
  }
  static fromPrismaCar({
    id,
    name,
    model,
    number,
    color,
    ownerId,
  }: Car): CarDao {
    const c = new CarDao(id);

    c._name = name;
    c._model = model;
    c._number = number;
    c._color = color;
    c._ownerId = ownerId;

    return c;
  }

  get name(): CarDao['_name'] {
    return this._name;
  }
  set name(v: CarDao['_name']) {
    this._name = v;
    this.updProps.name = v;
  }

  get model(): CarDao['_model'] {
    return this._model;
  }
  set model(v: CarDao['_model']) {
    this._model = v;
    this.updProps.model = v;
  }

  get number(): CarDao['_number'] {
    return this._number;
  }
  set number(v: CarDao['_number']) {
    this._number = v;
    this.updProps.number = v;
  }

  get color(): CarDao['_color'] {
    return this._color;
  }
  set color(v: CarDao['_color']) {
    this._color = v;
    this.updProps.color = v;
  }
  get ownerId(): CarDao['_ownerId'] {
    return this._ownerId;
  }
  set ownerId(v: CarDao['_ownerId']) {
    this._ownerId = v;
    this.updProps.ownerId = v;
  }

  static makeGetByUdQuery(id: number): Prisma.CarFindUniqueArgs {
    return {
      where: {
        id,
      },
    };
  }
  makeCreateOneQuery(): Prisma.CarCreateArgs {
    return {
      data: {
        name: this.name,
        model: this.model,
        color: this.color,
        number: this.number,
        owner: {
          connect: {
            id: this.ownerId,
          },
        },
      },
    };
  }
  makeUpdateQuery(): Prisma.CarUpdateArgs {
    const up = Object.keys(this.updProps).reduce<Prisma.CarUpdateInput>(
      (acc, p) => {
        acc[p] = this[p];

        return acc;
      },
      {},
    );

    return {
      where: {
        id: this._id,
      },
      data: up,
    };
  }
  makeDeleteQuery(): Prisma.CarDeleteArgs {
    return {
      where: {
        id: this._id,
      },
    };
  }
}
