export interface Servicos {
    id: string;
    nome: string;
    imagem: string;
}

export interface JSONBinResponse {
    record: {
        record: Servicos[]; // Aqui informamos ao TypeScript que existe esse nível duplo
    };
    metadata: any;
}