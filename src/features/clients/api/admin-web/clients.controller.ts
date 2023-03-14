import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ClientsService } from '../../clients.service';
import { ClientsQueryRepository } from '../../db/clients.query.repository';
import {
  CreateClientCommand,
  UpdateClientCommand,
} from '../../domain/entities/client.entity';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteClientCommand } from '../../applications/use-cases/delete-client.usecase';

const baseUrl = '/clients';

export const endpoints = {
  findAll: () => baseUrl,
  findOne: (id: string) => `${baseUrl}/${id}`,
  create: () => baseUrl,
  updateOne: (id: string) => `${baseUrl}/${id}`,
  deleteOne: (id: string) => `${baseUrl}/${id}`,
};

@Controller(baseUrl)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly clientsQueryRepository: ClientsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  findAll() {
    return this.clientsQueryRepository.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const client = await this.clientsQueryRepository.getById(id);
    if (!client) throw new NotFoundException();
    return client;
  }

  @Post()
  async create(@Body() createClientCommand: CreateClientCommand) {
    const clientEntity = await this.commandBus.execute(createClientCommand);
    return this.clientsQueryRepository.getById(clientEntity.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientCommand: UpdateClientCommand,
  ) {
    updateClientCommand.id = id;
    await this.commandBus.execute(updateClientCommand);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteClientCommand(id));
  }
}
