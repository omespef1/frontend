import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmar';
  @Input() message: string = '¿Estás seguro?';
  @Input() confirmText: string = 'Aceptar';
  @Input() cancelText: string = 'Cancelar';
  @Input() confirmVariant: 'primary' | 'danger' = 'primary';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
