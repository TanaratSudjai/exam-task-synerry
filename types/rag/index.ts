import { TokenUsage } from "../chat";

export interface RAGForm {
    question: string;
}

export interface RAGMessage {
    role: "user" | "assistant";
    content: string;
    usage?: TokenUsage;
    sources?: import("../chat").Source[];
}
export interface Chunk {
    id: string | number;
    content: string;
    embedding: number[];
}

export interface ScoredChunk extends Chunk {
    score: number;
}
