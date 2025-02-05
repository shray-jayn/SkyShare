import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SEARCH_MESSAGES } from './constants/search.constants';
import { PrismaService } from 'prisma/prisma.service';
import { SearchRequestDto } from './dtos/search-request.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchFiles(searchRequestDto: SearchRequestDto) {
    const { query, limit = 10, offset = 0 } = searchRequestDto;
    const filters: any = {};

    console.log('Search request received:', searchRequestDto);

    try {
      // If query is provided, search by file name
      if (query && query.trim()) {
        const trimmedQuery = query.trim();
        console.log('Search query:', trimmedQuery);

        if (trimmedQuery.length > 100) {
          console.error('Query too long:', trimmedQuery);
          throw new HttpException(
            SEARCH_MESSAGES.INVALID_QUERY,
            HttpStatus.BAD_REQUEST,
          );
        }

        filters.fileName = {
          contains: trimmedQuery,
          mode: 'insensitive', // Case-insensitive search
        };
        console.log('Applied fileName filter:', filters.fileName);
      }
      
      // Validate limit and offset
      const sanitizedLimit = Math.min(Math.max(limit, 1), 100); // Limit between 1 and 100
      const sanitizedOffset = Math.max(offset, 0); // Ensure offset is non-negative
      console.log('Pagination parameters - Limit:', sanitizedLimit, 'Offset:', sanitizedOffset);

      // Log filter details
      console.log('Final filters being applied to query:', filters);

      // Execute query
      console.log('Executing search with filters:', filters);
      const results = await this.prisma.file.findMany({
        where: filters,
        take: sanitizedLimit,
        skip: sanitizedOffset,
        select: {
          id: true,
          fileName: true,
          type: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          isFavorite: true,
          status: true,
        },
      });

      console.log('Search results retrieved:', results);
      return results;
    } catch (error) {
      console.error('Error during search operation:', error.message);
      throw new HttpException(
        SEARCH_MESSAGES.SEARCH_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
