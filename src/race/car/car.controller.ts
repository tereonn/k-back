import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CustomException } from '../../errors/customException';
import { NotPermitted, UpdObjectNotFound } from '../../errors/error_codes';
import { AuthGuard } from '../../auth/auth.guard';
import { TokenPayload } from '../../auth/types';
import { CarService } from '../../data-object/car/car.service';
import { DeleteCarQuery, PostCarInput, PutCarInput } from './dto';

@Controller('car')
@UseGuards(AuthGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  async addOne(@Req() req: TokenPayload, @Body() body: PostCarInput) {
    return this.carService.createCar({ ...body, ownerId: req.user.id });
  }

  @Get()
  async getUserCars(@Req() req: TokenPayload) {
    const data = await this.carService.getCarsByUser(req.user.id);

    return {
      cars: data.cars,
      id: data.id,
      name: data.UserInfo?.name ?? '',
    };
  }

  @Put()
  async updateData(@Req() req: TokenPayload, @Body() body: PutCarInput) {
    const car = await this.carService.getCarById(body.id);

    if (!car) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        UpdObjectNotFound.code,
        UpdObjectNotFound.text,
      );
    }

    if (car.ownerId !== req.user.id) {
      throw new CustomException(
        HttpStatus.FORBIDDEN,
        NotPermitted.code,
        NotPermitted.text,
      );
    }

    Object.keys(body.data).forEach((p) => (car[p] = body.data[p]));

    return this.carService.changeCarData(car);
  }

  @Delete()
  async deleteUserCar(@Req() req: TokenPayload, @Query() q: DeleteCarQuery) {
    const car = await this.carService.getCarById(q.id);

    if (car.ownerId !== req.user.id) {
      throw new CustomException(
        HttpStatus.FORBIDDEN,
        NotPermitted.code,
        NotPermitted.text,
      );
    }

    await this.carService.deleteUserCar(car);

    return true;
  }
}
