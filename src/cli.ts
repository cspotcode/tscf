#!/usr/bin/env node
import { tsclone as TSTsc } from './copied-from-tsc/tsc';

function main() {
    TSTsc.executeCommandLine(ts.sys.args);
}

main();