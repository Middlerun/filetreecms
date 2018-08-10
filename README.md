# FileTreeCMS

FileTreeCMS is an Express-based static file server which also lets clients query directory contents. It is intended for use as a headless CMS for people who don't need fancy GUIs.

## Setup

Put your content files in the `content` directory (under the project root), or specify a custom directory with the `CONTENTROOT` environment variable.

Install dependencies:

```
yarn install
```

Start the server:

```
node src/index.js
```

or just:

```
yarn start
```

## Getting content

A list of files in the root directory can be found at:

```
http://[host]:[port]/content/
```

The response is a JSON object showing available files and subdirectories in this format:

```json
{
  "type": "directory",
  "contents": [
    {
      "name": "foo",
      "path": "/content/foo"
    },
    {
      "name": "bar.txt",
      "path": "/content/bar.txt"
    }
  ]
}
```

## Content metadata

Each directory can have a `.meta.yml` file which specifies metadata for files in that directory.

Example `.meta.yml`:

```yaml
foo:
  description: This is a folder with more content
bar.txt:
  description: This is an example text file
  authors:
  - Quincy Rathbone
  - Monty Snrub
```

Querying the directory would then yield:

```json
{
  "type": "directory",
  "contents": [
    {
      "name": "foo",
      "path": "/content/foo",
      "meta": {
        "description": "This is a folder with more content"
      }
    },
    {
      "name": "bar.txt",
      "path": "/content/bar.txt",
      "meta": {
        "description": "This is an example text file",
        "authors": [
          "Quincy Rathbone",
          "Monty Snrub"
        ]
      }
    }
  ]
}
```

Note that the `.meta.yml` file is not listed in the response despite being in that directory (see next section).

## Hidden files

Any files with filenames starting with a dot are considered hidden. They won't be available via the server, and are excluded from file lists.

Folders starting with a dot are also excluded from file lists, but their contents are still available.

## License

Copyright 2018 Eddie McLean

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
