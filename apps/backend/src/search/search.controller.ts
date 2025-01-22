import { Controller, Get, Query, HttpCode, HttpStatus, Post, Body, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchRequestDto } from './dtos/search-request.dto';
import { SEARCH_MESSAGES } from './constants/search.constants';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async searchFiles(@Body() searchRequestDto: SearchRequestDto) {
    try {
      const results = await this.searchService.searchFiles(searchRequestDto);
      return {
        message: SEARCH_MESSAGES.SEARCH_SUCCESS,
        data: results,
      };
    } catch (error) {
      console.error('Error during search operation:', error.message);
      return {
        message: SEARCH_MESSAGES.SEARCH_FAILED,
        error: error.message,
      };
    }
  }
}