export interface Incubator {
    incubatorId?: string;
    sequence: number[];
    rotation: number;
    eggs: Egg[];
    times: number;
}

export interface Egg {
    id: number;
    rotated: number;
}
