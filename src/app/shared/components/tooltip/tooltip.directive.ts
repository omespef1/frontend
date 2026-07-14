import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';
  private tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltipText));
    this.renderer.appendChild(document.body, this.tooltipElement);
    this.renderer.addClass(this.tooltipElement, 'kfc-tooltip');

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const top = hostPos.top - 30;
    const left = hostPos.left + (hostPos.width / 2);

    this.renderer.setStyle(this.tooltipElement, 'top', \`\${top}px\`);
    this.renderer.setStyle(this.tooltipElement, 'left', \`\${left}px\`);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
