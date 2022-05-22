import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { TokenPayload } from '../../auth/types';
import { CarService } from '../../data-object/car/car.service';
import { PostCarInput } from './dto';

@Controller('car')
@UseGuards(AuthGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  async addCar(@Req() req: TokenPayload, @Body() body: PostCarInput) {
    return this.carService.createCar({ ...body, ownerId: req.user.id });
  }
}
