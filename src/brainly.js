"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brainly = exports.IEnumLanguage = void 0;
const axios_1 = require("axios");
var IEnumLanguage;
(function (IEnumLanguage) {
    IEnumLanguage["id"] = "id";
    IEnumLanguage["us"] = "us";
})(IEnumLanguage = exports.IEnumLanguage || (exports.IEnumLanguage = {}));
class Brainly {
    constructor(options = {}) {
        this.options = {
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
        this.middlewares = [];
        this.options = Object.assign(this.options, options);
        this.setup();
    }
    get(question) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = `https://brainly.com/graphql/${this.options.language}`;
            // 
            try {
                var request = yield (axios_1.default.post(url, this.buildQuery(question), this.options.axios));
                var result = this.getPrettyRequestResult(request.data.data.questionSearch.edges);
                return {
                    status: true,
                    message: 'get data success',
                    url,
                    data: result,
                    options: this.options
                };
            }
            catch (error) {
                return {
                    status: false,
                    message: 'get data failed',
                    error,
                    url,
                    options: this.options
                };
            }
        });
    }
    addMiddleware(name, func) {
        this.middlewares.push({ name, func });
    }
    setup() {
        // add default middleware
        this.middlewares.push({
            name: 'default',
            func: (data) => data
        });
    }
    runMiddleware(data) {
        var middlewares = [...this.middlewares];
        var next = function (params) {
            if (middlewares.length > 0) {
                var output = middlewares[0].func(params);
                middlewares.splice(0, 1);
                return next(output);
            }
            return params;
        };
        return next(data);
    }
    getPrettyRequestResult(data) {
        var output = [];
        if (Array.isArray(data)) {
            data.forEach((value, index) => {
                var e = value.node;
                var dataToParse = {
                    question: e.content,
                    answers: e.answers.nodes
                };
                var dataParsed = this.runMiddleware(dataToParse);
                output.push(dataParsed);
                // console.log(dataParsed.question + '\n\n')
            });
        }
        return output;
    }
    buildQuery(question) {
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
exports.Brainly = Brainly;
exports.default = Brainly;
