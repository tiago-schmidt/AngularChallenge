import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthToolbarComponent } from './month-toolbar.component';

describe('MonthToolbarComponent', () => {
  let component: MonthToolbarComponent;
  let fixture: ComponentFixture<MonthToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
