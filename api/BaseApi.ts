import { APIRequestContext, expect } from '@playwright/test';

export class BaseApi {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async post(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ) {
    const response = await this.request.post(url, {
      data,
      headers,
    });

    return response;
  }
}
