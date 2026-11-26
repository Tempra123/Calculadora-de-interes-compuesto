import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficiosRiesgos } from './beneficios-riesgos';

describe('BeneficiosRiesgos', () => {
  let component: BeneficiosRiesgos;
  let fixture: ComponentFixture<BeneficiosRiesgos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiosRiesgos],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficiosRiesgos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
