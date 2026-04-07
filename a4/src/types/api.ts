export interface ImgBbUploadResponse {
    success: boolean;
    data?: {
        url: string;
    };
    error?: {
        message?: string;
    };
}

export interface JsonBinReadResponse<T> {
    record: T;
}

export interface JsonBinWriteResponse<T> {
    record: T;
}

export interface NominatimReverseResponse {
    display_name?: string;
}
