import { TokenUsage } from "../chat";

export interface RAGForm {
    question: string;
}

export interface RAGMessage {
    role: "user" | "assistant";
    content: string;
    usage?: TokenUsage;
}
