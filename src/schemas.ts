import * as zod from 'zod';

export const DiffbotAPIResponseSchema = zod.object({
    type: zod.string(),
    title: zod.string().optional(),
    author: zod.string().optional(),
    date: zod.string().optional(),
    url: zod.string(),
    html: zod.string().optional(),
    markdown: zod.string(),
});