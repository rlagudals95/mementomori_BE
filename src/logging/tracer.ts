import { toBoolean } from '@utils/cast.util';
import tracer from 'dd-trace';

if (!toBoolean(process.env.CONSOLE_LOGGING)) {
  tracer.init({
    // https://docs.datadoghq.com/tracing/connect_logs_and_traces/nodejs/
    logInjection: true,
  });
  tracer.use('http', {
    blocklist: ['/profiling/v1/input'],
  });
}
export default tracer;
