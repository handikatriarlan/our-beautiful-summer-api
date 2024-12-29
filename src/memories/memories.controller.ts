import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto, UpdateMemoryDto } from './dto/memory.dto';

@ApiTags('memories')
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new memory' })
  @UseInterceptors(FileInterceptor('photo'))
  async createMemory(
    @Body() createMemoryDto: CreateMemoryDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException('Photo is required');
    }
    return this.memoriesService.create(createMemoryDto, photo);
  }

  @Get()
  @ApiOperation({ summary: 'Get all memories' })
  async getAllMemories() {
    return this.memoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a memory by id' })
  async getMemory(@Param('id') id: string) {
    return this.memoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a memory' })
  @UseInterceptors(FileInterceptor('photo'))
  async updateMemory(
    @Param('id') id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.memoriesService.update(id, updateMemoryDto, photo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a memory' })
  async deleteMemory(@Param('id') id: string) {
    return this.memoriesService.remove(id);
  }
}
