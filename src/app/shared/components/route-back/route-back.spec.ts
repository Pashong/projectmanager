import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteBack } from './route-back';

describe('RouteBack', () => {
  let component: RouteBack;
  let fixture: ComponentFixture<RouteBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteBack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
