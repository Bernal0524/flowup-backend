import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// En controller
@UseGuards(AuthGuard('jwt'))