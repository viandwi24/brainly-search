import { Brainly, IOptions, IMiddlewareParams, IEnumLanguage } from './src/brainly';

const brainly = async (question: string, options: IOptions = {}) => {
  return await (new Brainly(options)).get(question);
}

export default brainly;
export {
  Brainly,
  IOptions,
  IMiddlewareParams,
  IEnumLanguage
};
module.exports = brainly;