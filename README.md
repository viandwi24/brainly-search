# Brainly Search API / Scraper
Library for make you can easy search or scraper Brainly. And You can easy customization!

## Features
| Feature |
|---------|
| Http Client With Axios|
| Can customize Axios Configuration|
| Middleware for parsing every data|
| Can customize query getter|
| Can change language|
| Can limit count data get|
| Typescript support|

---

## Example use
### Simple way
```
const brainly = require('brainly-search');
brainly('why computer need ram to running?')
    .then((result) => console.log(result));
```
### Simple way with configuration
```
const brainly = require('brainly-search');
brainly('why computer need ram to running?', { language: 'id' })
    .then((result) => console.log(result));
```
### Make instance
```
import { Brainly } from "brainly-search";

const brainlyInstance = new Brainly({ language: 'id' });

brainlyInstance.get('why computer need ram to running?')
    .then((result) => console.log(result));
```
### Options passing
```
import { Brainly } from "brainly-search";

const brainlyInstance = new Brainly({ language: 'id', count: 10 });

var options2 = { count: 10, language: 'us' };

brainlyInstance.get('why computer need ram to running?', options2)
    .then((result) => console.log(result));
```

---
## Output
### Success 
```
{
  status: true,
  message: 'get data success',
  url: 'https://brainly.com/graphql/us',
  data: [
    {
      question: 'apa itu ALLAH? Jelaskanlah jawabanmu',
      answers: [
          {
            content: 'example anwers',
          }
      ]
    },
    {
      question: 'apakah scanner itu dan apa pula fungsinya',
      answers: [
          {
            content: 'example anwers',
          }
      ]
    },
  ],
  options: {
    graphql: 'query SearchQuery($query: String!, $first: Int!, $after: ID) {\n' +
      '        questionSearch(query: $query, first: $first, after: $after) {\n' +
      '                edges {\n' +
      '                        node {\n' +
      '                                content\n' +
      '                                answers {\n' +
      '                                        nodes {\n' +
      '                                                content\n' +
      '                                        }\n' +
      '                                }\n' +
      '                        }\n' +
      '                }\n' +
      '        }\n' +
      '}\n',
    axios: { headers: [Object] },
    language: 'us',
    count: 2,
    query: [Object]
  }
}
```