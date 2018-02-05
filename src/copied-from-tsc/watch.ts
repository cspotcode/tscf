import { FormatDiagnosticsHost, DiagnosticReporter, sys, System, formatDiagnosticsWithColorAndContext, Diagnostic, createGetCanonicalFileName, ProgramToEmitFilesAndReportErrors, addRange, sortAndDeduplicateDiagnostics, forEach, getNormalizedAbsolutePath, ExitStatus } from 'byots';

export namespace tsclone {
    /**
     * Helper that emit files, report diagnostics and lists emitted and/or source files depending on compiler options
     */
    export function emitFilesAndReportErrors(program: ProgramToEmitFilesAndReportErrors, reportDiagnostic: DiagnosticReporter, writeFileName?: (s: string) => void) {
        // First get and report any syntactic errors.
        const diagnostics = program.getSyntacticDiagnostics().slice();
        let reportSemanticDiagnostics = false;

        // If we didn't have any syntactic errors, then also try getting the global and
        // semantic errors.
        if (diagnostics.length === 0) {
            addRange(diagnostics, program.getOptionsDiagnostics());
            addRange(diagnostics, program.getGlobalDiagnostics());

            if (diagnostics.length === 0) {
                /*
                reportSemanticDiagnostics = true;
                */
            }
        }

        // Emit and report any errors we ran into.
        const { emittedFiles, emitSkipped, diagnostics: emitDiagnostics } = program.emit();
        addRange(diagnostics, emitDiagnostics);

        if (reportSemanticDiagnostics) {
            addRange(diagnostics, program.getSemanticDiagnostics());
        }

        sortAndDeduplicateDiagnostics(diagnostics).forEach(reportDiagnostic);
        if (writeFileName) {
            const currentDir = program.getCurrentDirectory();
            forEach(emittedFiles, file => {
                const filepath = getNormalizedAbsolutePath(file, currentDir);
                writeFileName(`TSFILE: ${filepath}`);
            });

            if (program.getCompilerOptions().listFiles) {
                forEach(program.getSourceFiles(), file => {
                    writeFileName(file.fileName);
                });
            }
        }

        if (emitSkipped && diagnostics.length > 0) {
            // If the emitter didn't emit anything, then pass that value along.
            return ExitStatus.DiagnosticsPresent_OutputsSkipped;
        }
        else if (diagnostics.length > 0) {
            // The emitter emitted something, inform the caller if that happened in the presence
            // of diagnostics or not.
            return ExitStatus.DiagnosticsPresent_OutputsGenerated;
        }
        return ExitStatus.Success;
    }
}