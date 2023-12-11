import Token from '../token';
import Lexer from '../index';

export default abstract class Tokenizer {
    public abstract parse(lexer: Lexer):  Token | null;
}