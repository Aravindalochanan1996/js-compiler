import { TestBed } from '@angular/core/testing';

import { CompilerMockService } from './compiler-mock.service';

describe('CompilerMockService', () => {
  let service: CompilerMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompilerMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
