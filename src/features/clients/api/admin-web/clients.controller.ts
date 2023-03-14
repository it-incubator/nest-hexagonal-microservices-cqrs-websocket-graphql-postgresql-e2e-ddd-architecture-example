import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientsService } from '../../clients.service';
import { ClientsQueryRepository } from '../../db/clients.query.repository';
import { CreateClientUseCase } from '../../applications/use-cases/create-client.usecase';
import { CreateClientCommand } from '../../domain/entities/client.entity';
import { CommandBus } from '@nestjs/cqrs';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly clientsQueryRepository: ClientsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async create(@Body() createClientDto: CreateClientCommand) {
    console.log(createClientDto);
    const clientEntity = await this.commandBus.execute(createClientDto);
    return this.clientsQueryRepository.getById(clientEntity.id);
  }

  @Get()
  findAll() {
    return this.clientsQueryRepository.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.clientsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
