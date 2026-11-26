import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectorOpciones } from './selector-opciones';

describe('SelectorOpciones', () => {
  let component: SelectorOpciones;
  let fixture: ComponentFixture<SelectorOpciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorOpciones],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorOpciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
