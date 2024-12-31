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
import 'multer';

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

    try {
      const createdMemory = await this.memoriesService.create(
        createMemoryDto,
        photo,
      );
      return {
        status: 'success',
        message: 'Memory created successfully',
        data: createdMemory,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all memories' })
  async getAllMemories() {
    const memories = await this.memoriesService.findAll();
    return {
      status: 'success',
      message: 'Memories retrieved successfully',
      data: memories,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a memory by id' })
  async getMemory(@Param('id') id: string) {
    try {
      const memory = await this.memoriesService.findOne(id);
      return {
        status: 'success',
        message: 'Memory retrieved successfully',
        data: memory,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a memory' })
  @UseInterceptors(FileInterceptor('photo'))
  async updateMemory(
    @Param('id') id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    try {
      const updatedMemory = await this.memoriesService.update(
        id,
        updateMemoryDto,
        photo,
      );
      return {
        status: 'success',
        message: 'Memory updated successfully',
        data: updatedMemory,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a memory' })
  async deleteMemory(@Param('id') id: string) {
    try {
      await this.memoriesService.remove(id);
      return {
        status: 'success',
        message: 'Memory deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
