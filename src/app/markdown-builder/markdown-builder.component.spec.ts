import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownBuilderComponent } from './markdown-builder.component';

describe('MarkdownBuilderComponent', () => {
  let component: MarkdownBuilderComponent;
  let fixture: ComponentFixture<MarkdownBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkdownBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
