import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('../assets/tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skip_empty_lines: true,
  from_line: 2
});

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const importCsv = async () => {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    });

    console.log(line);
    await delay(1000);
  };
};

importCsv();