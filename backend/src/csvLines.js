import * as fs from 'fs';
import * as csv from 'fast-csv';

export const getData = (path, fn, delimiter = ',') => {
  return new Promise(resolve => {
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true, delimiter }))
      .on('data', fn)
      .on('end', () => {
        resolve()
      })
  });
}

export const jsonOut = (d) => console.log(JSON.stringify(d, null, 2))

export const getLines = (csvLinesPath) => {
  const lines = []
  return getData(csvLinesPath, (data) => {
    // TODO: Convert the column names here
    const { character, direction, line } = data;
    lines.push({
      character: character,
      direction: direction,
      line: line
    })
  }).then(() => lines)
}
