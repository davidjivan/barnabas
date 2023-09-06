import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

const documentsDirectory = path.join(process.cwd(), 'app', 'documents');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const filenames = fs.readdirSync(documentsDirectory);

    const documents = filenames.map(filename => {
        const id = filename.replace(/\.md$/, '');
        const fullPath = path.join(documentsDirectory, filename);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        return {
            id,
            title: id,
            content: fileContents
        };
    });

    res.json(documents);
}
