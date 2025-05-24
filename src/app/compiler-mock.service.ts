import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompilerMockService {

  constructor() { }

  compile(language: string, code: string): Promise<string> {
    let result: string;

    switch (language.toLowerCase()) {
      case 'javascript':
        try {
          // CAUTION: Using eval() can be dangerous if the code is not trusted.
          // This is a mock, so we'll proceed with caution.
          // To make it a bit safer, we'll wrap it in an IIFE and only allow console.log
          
          // Store original console.log and create a buffer for logs
          const originalConsoleLog = console.log;
          let consoleOutput = '';
          console.log = (...args: any[]) => {
            consoleOutput += args.map(String).join(' ') + '\n';
          };

          eval(`(function() { ${code} })();`);
          
          // Restore original console.log
          console.log = originalConsoleLog;
          
          result = consoleOutput || 'JavaScript code executed successfully. No output to console.log.';
          if (consoleOutput.endsWith('\n')) {
            result = consoleOutput.slice(0, -1); // Remove trailing newline
          }
        } catch (error: any) {
          result = `JavaScript Error: ${error.message}`;
        }
        break;
      case 'python':
        result = `Python code received: ${code.substring(0, 50)}${code.length > 50 ? '...' : ''} (mock response)`;
        break;
      case 'java':
      case 'csharp':
      case 'cpp':
      default:
        result = `Mock compilation for ${language}: Code received. (mock response)`;
        break;
    }
    return Promise.resolve(result);
  }
}
