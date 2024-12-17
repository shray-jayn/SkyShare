import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  private convertBigInt(value: any): any {
    if (value === null || value === undefined) return value;
    if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to string
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.convertBigInt(item));
    }
    if (typeof value === 'object') {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          acc[key] = this.convertBigInt(val);
          return acc;
        },
        {} as Record<string, any>,
      );
    }
    return value;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.convertBigInt(data)));
  }
}
