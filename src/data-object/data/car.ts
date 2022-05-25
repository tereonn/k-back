import { Prisma } from '@prisma/client';

export type CarData = {
  name: string;
  model: string;
  number: string;
  color: string;
  ownerId: number;
};

export class CarDao {
  private id: number;
  name: string;
  model: string;
  number: string;
  color: string;
  ownerId: number;

  private constructor() {}
  static fromData(data: CarData) {
    const c = new CarDao();
    c.name = data.name;
    c.model = data.model;
    c.number = data.number;
    c.color = data.color;
    c.ownerId = data.ownerId;

    return c;
  }

  getCreateOne(): Prisma.CarCreateArgs {
    return {
      data: {
        name: this.name,
        model: this.model,
        color: this.color,
        number: this.number,
        User: {
          connect: {
            id: this.ownerId,
          },
        },
      },
    };
  }
}
