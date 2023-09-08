import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTreeComponent } from './navigation-tree.component';

describe('NavigationTreeComponent', () => {
  let component: NavigationTreeComponent;
  let fixture: ComponentFixture<NavigationTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationTreeComponent]
    });
    fixture = TestBed.createComponent(NavigationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
