### Logger

logger is exported as cached module, so you will have only 1 instance of logger
in project. Also module exports functional wrappers around logger methods, so
you free to use it in functional way. You can specify log level by calling
Logger.init() or simply Init() and pass preferred level. Log level argument is
case insensitive. Options are:

- error - so only errors will be displyed
- info - errors and info messages will be displayed
- debug - all except log messages will be displayed
- all
