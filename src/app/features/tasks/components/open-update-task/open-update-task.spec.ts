import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenUpdateTask } from './open-update-task';

describe('OpenUpdateTask', () => {
  let component: OpenUpdateTask;
  let fixture: ComponentFixture<OpenUpdateTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenUpdateTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenUpdateTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
