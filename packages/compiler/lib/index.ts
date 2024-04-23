import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'node:fs'
import { join, relative, resolve } from 'node:path'
import chokidar from 'chokidar'
import ts from 'typescript'
import { ChildProcess, exec, spawn } from 'node:child_process'
import { rimrafSync } from 'rimraf'

export interface Opts {
    isDeclaration?: boolean
    typeCheker: ts.TypeChecker
}

const CODE_TO_INJECT = `import { fileURLToPath as __fileURLToPathInternal, pathToFileURL as __pathToFileURLInternal } from "node:url";
import { dirname as __dirnameInternal } from "node:path";
import { createRequire as __createRequireInternal } from "node:module";
const __filename = import.meta.filename || __fileURLToPathInternal(import.meta.url);
const __dirname = import.meta.dirname || __dirnameInternal(__filename);
if (!import.meta.filename) import.meta.filename = __filename;
if (!import.meta.dirname) import.meta.dirname = __dirname;
const require = __createRequireInternal(import.meta.url);
import.meta.resolve = function (path, base) {
    if (base)
    return __pathToFileURLInternal(__createRequireInternal(base).resolve(path)).href;
    return __pathToFileURLInternal(require.resolve(path)).href;
}\n`

const transformMethods =
    () =>
        (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> =>
        ((sf: ts.SourceFile): ts.Node | undefined => {
            const mainVisitor = (
                ctx: ts.TransformationContext,
                sf: ts.SourceFile,
            ) => {
                const visitor = (node: ts.Node): ts.Node | undefined => {
                    if (ts.isClassDeclaration(node)) {
                        const classRecompiled = ts.createSourceFile(
                            'test.ts',
                            node.getFullText(sf),
                            ctx.getCompilerOptions().target ||
                                ts.ScriptTarget.ESNext,
                        )
                        const methodsDecoratedclassRecompiled: string[] = []
                        classRecompiled.forEachChild((e) => {
                            if (ts.isClassDeclaration(e)) {
                                const methods = e.members
                                    .filter(
                                        (member) =>
                                            ts.isMethodDeclaration(member) &&
                                            member.modifiers?.some(
                                                ts.isDecorator,
                                            ),
                                    )
                                    .map(
                                        (e) =>
                                            e.name
                                                ?.getFullText(classRecompiled)
                                                .trim() || '',
                                    )
                                methodsDecoratedclassRecompiled.push(...methods)
                            }
                        })
                        return ts.visitEachChild(
                            node,
                            visitorMethodTransformer(
                                methodsDecoratedclassRecompiled,
                            ),
                            ctx,
                        )
                    }
                    return ts.visitEachChild(node, visitor, ctx)
                }
                const visitorMethodTransformer =
                    (methodsToOmit: string[]) =>
                    (node: ts.Node): ts.Node | undefined => {
                        if (
                            ts.isMethodDeclaration(node) &&
                            !methodsToOmit.includes(
                                node.name.getText().trim(),
                            ) &&
                            !node.modifiers?.some(
                                (e) => e.getText(sf) === 'static',
                            )
                        ) {
                            let hasSuper = false
                            const superFinderVisitor = (node: ts.Node) => {
                                    if (node.kind === ts.SyntaxKind.SuperKeyword) {
                                        hasSuper = true
                                }
                                    node.forEachChild(superFinderVisitor)
                            }
                                node.forEachChild(superFinderVisitor)
                                if (!hasSuper) {
                                    const newNode =
                                    ctx.factory.createVariableDeclaration(
                                        node.name.getText(),
                                        undefined,
                                        undefined,
                                        ctx.factory.createArrowFunction(
                                            node.modifiers?.some(
                                                (e) =>
                                                    e.kind ===
                                                    ts.SyntaxKind.AsyncKeyword,
                                            )
                                                ? [
                                                      ctx.factory.createToken(
                                                          ts.SyntaxKind
                                                              .AsyncKeyword,
                                                      ),
                                                  ]
                                                : undefined,
                                            undefined,
                                            node.parameters,
                                            undefined,
                                            ctx.factory.createToken(
                                                ts.SyntaxKind
                                                    .EqualsGreaterThanToken,
                                            ),
                                            node.body ||
                                                ctx.factory.createBlock([]),
                                        ),
                                    )
                                return ts.visitEachChild(newNode, visitor, ctx)
                                }
                        }
                            return ts.visitEachChild(node, visitor, ctx)
                    }
                return visitor
            }
            return ts.visitNode(sf, mainVisitor(ctx, sf))
        }) as unknown as any

const transformToReplaceImportJson =
    (_opts: Opts) =>
        (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> =>
        ((sf: ts.SourceFile): ts.Node | undefined => {
            const testVisitor = (
                ctx: ts.TransformationContext,
                _sf: ts.SourceFile,
            ) => {
                const visitor = (node: ts.Node): ts.Node | undefined => {
                    if (
                        ts.isImportDeclaration(node) &&
                        node.importClause &&
                        node.pos
                    ) {
                        try {
                            const pathImport: string = (
                                node.moduleSpecifier as any
                            ).text
                            const defaultClause = node.importClause
                                ?.getText()
                                .trim()
                            if (
                                pathImport.endsWith('.json') &&
                                !defaultClause.endsWith('}')
                            ) {
                                return ctx.factory.createVariableDeclaration(
                                    'const ' + defaultClause,
                                    undefined,
                                    undefined,
                                    ctx.factory.createCallExpression(
                                        ctx.factory.createIdentifier('require'),
                                        undefined,
                                        [
                                            ctx.factory.createStringLiteral(
                                                pathImport,
                                            ),
                                        ],
                                    ),
                                )
                            }
                        } catch (_e) {}
                    }
                    return ts.visitEachChild(node, visitor, ctx)
                }
                return visitor
            }
            return ts.visitNode(sf, testVisitor(ctx, sf))
        }) as unknown as any

function visitor(_opt: Opts, ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const paths = ctx.getCompilerOptions().paths || {}
    const visitor: ts.Visitor = (node: ts.Node): ts.Node | undefined => {
        if (
            (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
            node.moduleSpecifier
        ) {
            let pathImport = node.moduleSpecifier
                .getText(sf)
                .replaceAll("'", '')
                .replaceAll('"', '')
            const isJson = pathImport.endsWith('.json')
            const pathMatched = Object.keys(paths)
                .map((e) => e.replace('*', ''))
                .find((e) => pathImport.startsWith(e))
            if (pathMatched) {
                const baseUrl = ctx.getCompilerOptions().baseUrl || ''
                const current = ((sf as any).resolvedPath || sf.fileName)
                    .replaceAll('\\', '/')
                    .split('/')
                current.splice(-1)
                const currentPath = current.join(
                    process.platform !== 'win32' ? '/' : '\\',
                )
                paths[pathMatched + '*'].find((path) => {
                    pathImport = resolve(
                        baseUrl,
                        pathImport.replace(pathMatched, path.replace('*', '')),
                    )
                    if (
                        !pathImport.endsWith('.js') &&
                        !pathImport.endsWith('.ts') &&
                        !isJson
                    )
                        pathImport += '.ts'
                    if (pathImport.endsWith('.js')) {
                        pathImport = pathImport.slice(0, -3)
                        pathImport += '.ts'
                    }
                    let fileName: string | undefined
                    if (existsSync(pathImport)) {
                        const pathItems = pathImport
                            .replaceAll('\\', '/')
                            .split('/')
                        fileName = pathItems.at(-1)
                        pathItems.splice(-1)
                        pathImport = pathItems.join(
                            process.platform !== 'win32' ? '/' : '\\',
                        )
                    }
                    pathImport = relative(currentPath, pathImport).replaceAll(
                        '\\',
                        '/',
                    )
                    if (!pathImport.startsWith('../'))
                        pathImport = './' + pathImport
                    if (fileName && pathImport !== './')
                        pathImport += '/' + fileName
                    if (fileName && pathImport === './') pathImport += fileName
                })
            }
            if (pathImport.startsWith('./') || pathImport.startsWith('../')) {
                if (pathImport.endsWith('.js') || pathImport.endsWith('.ts'))
                    pathImport = pathImport.slice(0, -3)
                const current = ((sf as any).resolvedPath || sf.fileName)
                    .replaceAll('\\', '/')
                    .split('/')
                current.splice(-1)
                const currentPath = current.join(
                    process.platform !== 'win32' ? '/' : '\\',
                )
                let path = join(currentPath, pathImport)
                if (process.platform === 'win32') {
                    path = path.replaceAll('/', '\\')
                    path = path.charAt(0).toUpperCase() + path.slice(1)
                }
                if (existsSync(path + '.ts')) {
                    pathImport += '.js'
                } else if (!isJson) {
                    pathImport += '/index.js'
                }
            }
            if (ts.isImportDeclaration(node)) {
                const newNode = ctx.factory.updateImportDeclaration(
                    node,
                    node.modifiers,
                    node.importClause,
                    ctx.factory.createStringLiteral(pathImport),
                    node.assertClause,
                )
                return newNode
            }
            if (ts.isExportDeclaration(node))
                return ctx.factory.updateExportDeclaration(
                    node,
                    node.modifiers,
                    node.isTypeOnly,
                    node.exportClause,
                    ctx.factory.createStringLiteral(pathImport),
                    node.assertClause,
                )
            return ts.visitEachChild(node, visitor, ctx)
        }
        return ts.visitEachChild(node, visitor, ctx)
    }

    return visitor
}

function getTypeOfNode(
    node: ts.Node,
    typeCheker: ts.TypeChecker,
): ts.Type | undefined {
    if (ts.isCallExpression(node)) {
        const signature = typeCheker.getResolvedSignature(node)
        if (signature) {
            return signature.getReturnType()
        }
    }
    if (ts.isNewExpression(node)) {
        const type = typeCheker.getTypeAtLocation(node.expression)
        if (type) {
            const prototypeSymbol = type.getProperty('prototype')
            return typeCheker.getTypeOfSymbol(prototypeSymbol!)
        }
    }
    const type = typeCheker.getSymbolAtLocation(node)
    const declaration = type?.valueDeclaration
    if (declaration && ts.isParameter(declaration) && declaration.type) {
        return typeCheker.getTypeAtLocation(declaration.type)
    }
    if (type && typeCheker.getTypeOfSymbol(type).getProperties().length) {
        return typeCheker.getTypeOfSymbol(type)
    }
    if (declaration && ts.isVariableDeclaration(declaration)) {
        return getTypeOfNode(declaration.initializer!, typeCheker)
    }
    return undefined
}

function getPropsOfNode(
    node: ts.Node,
    typeCheker: ts.TypeChecker,
    propToFind: string,
): ts.Type | undefined {
    const type = getTypeOfNode(node, typeCheker)
    const symbol = type?.getProperty(propToFind)
    return symbol ? typeCheker.getTypeOfSymbol(symbol) : undefined
}

function validReturnTypeOfMethod(
    type: ts.Type | undefined,
    typeChecker: ts.TypeChecker,
) {
    if (!type?.symbol.valueDeclaration) return false
    const func2Type = typeChecker.getTypeOfSymbolAtLocation(
        type.symbol,
        type.symbol.valueDeclaration,
    )
    const func2Signature = typeChecker.getSignaturesOfType(
        func2Type,
        ts.SignatureKind.Call,
    )[0]
    return (
        typeChecker.typeToString(func2Signature.getReturnType()) ===
            'boolean' && func2Signature.getParameters().length === 1
    )
}

const operatorsDictionary: Record<string, string> = {
    '<': 'lessThan',
    '>': 'lessThan',
    '<=': 'lessThanEqual',
    '>=': 'lessThanEqual',
}

const transformOperatorsAndExtensions =
    ({ typeCheker }: Opts) =>
        (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
            return ((sf: ts.SourceFile) => {
                const importsToAdd: string[] = []
                const testVisitor = (
                    ctx: ts.TransformationContext,
                    sf: ts.SourceFile,
                ) => {
                    const visitor = (node: ts.Node): ts.Node | undefined => {
                        if (
                            ts.isBinaryExpression(node) &&
                        (node.operatorToken.getFullText().trim() === '==' ||
                            node.operatorToken.getFullText().trim() === '!=') &&
                        validReturnTypeOfMethod(
                            getPropsOfNode(node.left, typeCheker, 'equals'),
                            typeCheker,
                        ) &&
                        validReturnTypeOfMethod(
                            getPropsOfNode(node.right, typeCheker, 'equals'),
                            typeCheker,
                        )
                        ) {
                            const isNotOp =
                            node.operatorToken.getFullText().trim() === '!='
                            const newNode = ctx.factory.createCallExpression(
                                ctx.factory.createPropertyAccessChain(
                                    node.left,
                                    ctx.factory.createToken(
                                        ts.SyntaxKind.QuestionDotToken,
                                    ),
                                    'equals',
                                ),
                                [],
                                [node.right],
                            )
                            return ts.visitEachChild(
                                isNotOp
                                    ? ctx.factory.createLogicalNot(newNode)
                                    : newNode,
                                visitor,
                                ctx,
                            )
                        }
                        if (
                            ts.isBinaryExpression(node) &&
                        Object.keys(operatorsDictionary).includes(
                            node.operatorToken.getFullText().trim(),
                        ) &&
                        validReturnTypeOfMethod(
                            getPropsOfNode(
                                node.left,
                                typeCheker,
                                operatorsDictionary[
                                    node.operatorToken.getFullText().trim()
                                ],
                            ),
                            typeCheker,
                        ) &&
                        validReturnTypeOfMethod(
                            getPropsOfNode(
                                node.right,
                                typeCheker,
                                operatorsDictionary[
                                    node.operatorToken.getFullText().trim()
                                ],
                            ),
                            typeCheker,
                        )
                        ) {
                            const operator = node.operatorToken.getFullText().trim()
                            const isGreater = operator.startsWith('>')
                            const newNode = ctx.factory.createCallExpression(
                                ctx.factory.createPropertyAccessChain(
                                    isGreater ? node.right : node.left,
                                    ctx.factory.createToken(
                                        ts.SyntaxKind.QuestionDotToken,
                                    ),
                                    operatorsDictionary[
                                        node.operatorToken.getFullText().trim()
                                    ],
                                ),
                                [],
                                [isGreater ? node.left : node.right],
                            )
                            return ts.visitEachChild(newNode, visitor, ctx)
                        }
                        if (
                            ts.isExportDeclaration(node) &&
                        sf.fileName.endsWith('/index.ts')
                        ) {
                            let moduleSpecifier =
                            node.moduleSpecifier
                                ?.getText()
                                .replaceAll("'", '')
                                .replaceAll('"', '') || ''
                            if (moduleSpecifier.endsWith('.ts'))
                                moduleSpecifier = moduleSpecifier.slice(0, -3)
                            const fileTag =
                            moduleSpecifier.replace('./', '') + '.extension.ts'
                            const current = (sf as any).resolvedPath
                                .replaceAll('\\', '/')
                                .split('/')
                            current.splice(-1)
                            const currentPath = current.join(
                                process.platform !== 'win32' ? '/' : '\\',
                            )
                            const files = readdirSync(currentPath)
                                .filter((e) => e.endsWith(fileTag))
                                .map((e) => './' + e.slice(0, -3))
                            if (!files.length) {
                                return ts.visitEachChild(node, visitor, ctx)
                            }
                            const printer = ts.createPrinter({
                                newLine: ts.NewLineKind.LineFeed,
                            })
                            const imports = files
                                .map((e) =>
                                    ctx.factory.createImportDeclaration(
                                        undefined,
                                        undefined,
                                    ts.factory.createStringLiteral(e) as any,
                                    ),
                                )
                                .map((e) => {
                                    return printer.printNode(
                                        ts.EmitHint.Unspecified,
                                        e,
                                        sf,
                                    )
                                })
                                .map((e) => (e += '\n'))
                            importsToAdd.push(...imports)
                        }
                        return ts.visitEachChild(node, visitor, ctx)
                    }
                    return visitor
                }
                const node = ts.visitNode(sf, testVisitor(ctx, sf))
                if (importsToAdd.length) {
                    const normalVisitor = (node: ts.Node) =>
                        ts.visitEachChild(node, normalVisitor, ctx)
                    const newSource = ts.createSourceFile(
                        sf.fileName,
                        importsToAdd.join('') + sf.getFullText(),
                        {
                            ...ctx.getCompilerOptions(),
                            languageVersion:
                            ctx.getCompilerOptions().target ||
                            ts.ScriptTarget.ESNext,
                        },
                        true,
                    )
                    return ts.visitNode(newSource, (node) =>
                        ts.visitEachChild(node, normalVisitor, ctx),
                    )
                }
                return node
            }) as unknown as any
        }

export function transform(opts: Opts): ts.TransformerFactory<ts.SourceFile> {
    return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
        return ((sf: ts.SourceFile) =>
            ts.visitNode(sf, visitor(opts, ctx, sf))) as unknown as any
    }
}

const CJS_CONFIG: ts.CompilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    strict: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    resolveJsonModule: true,
    esModuleInterop: true,
    allowArbitraryExtensions: true,
    outDir: join(process.cwd(), './dist'),
    allowSyntheticDefaultImports: true,
    declaration: true,
}

function createCompilerHost(options: ts.CompilerOptions): ts.CompilerHost {
    const host = ts.createCompilerHost(options)
    host.resolveModuleNames = resolveModuleNames
    return host

    function fileExists(fileName: string): boolean {
        return ts.sys.fileExists(fileName)
    }

    function readFile(fileName: string): string | undefined {
        return ts.sys.readFile(fileName)
    }

    function resolveModuleNames(
        moduleNames: string[],
        containingFile: string,
    ): (ts.ResolvedModule | undefined)[] {
        const resolvedModules: (ts.ResolvedModule | undefined)[] = []
        for (const moduleName of moduleNames) {
            resolvedModules.push(
                ts.resolveModuleName(
                    moduleName.endsWith('.ts')
                        ? moduleName.slice(0, -3) + '.js'
                        : moduleName,
                    containingFile,
                    options,
                    {
                        fileExists,
                        readFile,
                    },
                ).resolvedModule ||
                    ts.resolveModuleName(
                        moduleName + '.js',
                        containingFile,
                        options,
                        {
                            fileExists,
                            readFile,
                        },
                    ).resolvedModule ||
                    undefined,
            )
        }
        return resolvedModules
    }
}

function compile(): void {
    const customTsConfig = process.argv.findIndex((e) => e === '--project') + 1
    const tsConfigPath = join(
        process.cwd(),
        process.argv[customTsConfig || -1] || './tsconfig.json',
    )
    const host1: ts.ParseConfigFileHost = ts.sys as any
    const parsedCmd = ts.getParsedCommandLineOfConfigFile(
        tsConfigPath,
        undefined,
        host1,
    )
    const tsConfigParsed = JSON.parse(readFileSync(tsConfigPath, 'utf8'))
    const compiler = () => {
        const parsedCmd = ts.getParsedCommandLineOfConfigFile(
            tsConfigPath,
            undefined,
            host1,
        )
        const isBrowser = parsedCmd?.options.lib?.some((e) =>
            e.toLowerCase().includes('dom'),
        )
        if (parsedCmd?.fileNames && parsedCmd.options.rootDir)
            parsedCmd.fileNames = parsedCmd.fileNames.filter((e) =>
                e.includes(parsedCmd.options.rootDir || ''),
            )
        if (parsedCmd?.options.outDir && tsConfigParsed.tscc?.deleteOutDir) {
            rimrafSync(parsedCmd.options.outDir)
        }
        const host = createCompilerHost(
            {
                ...parsedCmd?.options,
                allowImportingTsExtensions: false,
            } || CJS_CONFIG,
        )
        const program = ts.createProgram(
            parsedCmd?.fileNames || [],
            {
                ...parsedCmd?.options,
                allowImportingTsExtensions: false,
            } || CJS_CONFIG,
            host,
        )
        const visitorsBefore = [
            transformOperatorsAndExtensions({
                typeCheker: program.getTypeChecker(),
            }),
        ]
        const [major] = process.versions.node.split('.').map(Number)
        const transformsAfter = [
            transform({
                typeCheker: program.getTypeChecker(),
            }),
        ]
        if (major < 20 && !isBrowser)
            transformsAfter.push(
                transformToReplaceImportJson({
                    typeCheker: program.getTypeChecker(),
                }),
            )
        const codeInject:
            | {
                  linesPostCompile?: {
                      files: string[]
                      lines: string[]
                  }[]
              }
            | undefined = tsConfigParsed.tscc
        if (tsConfigParsed?.tscc?.transformsMethodsToArrow)
            transformsAfter.push(transformMethods())
        const emitResult = program.emit(
            undefined,
            (fileName, text) => {
                codeInject?.linesPostCompile?.forEach((e) => {
                    if (
                        e.files.some((e) =>
                            new RegExp(e).test(fileName.replaceAll('\\', '/')),
                        )
                    ) {
                        text = e.lines.join('\n') + '\n' + text
                    }
                })
                if (fileName.endsWith('.js') && !isBrowser) {
                    text = CODE_TO_INJECT + text
                }
                const elements = fileName.replaceAll('\\', '/').split('/')
                elements.splice(-1)
                mkdirSync(elements.join('/'), {
                    recursive: true,
                })
                writeFileSync(fileName, text)
            },
            undefined,
            undefined,
            {
                after: transformsAfter,
                before: visitorsBefore,
            },
        )

        const allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics)

        allDiagnostics.forEach((diagnostic) => {
            if (diagnostic.file) {
                const { line, character } = ts.getLineAndCharacterOfPosition(
                    diagnostic.file,
                    diagnostic.start!,
                )
                const message = ts.flattenDiagnosticMessageText(
                    diagnostic.messageText,
                    '\n',
                )
                console.log(
                    `${diagnostic.file.fileName} (${line + 1},${
                        character + 1
                    }): ${message}`,
                )
            } else {
                console.log(
                    ts.flattenDiagnosticMessageText(
                        diagnostic.messageText,
                        '\n',
                    ),
                )
            }
        })
        return emitResult.emitSkipped || allDiagnostics.length
    }
    if (process.argv.some((e) => e === '-w' || e === '--watch')) {
        let currentPostJob: ChildProcess | null = null
        console.log('Compiling in watch mode...')
        const job = () => {
            if (compiler()) return
            console.log('Successfull!!!')
            if (!tsConfigParsed.tscc?.postWatch) return
            const child = exec(tsConfigParsed.tscc.postWatch)
            currentPostJob = child
            child.stdout?.on('data', (data) =>
                console.log(
                    data
                        .trim()
                        .split('\n')
                        .map((e: string) => `[POST] ${e}`)
                        .join('\n'),
                ),
            )
            // child.stdout?.on('error', (data) => console.error('[POST] ', data))
            child.stderr?.on('data', function (data) {
                console.error('[POST] stderr: ' + data.toString())
                currentPostJob?.kill()
                currentPostJob = null
            })
        }
        const ignoredPaths = [
            ...((tsConfigParsed.tscc.excludesWatch as string[]) || []),
            ...((tsConfigParsed.exclude as string[]) || []),
        ].map((e) => join(parsedCmd?.options.rootDir || process.cwd(), e))
        if (parsedCmd?.options.outDir)
            ignoredPaths.push(parsedCmd.options.outDir)
        ignoredPaths.push(join(process.cwd(), './node_modules'))
        const callback = () => {
            console.log('Recompiling...')
            currentPostJob?.removeAllListeners()
            currentPostJob?.stderr?.destroy()
            if (currentPostJob?.pid && process.platform === 'win32') {
                spawn('taskkill', [
                    '/pid',
                    String(currentPostJob.pid),
                    '/f',
                    '/t',
                ])
            } else {
                currentPostJob?.stdout?.destroy()
                currentPostJob?.stdin?.destroy()
                currentPostJob?.stderr?.destroy()
                currentPostJob?.kill('SIGKILL')
            }
            currentPostJob = null
            job()
        }
        job()
        const watcher = chokidar.watch(
            [
                ...(tsConfigParsed.include?.map((e: string) =>
                    join(parsedCmd?.options.rootDir || process.cwd(), e),
                ) || [parsedCmd?.options.rootDir] || [process.cwd()]),
                tsConfigPath,
                join(process.cwd(), './package.json'),
            ],
            {
                ignoreInitial: true,
            },
        )
        watcher.unwatch(ignoredPaths)
        watcher.on('all', callback)
        return
    }
    const emitResult = compiler()
    const exitCode = emitResult ? 1 : 0
    console.log(`Process exiting with code '${exitCode}'.`)
    process.exit(exitCode)
}

compile()
