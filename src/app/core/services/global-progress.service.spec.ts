import { TestBed } from '@angular/core/testing';

import { GlobalProgressService } from './global-progress.service';

describe('GlobalProgressService', () => {
  let service: GlobalProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
