export interface TokenUsage {
    queue_time: number;
    prompt_tokens: number;
    prompt_time: number;
    completion_tokens: number;
    completion_time: number;
    total_tokens: number;
    total_time: number;
}

export interface Message {
    role: "user" | "assistant";
    content: string;
    usage?: TokenUsage;
}

export interface ChatSession {
    id: number;
    title: string;
    created_at: string;
    first_msg?: string;
}

export interface ChatForm {
    message: string;
}
