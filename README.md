*Experimental*

# Goals:

`tscf` will be just like `tsc` but allow you to ignore semantic errors.

It will still fail on syntactic errors.

## Why is this useful?

TSC converts invalid JS syntax into valid JS syntax.  This means you might be expecting your browser or JS VM to reject a file at parse-time, 
but actually the transpiled output of TS will parse and run.  But it might be jibberish.

*I assume this behavior is a side-effect of TS's role as a language service.  It must always do its best to make sense of incomplete JS while you're typing in your editor,
so it always converts invalid JS syntax into some sort of valid AST.*

Sometimes a project has semantic errors and doesn't intend to fix them.  For example, while prototyping, I will use TypeScript's language service to help me code faster, but I will
intentially ignore lots of semantic errors.  When converting a large JS codebase to TS, I will have lots of semantic errors during the migration process.
There's little benefit to fixing semantic errors in rarely-touched files.

Some projects use tsc as a linter.  Thus the build script should merely transpile, skipping the typechecker.

In these situations, it makes sense for tsc to check and reject syntactic errors, perform transpilation, but ignore semantic errors.
