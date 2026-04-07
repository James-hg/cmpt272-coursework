// match the main parts of the imgbb upload response
export interface ImgBbUploadResponse {
    success: boolean;
    data?: {
        url: string;
    };
    error?: {
        message?: string;
    };
}

// match the basic shape jsonbin returns when reading data
export interface JsonBinReadResponse<T> {
    record: T;
}

// match the basic shape jsonbin returns after saving data
export interface JsonBinWriteResponse<T> {
    record: T;
}

// keep the part of the nominatim response we actually use
export interface NominatimReverseResponse {
    display_name?: string;
}
