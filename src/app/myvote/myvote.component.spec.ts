import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyvoteComponent } from './myvote.component';

describe('MyvoteComponent', () => {
  let component: MyvoteComponent;
  let fixture: ComponentFixture<MyvoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyvoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyvoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
