import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItems } from './task-items';

describe('TaskItems', () => {
  let component: TaskItems;
  let fixture: ComponentFixture<TaskItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
