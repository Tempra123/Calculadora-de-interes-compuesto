import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoTrayectoria } from './grafico-trayectoria';

describe('GraficoTrayectoria', () => {
  let component: GraficoTrayectoria;
  let fixture: ComponentFixture<GraficoTrayectoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTrayectoria],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoTrayectoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
