import { StageDao } from './stage';

export class SeasonDao {
  private _id: number | null = null;
  private _year: number | null = null;
  private _stages: StageDao[] = [];

  private updProps: Partial<SeasonDao> = {};
  private constructor() {}
  static fromYear(y: number): SeasonDao {
    const e = new SeasonDao();
    e._year = y;

    return e;
  }
  static fromYearId(y: number, id: number): SeasonDao {
    const e = new SeasonDao();
    e._year = y;
    e._id = id;

    return e;
  }

  get year() {
    return this._year;
  }
  set year(y: number) {
    this.updProps.year = y;
    this._year = y;
  }

  get stages() {
    return this._stages;
  }

  get id() {
    return this._id;
  }
  set id(id: number) {
    this._id = id;
  }

  addStages(stages: StageDao[]): SeasonDao {
    if (stages.some((s) => s.id === null || s.id === undefined)) {
      throw new Error("Can't add stage without id");
    }
    this._stages.push(...stages);

    return this;
  }
  removeStage(stage: StageDao): SeasonDao {
    this._stages = this._stages.filter((s) => s.id !== stage.id);

    return this;
  }
}
