import { HttpException, HttpStatus } from '@nestjs/common';

export class NotOwnerException extends HttpException {
  constructor() {
    super('This user is not the owner', HttpStatus.BAD_REQUEST);
  }
}
