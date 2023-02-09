# Logger

Logger is exported as cached module, so you will have only 1 instance of logger
in project. Also module exports functional wrappers around logger methods, so
you free to use it in functional way.

You can specify log level by calling: Logger.init() or simply Init() and pass
preferred level.

Log level argument is case insensitive. Options are:

- error - so only errors will be displayed
- info - errors and info messages will be displayed
- debug - all except log messages will be displayed
- all

Also you can send your errors to sentry. To use this you must provide sentry
config when initializing logger instance

## Example

```javascript
'use strict';

const { Log, Err, Info, Debug, Init } = require('logger');

Init('all'); // optional method

Log('some data');
Debug('some data');
Info('some data');
Err('some error log');
```

### Initialization params

All constructor params are optional, such as init method call

- `logLevel` - log level described above
- `sentryConfig` - config for Sentry
  - `dsn` - dsn for Sentry project
  - `environment` - environment for Sentry ('prod', 'test', 'dev', 'local', if
    'local' provided - Sentry will be turned off)
- `throttleParams`:
  - `maxLength` - max length of the map with last errors
  - `delay` - delay between displaying same error
- `tags` - object with tags, where tag will be object key, and value - its value
