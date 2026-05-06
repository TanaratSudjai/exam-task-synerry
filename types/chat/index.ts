export interface ChatSessionRow {
    id: number;
    client_id: number;
    title: string;
    created_at: string;
    updated_at: string;
    first_msg?: string;
}

export interface ChatMessageRow {
    id: number;
    session_id: number;
    role: "user" | "assistant";
    content: string;
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    total_time?: number;
    created_at: string;
}

export interface TokenUsage {
    queue_time: number;
    prompt_tokens: number;
    prompt_time: number;
    completion_tokens: number;
    completion_time: number;
    total_tokens: number;
    total_time: number;
}

export interface Source {
    id: number;
    content: string;
    score: number;
}

export interface Message {
    role: "user" | "assistant";
    content: string;
    usage?: TokenUsage;
    sources?: Source[];
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


export interface ContentRendererProps {
    content: string;
    sources?: Source[];
}