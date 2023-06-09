import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMiembroComponent } from './crear-miembro.component';

describe('CrearMiembroComponent', () => {
  let component: CrearMiembroComponent;
  let fixture: ComponentFixture<CrearMiembroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearMiembroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
