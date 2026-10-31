import {WorkerEntrypoint} from 'cloudflare:workers';
import {reportSeriesUsage} from './series-usage.js';
import {runCloudChapterQuestions} from './cloud-questions.js';

// Capability-scoped service bindings. No HTTP route, read method or caller-selected source.
export class AlgorithmUsage extends WorkerEntrypoint {
 report(snapshot){return reportSeriesUsage(this.env,'cloud-algorithm',snapshot);}
}
export class ScheduleUsage extends WorkerEntrypoint {
 report(snapshot){return reportSeriesUsage(this.env,'cloud-schedule',snapshot);}
}
export class LedgerUsage extends WorkerEntrypoint {
 report(snapshot){return reportSeriesUsage(this.env,'cloud-ledger',snapshot);}
}
// The series clock has this single capability, with no DB/key or private-text response.
export class LanguageAPIExecutor extends WorkerEntrypoint {
 run(){return runCloudChapterQuestions(this.env);}
}
