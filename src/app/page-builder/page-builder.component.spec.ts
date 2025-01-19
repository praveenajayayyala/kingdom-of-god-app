import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBuilderComponent } from './page-builder.component';

describe('PageBuilderComponent', () => {
  let component: PageBuilderComponent;
  let fixture: ComponentFixture<PageBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
