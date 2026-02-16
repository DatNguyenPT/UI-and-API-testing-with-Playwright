import { APIRequestContext, expect } from '@playwright/test';

export class BaseApi {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async get(
    url: string,
    params?: Record<string, string | number>,
    headers?: Record<string, string>
  ) {
    const response = await this.request.get(url, {
      params,
      headers,
    });
    return response;
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

  protected async put(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ) {
    const response = await this.request.put(url, {
      data,
      headers,
    });
    return response;
  }

  protected async patch(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ) {
    const response = await this.request.patch(url, {
      data,
      headers,
    });
    return response;
  }

  protected async delete(
    url: string,
    headers?: Record<string, string>
  ) {
    const response = await this.request.delete(url, {
      headers,
    });
    return response;
  }
}
