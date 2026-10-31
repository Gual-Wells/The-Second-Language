import {WorkerEntrypoint} from 'cloudflare:workers';
import {reportSeriesUsage} from './series-usage.js';
import {runCloudChapterQuestions} from './cloud-questions.js';
import {storageRequestEnvironment} from './storage.js';
import {reportSeriesStorage,seriesStoragePolicy} from './series-storage.js';

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
 run(){return runCloudChapterQuestions(storageRequestEnvironment(this.env));}
}
// Separate policy/aggregate capabilities. These never fetch another project's data.
export class AlgorithmStorage extends WorkerEntrypoint {
 policy(){return seriesStoragePolicy('algorithm');}
 report(snapshot){return reportSeriesStorage(this.env,'algorithm',snapshot);}
}
export class ScheduleStorage extends WorkerEntrypoint {
 policy(){return seriesStoragePolicy('schedule');}
 report(snapshot){return reportSeriesStorage(this.env,'schedule',snapshot);}
}
export class LedgerStorage extends WorkerEntrypoint {
 policy(){return seriesStoragePolicy('ledger');}
 report(snapshot){return reportSeriesStorage(this.env,'ledger',snapshot);}
}
