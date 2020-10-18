export class Comment {
    rating: number;
    comment: string;
    author: string;
    date: string;
}

var d = new Date();
export const dateISO = d.toISOString();