[![Build Status](https://img.shields.io/travis/kwiniarski/surf.svg?style=flat-square)](https://travis-ci.org/kwiniarski/surf)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/kwiniarski/surf.svg?style=flat-square)](https://codeclimate.com/github/kwiniarski/surf)
[![Code Climate](https://img.shields.io/codeclimate/github/kwiniarski/surf.svg?style=flat-square)](https://codeclimate.com/github/kwiniarski/surf)
[![Gemnasium](https://img.shields.io/gemnasium/kwiniarski/surf.svg?style=flat-square)](https://gemnasium.com/kwiniarski/surf)

# Surf

Simple RESTful API framework for Node.js build on the top of Express.

## Note

This software is under development. It's not ready for use yet. Moreover it uses
[Sequelize](https://github.com/sequelize/sequelize.git) 2.0.0 RC version.

## Installation

```
npm install surfjs --save
```

## Testing

Before you can run tests make sure you have `devDependencies` installed. Also you will
need working MySQL database with `test_surf` database ([more on that here](docs/test.md)).
To run test suite just use:

```
npm test
```

To generate test coverage report run:

```
grunt coverage
```

Report will be created in `./.grunt` dir. Make sure to have `grunt-cli` installed
globally before you use Grunt.

## License

The MIT License (MIT)

Copyright (c) 2014-2015 Krzysztof Winiarski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
