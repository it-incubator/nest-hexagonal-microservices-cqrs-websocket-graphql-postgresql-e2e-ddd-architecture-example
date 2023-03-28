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
  BadRequestException,
} from '@nestjs/common';
import { ClientsService } from '../../clients.service';
import {
  ClientsQueryRepository,
  ClientViewModel,
} from '../../db/clients.query.repository';
import {
  Client,
  CreateClientCommand,
  UpdateClientCommand,
} from '../../domain/entities/client.entity';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteClientCommand } from '../../applications/use-cases/delete-client.usecase';
import { ResultNotification } from '../../../../core/validation/notification';
import { ClientCrudApiService } from '../services/base-crud-api.service';

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
    private readonly clientCrudApiService: ClientCrudApiService,
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
    return this.clientCrudApiService.create(createClientCommand);
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
