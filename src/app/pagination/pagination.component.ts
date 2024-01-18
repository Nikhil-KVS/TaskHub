import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChange = new EventEmitter<number>();

  previousPage(): void {
    console.log('Current Page:', this.currentPage);
    console.log('Total Pages:', this.totalPages);
  
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    } else {
      console.log('Error: Current page is not greater than 1');
    }
  }
  
  nextPage(): void {
    console.log('Current Page:', this.currentPage);
    console.log('Total Pages:', this.totalPages);
  
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    } else {
      console.log('Error: Current page is not less than total pages');
    }
  }
  
}
