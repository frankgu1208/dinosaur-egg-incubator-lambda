export interface ApiResult {
    report?: {
        number_of_eggs: number;
        sequence: string;
        rotation_amount: number;
        rotations: Array<{
            egg: number;
            was_rotated: number;
        }>;
    };
}

export interface ApiInput {
    number_of_eggs: number;
    sequence: string;
    rotation_amount: number;
}
