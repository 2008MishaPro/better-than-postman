import { net } from 'electron';

interface FetchOptions<TBody = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: TBody;
  queryParams?: Record<string, string | number | boolean>;
}

export async function fetchData<TResponse = any, TBody = any>(
  url: string,
  options: FetchOptions<TBody> = { method: 'GET' }
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    try {
      // Добавляем query-параметры к URL
      const queryString = options.queryParams
        ? `?${new URLSearchParams(options.queryParams as Record<string, string>).toString()}`
        : '';

      const fullUrl = url + queryString;
      const request = net.request({
        method: options.method,
        url: fullUrl
      });

      // Устанавливаем заголовки
      request.setHeader('Content-Type', 'application/json');
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          request.setHeader(key, value);
        });
      }

      // Обработка ответа
      request.on('response', (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          if (!response.statusCode || response.statusCode >= 400) {
            reject(new Error(`HTTP error! status: ${response.statusCode}`));
            return;
          }

          // Для 204 No Content
          if (response.statusCode === 204) {
            resolve(null as unknown as TResponse);
            return;
          }

          try {
            const jsonData = data ? JSON.parse(data) : null;
            resolve(jsonData as TResponse);
          } catch (parseError) {
            reject(new Error(`Failed to parse JSON: ${parseError}`));
          }
        });
      });

      // Обработка ошибок
      request.on('error', (error) => {
        reject(error);
      });

      // Отправляем тело запроса, если есть
      if (options.body) {
        request.write(JSON.stringify(options.body));
      }

      request.end();
    } catch (error) {
      reject(error);
    }
  });
}
