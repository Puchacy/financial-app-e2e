/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginUserRequestDto } from '../models/LoginUserRequestDto';
import type { LoginUserResponseDto } from '../models/LoginUserResponseDto';
import type { RegisterUserRequestDto } from '../models/RegisterUserRequestDto';
import type { RegisterUserResponseDto } from '../models/RegisterUserResponseDto';
import type { UserDTO } from '../models/UserDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @returns RegisterUserResponseDto OK
     * @throws ApiError
     */
    public static postApiV1UsersRegister({
        requestBody,
    }: {
        requestBody?: RegisterUserRequestDto,
    }): CancelablePromise<RegisterUserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns LoginUserResponseDto OK
     * @throws ApiError
     */
    public static postApiV1UsersLogin({
        requestBody,
    }: {
        requestBody?: LoginUserRequestDto,
    }): CancelablePromise<LoginUserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserDTO OK
     * @throws ApiError
     */
    public static getApiV1UsersMe(): CancelablePromise<UserDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
        });
    }
}
