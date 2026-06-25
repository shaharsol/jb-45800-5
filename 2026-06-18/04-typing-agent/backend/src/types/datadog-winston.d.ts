declare module 'datadog-winston' {
  import Transport from 'winston-transport';

  interface DatadogWinstonOptions {
    apiKey: string;
    hostname?: string;
    service?: string;
    ddsource?: string;
    ddtags?: string;
    intakeRegion?: string;
  }

  class DatadogWinston extends Transport {
    constructor(options: DatadogWinstonOptions);
  }

  export = DatadogWinston;
}
