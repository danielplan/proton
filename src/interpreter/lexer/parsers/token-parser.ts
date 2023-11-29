import Token from '../token';
import Lexer from '../index';

export default abstract class TokenParser {
    public abstract parse(lexer: Lexer):  Token | null;
}