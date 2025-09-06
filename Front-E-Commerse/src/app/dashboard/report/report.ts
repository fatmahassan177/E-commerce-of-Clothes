
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report-service'; 
import { ISalesReport ,ISalesReportRes } from '../../core/Interfaces/report-interface'; 
@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './report.html',
  styleUrl: './report.css'
})
export class Report {
  report: ISalesReport | null = null;
  loading = false;

  startDate: string = '';
  endDate: string = '';

  constructor(private _reportS: ReportService) {}

  fetchReport() {
    this.loading = true;
    this._reportS.getReport(this.startDate, this.endDate).subscribe({
      next: (res: ISalesReportRes) => {
        this.report = res.data[0] || null;
        this.loading = false;
      }
    });
  }
}
