import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Product } from '../product';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ExcelService} from '../excel.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  // @ts-ignore
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = [ 'uniqueID', 'firstName', 'lastName', 'mobile', 'emailId'];
  data: Product[] = [];

  isLoadingResults = true;
  private dataSource: MatTableDataSource<Product>;
  exporter: any;

  constructor(private api: ApiService, private excelService: ExcelService) { }

  ngOnInit() {
    this.api.getProducts()
      .subscribe(res => {
        this.data = res;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        // console.log(this.data);
        this.isLoadingResults = false;
      }, err => {
        // console.log(err);
        this.isLoadingResults = false;
      });
  }

  applyFilter(filterValue: string) {
    // alert(filterValue);
    // @ts-ignore
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource);
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'sample');
  }

}
