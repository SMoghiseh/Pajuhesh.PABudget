 

import {
  Directive,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

export type PermissionOptions = Array<'CONFIRM' | 'CANCEL' | 'DELETE' | 'EDIT'>;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasPermissions]',
})
export class HasPermissionsDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  @Input()
  set hasPermissions(userPermission: PermissionOptions) {
    this.decideView(userPermission);
  }

  decideView(permissions: PermissionOptions) {
    const userPermissions: PermissionOptions = ['CONFIRM', 'CANCEL'];

    if (permissions.every(permission => userPermissions.includes(permission)))
      this.showComponent();
    else this.removeComponent();
  }

  /** Disable Component */
  disableComponent(): void {
    this.viewContainerRef.clear();

    const viewRootElement: HTMLElement =
      this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];

    viewRootElement.setAttribute('style', 'opacity: 0.3');

    this.renderer.setProperty(viewRootElement, 'disabled', true);
  }

  /** Enable Component */
  enableComponent(): void {
    this.viewContainerRef.clear();

    const viewRootElement: HTMLElement =
      this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];

    this.renderer.setProperty(viewRootElement, 'disabled', false);
  }

  /** Remove Component */
  removeComponent(): void {
    this.viewContainerRef.clear();
  }

  /** Show Component */
  showComponent(): void {
    this.viewContainerRef.clear();

    this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];
  }
}
