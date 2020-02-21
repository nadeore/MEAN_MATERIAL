import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  // firstName: string ;
  lastName: string;
  emailId: string;
  isLoadingResults = false;
  private myBooks: any[];
  private isLoading: boolean;
  private filteredUsers: any;
  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) {
      // this.productForm = formBuilder.group({
      //   firstName: ['']
      // });
    }


  ngOnInit() {
    // @ts-ignore
    // this.firstName.valueChanges.subscribe(
    //   term => {
    //     // tslint:disable-next-line:triple-equals
    //     if (term != '') {
    //       this.api.search(term).subscribe(
    //         data => {
    //           this.myBooks = data as any[];
    //           // console.log(data[0].BookName);
    //         });
    //     }
    //   });

// alert('OKK');
// tslint:disable-next-line:no-debugger
//   alert(this.productForm.get('firstName').value);

    this.productForm = this.formBuilder.group({
      'firstName' : [null, Validators.required],
      'lastName' : [null, Validators.required],
      'mobile' : [null, Validators.required],
      // 'mobile' : [null, Validators.required, Validators.pattern('[6-9]\\d{9}')],
      'emailId' : [null, Validators.required]
    });

    // console.log(this.productForm.get('firstName').valueChanges);
    // const dataVal = this.productForm.get('firstName').valueChanges;

      this.productForm.get('firstName').valueChanges.pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.api.search({name: value})
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(users => this.filteredUsers = users);
      // console.log(this.filteredUsers);
  }

  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    this.api.addProduct(form)
      .subscribe(res => {
          const id = res['id'];
          this.isLoadingResults = false;
          // this.router.navigate(['/product-details', id]);
        this.router.navigate(['/users']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
