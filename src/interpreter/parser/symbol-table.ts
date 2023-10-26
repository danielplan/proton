import Sym from './symbol';

type Symb = Sym<any>;
export default class SymbolTable {
    private symbols: Map<string, Symb> = new Map();

    public add(symbol: Symb): void {
        this.symbols.set(symbol.name, symbol);
    }

    public get(name: string): Symb | null {
        return this.symbols.get(name) || null;
    }

    public has(name: string): boolean {
        return this.symbols.has(name);
    }

    public remove(name: string): void {
        this.symbols.delete(name);
    }

    public clear(): void {
        this.symbols.clear();
    }

    public getSymbols(): Symb[] {
        return Array.from(this.symbols.values());
    }

    public getSymbolNames(): string[] {
        return Array.from(this.symbols.keys());
    }

    public getSymbolCount(): number {
        return this.symbols.size;
    }

    public getSymbolNamesAsString(): string {
        return this.getSymbolNames().join(', ');
    }
}
