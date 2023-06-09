import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMiembrosComponent } from './lista-miembros.component';

describe('ListaMiembrosComponent', () => {
  let component: ListaMiembrosComponent;
  let fixture: ComponentFixture<ListaMiembrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaMiembrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMiembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
