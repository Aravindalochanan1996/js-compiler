import { Component } from '@angular/core';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { CompilerMockService } from '../compiler-mock.service'; // Import the mock service
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-compiler',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule, NgFor],
  templateUrl: './compiler.component.html',
  styleUrl: './compiler.component.scss',
  providers: [CompilerMockService] // Add service to providers if not using root injection or a module
})
export class CompilerComponent {
  editorOptions = {theme: 'vs-dark', language: 'typescript'};
  code: string = '// Start typing your TypeScript code here\nfunction greet() {\n  console.log("Hello, world!");\n}\ngreet();';

  supportedLanguages: string[] = ['typescript', 'javascript', 'python', 'java', 'csharp', 'cpp'];
  selectedLanguage: string = 'typescript';

  output: string = 'Compilation output will appear here.';

  constructor(private compilerMockService: CompilerMockService) { // Inject the service
    this.updateEditorOptions(); // Initialize editor options
  }

  onLanguageChange(): void {
    this.updateEditorOptions();
  }

  private updateEditorOptions(): void {
    this.editorOptions = { ...this.editorOptions, language: this.selectedLanguage };
    // Update boilerplate code based on language
    switch (this.selectedLanguage) {
      case 'javascript':
        this.code = 'console.log("Hello from JavaScript!");';
        break;
      case 'python':
        this.code = 'print("Hello from Python!")';
        break;
      case 'java':
        this.code = 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}';
        break;
      case 'csharp':
        this.code = 'using System;\n\npublic class Hello\n{\n  public static void Main(string[] args)\n  {\n    Console.WriteLine("Hello from C#!");\n  }\n}';
        break;
      case 'cpp':
        this.code = '#include <iostream>\n\nint main() {\n  std::cout << "Hello from C++!" << std::endl;\n  return 0;\n}';
        break;
      default:
        this.code = `// Start typing your ${this.selectedLanguage} code here`;
    }
  }

  async compile(): Promise<void> {
    if (!this.code.trim()) {
      this.output = 'No code to compile.';
      return;
    }
    this.output = `Compiling ${this.selectedLanguage} code...`;
    try {
      const result = await this.compilerMockService.compile(this.selectedLanguage, this.code);
      this.output = result;
    } catch (error: any) {
      this.output = `Error during compilation: ${error.message || error}`;
    }
  }
}
