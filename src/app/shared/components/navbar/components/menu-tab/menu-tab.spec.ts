import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTab } from './menu-tab';

describe('MenuTab', () => {
  let component: MenuTab;
  let fixture: ComponentFixture<MenuTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
