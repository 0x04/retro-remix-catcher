# retro-remix-catcher

![retro-remix-catcher-logo](assets/logo.png)

A tiny CLI script for collecting audio file links from retro game remix
websites and store them as M3U playlist file.


## Installation

Using NPM:

```
$ npm install --global @0x04/retro-remix-catcher
```


## Usage

```
$ retro-remix-catcher --help

Usage: retro-remix-catcher [options] <output-file>

Options:
  -v, --version            output the version number
  -h, --host <host>        host without protocol
  -p, --path <path>        path - `${page}` is the placeholder of current page
  -s, --start <n>          start page (default: "1")
  -e, --end <n>            end page
  -x, --exclude <exclude>  regex to exclude specific links
  -t, --types <types>      comma separated list of file types (default: "mp3")
  --ssl                    use ssl (default: true)
  --no-ssl                 don't use ssl
  --help                   display help for command
```


## Support sites

This script is working with:

* [amigaremix.com][AmigaRemix] 
* [remix.kwed.org][RKO] 

Other sites may also work.


### Examples

#### [amigaremix.com][AmigaRemix]

Get pages from `1` to `32` and save it as "[atari.remix.org.m3u][ExampleM3U_AmigaRemix]":

```
$ retro-remix-catcher -h amigaremix.com -p '/remixes/${page}/' -s 1 -e 32 amigaremix.com.m3u
```

#### [remix.kwed.org][RKO]

Get pages from `1` to `15`, exclude every filename that contains "(extract)" and save it as "[remix.kwed.org.m3u][ExampleM3U_RKO]":

```
$ retro-remix-catcher -h remix.kwed.org -p '/?page=${page}' -s 1 -e 15 -x '\(extract\)' remix.kwed.org.m3u
```

#### Example M3U files

Generated M3U files from the usage examples above:

* [atari.remix.org.m3u][ExampleM3U_AmigaRemix]
* [remix.kwed.org.m3u][ExampleM3U_RKO]


## Acknowledgements

* Baum Inventions for the initial idea
* AmigaRemix Crew for their awesome site [amigaremix.com][AmigaRemix]
* RKO Crew for their awesome site [remix.kwed.org][RKO]
* Every artist/creator of these wonderful pieces of music


## License

[MIT][license]


<!-- Links -->
[license]: ./license.md
[RKO]: https://remix.kwed.org
[AmigaRemix]: https://amigaremix.com
[ExampleM3U_AmigaRemix]: ./example-files/amigaremix.com.m3u
[ExampleM3U_RKO]: ./example-files/remix.kwed.org.m3u
