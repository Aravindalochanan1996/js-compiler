import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs'; // Not strictly needed for Promise-based service, but good for async testing

import { CompilerComponent } from './compiler.component';
import { CompilerMockService } from '../compiler-mock.service';

// Create a mock for CompilerMockService
class MockCompilerService {
  compile(language: string, code: string): Promise<string> {
    if (code === 'throw error') {
      return Promise.reject('Mock service error');
    }
    return Promise.resolve(`Mock compiled ${language}: ${code}`);
  }
}

describe('CompilerComponent', () => {
  let component: CompilerComponent;
  let fixture: ComponentFixture<CompilerComponent>;
  let mockCompilerService: CompilerMockService;
  let compileSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CompilerComponent, // CompilerComponent is standalone and imports FormsModule and MonacoEditorModule itself
      ],
      providers: [
        { provide: CompilerMockService, useClass: MockCompilerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompilerComponent);
    component = fixture.componentInstance;
    mockCompilerService = TestBed.inject(CompilerMockService);
    // Spy on the actual method of the provided service instance
    compileSpy = spyOn(mockCompilerService, 'compile').and.callThrough();
    fixture.detectChanges(); // Initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have default selectedLanguage as "typescript"', () => {
      expect(component.selectedLanguage).toBe('typescript');
    });

    it('should have initial output message', () => {
      expect(component.output).toBe('Compilation output will appear here.');
    });

    it('should have default code content for typescript', () => {
      // Default for typescript is set in constructor via updateEditorOptions
      // The component initializes with 'typescript', and updateEditorOptions sets default code.
      // Based on the component's logic:
      // case 'javascript': this.code = 'console.log("Hello from JavaScript!");'; break;
      // ...
      // default: this.code = `// Start typing your ${this.selectedLanguage} code here`;
      // Since 'typescript' is not explicitly cased for code change, it hits the default.
      expect(component.code).toBe('// Start typing your typescript code here');
    });

    it('should have editorOptions for typescript by default', () => { // Corrected syntax: removed extra dot
        expect(component.editorOptions.language).toBe('typescript');
    });
  });

  describe('Language Selection', () => {
    it('should update selectedLanguage property on dropdown change', () => {
      const selectElement = fixture.debugElement.query(By.css('#language-select')).nativeElement;
      selectElement.value = 'python';
      selectElement.dispatchEvent(new Event('change')); // For native select
      selectElement.dispatchEvent(new Event('ngModelChange')); // For ngModel
      fixture.detectChanges();
      expect(component.selectedLanguage).toBe('python');
    });

    it('should call updateEditorOptions when selectedLanguage changes', () => {
      spyOn(component as any, 'updateEditorOptions').and.callThrough(); // Spy on private method
      component.selectedLanguage = 'python';
      component.onLanguageChange(); // Manually trigger as ngModelChange might not be enough in test
      expect((component as any).updateEditorOptions).toHaveBeenCalled();
    });

    it('updateEditorOptions should update editorOptions.language and set default code', () => {
      component.selectedLanguage = 'python';
      (component as any).updateEditorOptions(); // Call private method
      expect(component.editorOptions.language).toBe('python');
      expect(component.code).toBe('print("Hello from Python!")');

      component.selectedLanguage = 'javascript';
      (component as any).updateEditorOptions();
      expect(component.editorOptions.language).toBe('javascript');
      expect(component.code).toBe('console.log("Hello from JavaScript!");');
    });
  });

  describe('Compile Action', () => {
    it('should call compile() method when "Compile" button is clicked', () => {
      spyOn(component, 'compile').and.callThrough();
      const compileButton = fixture.debugElement.query(By.css('.compile-button')).nativeElement;
      compileButton.click();
      expect(component.compile).toHaveBeenCalled();
    });

    it('compile() method should call compilerMockService.compile() with correct language and code', fakeAsync(() => {
      component.selectedLanguage = 'python';
      component.code = 'print("test")';
      component.compile();
      tick(); // Resolve promises
      expect(compileSpy).toHaveBeenCalledWith('python', 'print("test")');
    }));

    it('should update output property with mock success response', fakeAsync(() => {
      component.selectedLanguage = 'javascript';
      component.code = 'console.log("success")';
      component.compile();
      tick(); // Wait for the promise to resolve
      expect(component.output).toBe('Mock compiled javascript: console.log("success")');
    }));

    it('should update output property with mock error message on service error', fakeAsync(() => {
      component.selectedLanguage = 'javascript';
      component.code = 'throw error'; // Mock service will throw error for this code
      component.compile();
      tick(); // Wait for the promise to resolve/reject
      expect(component.output).toBe('Error during compilation: Mock service error');
    }));

    it('should set "No code to compile." if code is empty or whitespace', fakeAsync(() => {
      component.code = '   ';
      component.compile();
      tick();
      expect(component.output).toBe('No code to compile.');
      expect(compileSpy).not.toHaveBeenCalled();
    }));
  });
});
