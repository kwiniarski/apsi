# Changelog

## 0.4.0 / TBA

### New features and changes

* [new] Added changelog.
* [new] Added code style checking with JSCS.
* [new] More flexible policies configuration which now supports wildcards.
* [new] Verbose application boot time information (with debug).
* [new] Unique ID has been added to each request to join entries from error log and access log.
* [new] Configurable access log: format, logging levels.
* [new] Configuration option to include or not stack traces in error log.
* Association of models now requires class level method which has to return association configuration instead of making association.
* Unit tests rewritten from CoffeeScript to JavaScript.

### Bug fixes

* Controller methods with reserved name (`find`, `update`, `create`, `destroy`) where mounted using action name instead of equivalent blueprint `mountPath`.
