import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampoSlider } from './campo-slider';

describe('CampoSlider', () => {
  let component: CampoSlider;
  let fixture: ComponentFixture<CampoSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(CampoSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
