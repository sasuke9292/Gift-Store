import { ESLint } from 'eslint'

async function run() {
  const eslint = new ESLint()
  const results = await eslint.lintFiles(['src/**/*.{ts,tsx}'])
  let errCount = 0
  for (const r of results) {
    const errors = r.messages.filter(m => m.severity === 2)
    if (errors.length > 0) {
      console.log(`\nFILE: ${r.filePath}`)
      for (const e of errors) {
        errCount++
        console.log(`  L${e.line}:${e.column} [${e.ruleId}]: ${e.message}`)
      }
    }
  }
  console.log(`\nTotal errors: ${errCount}`)
}

run().catch(console.error)
