# KreuzWort

[Try it online :globe_with_meridians:](https://jonathanstriebel.de/kreuzwort)

[![](	https://img.shields.io/circleci/project/github/jstriebel/kreuzwort/master.svg?logo=circleci)](https://circleci.com/gh/jstriebel/kreuzwort)
[![](https://img.shields.io/github/license/jstriebel/kreuzwort.svg?colorB=00ff00)](https://github.com/jstriebel/kreuzwort/blob/master/LICENSE.txt)
[![Twitter](https://img.shields.io/twitter/url/http/jostriebel.svg?style=social)](https://twitter.com/jostriebel)


## About

KreuzWort is
* a [tool to create crossword puzzles](https://jonathanstriebel.de/kreuzwort),
* inspired by the ["Kreuz mit den Worten"](https://sz-magazin.sueddeutsche.de/tag/kreuzwortraetsel),
* therefore currently only in German, sorry.


## Development

Run the development commands either using node & yarn locally,
or via docker-compose:
```
docker-compose run --rm --service-ports dev
```

Then,
* install the dependencies using
  `yarn install --frozen-lockfile`,
* start the development server with
  `yarn start`
* :rocket:

To format the code run `yarn run prettier`.


## License

This project is licensed under the terms of the [MIT license](LICENSE.txt).
