import { AxiosRequestConfig } from 'axios';
export interface IMiddleware {
    name: string;
    func: Function;
}
export interface IRequestResultAnswer {
    content: string;
}
export interface IRequestResult {
    question: string;
    answers: Array<IRequestResultAnswer>;
}
export interface IMiddlewareParams {
    question: string;
    answers: Array<IRequestResultAnswer>;
}
export declare enum IEnumLanguage {
    id = "id",
    us = "us"
}
export interface IOptionsDefault {
    graphql: string;
    axios: AxiosRequestConfig;
    language: IEnumLanguage;
    count: number;
}
export interface IOptions {
    graphql?: string;
    axios?: AxiosRequestConfig;
    language?: IEnumLanguage;
    count?: number;
}
export declare class Brainly {
    options: IOptionsDefault;
    middlewares: Array<IMiddleware>;
    constructor(options?: {});
    get(question: string): Promise<{
        status: boolean;
        message: string;
        url: string;
        data: IRequestResult[];
        options: IOptionsDefault;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        url: string;
        options: IOptionsDefault;
        data?: undefined;
    }>;
    addMiddleware(name: string, func: Function): void;
    private setup;
    private runMiddleware;
    private getPrettyRequestResult;
    private buildQuery;
}
