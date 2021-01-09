import { Brainly, IOptions, IMiddlewareParams, IEnumLanguage } from './src/brainly';
declare const brainly: (question: string, options?: IOptions) => Promise<{
    status: boolean;
    message: string;
    url: string;
    data: import("./src/brainly").IRequestResult[];
    options: import("./src/brainly").IOptionsDefault;
    error?: undefined;
} | {
    status: boolean;
    message: string;
    error: any;
    url: string;
    options: import("./src/brainly").IOptionsDefault;
    data?: undefined;
}>;
export default brainly;
export { Brainly, IOptions, IMiddlewareParams, IEnumLanguage };
