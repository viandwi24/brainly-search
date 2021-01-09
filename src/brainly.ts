import axios, { AxiosRequestConfig } from 'axios';

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

export enum IEnumLanguage {
    id = 'id',
    us = 'us'
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

export class Brainly {
    options: IOptionsDefault = {
        graphql: `query SearchQuery($query: String!, $first: Int!, $after: ID) {\n        questionSearch(query: $query, first: $first, after: $after) {\n                edges {\n                        node {\n                                content\n                                answers {\n                                        nodes {\n                                                content\n                                        }\n                                }\n                        }\n                }\n        }\n}\n`,
        axios: {
            headers: {
                'host': 'brainly.co.id',
                'content-type': 'application/json; charset=utf-8',
                'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:65.0) Gecko/20100101 Firefox/65.0'
            }
        },
        language: IEnumLanguage.us,
        count: 10
    };
    middlewares: Array<IMiddleware> = [];

    constructor(options = {}) {
        this.options = (<any>Object).assign(this.options, options);
        this.setup();
    }

    public async get(question: string) {
        var url = `https://brainly.com/graphql/${this.options.language}`;
        
        // 
        try {
            var request = await (axios.post(url, this.buildQuery(question), this.options.axios));
            var result = this.getPrettyRequestResult(request.data.data.questionSearch.edges);
            return {
                status: true,
                message: 'get data success',
                url,
                data: result,
                options: this.options
            };
        } catch (error) {
            return {
                status: false,
                message: 'get data failed',
                error,
                url,
                options: this.options
            };
        }
    }

    public addMiddleware(name: string, func: Function) {
        this.middlewares.push({ name, func });
    }

    private setup() {
        // add default middleware
        this.middlewares.push({
            name: 'default',
            func: (data: IMiddlewareParams) => data
        });
    }

    private runMiddleware(data: IMiddlewareParams): IMiddlewareParams {
        var middlewares = [...this.middlewares];
        var next = function (params: IMiddlewareParams): IMiddlewareParams {
            if (middlewares.length > 0) {
                var output = middlewares[0].func(params);
                middlewares.splice(0, 1);
                return next(output) as IMiddlewareParams;
            }
            return params as IMiddlewareParams;
        };
        return next(data);
    }

    private getPrettyRequestResult(data: any): Array<IRequestResult> {
        var output: Array<IRequestResult> = [];
        if (Array.isArray(data)) {
            data.forEach((value: any, index: any) => {
                var e = value.node;
                var dataToParse = {
                    question: e.content,
                    answers: e.answers.nodes
                } as IMiddlewareParams;
                var dataParsed = this.runMiddleware(dataToParse);
                output.push(dataParsed);
                // console.log(dataParsed.question + '\n\n')
            });
        }
        return output;
    }

    private buildQuery(question: string) {
        return {
            'operationName': 'SearchQuery',
            'variables': {
                'query': question,
                'after': null,
                'first': this.options.count
            },
            'query': this.options.graphql
        };
    }
}