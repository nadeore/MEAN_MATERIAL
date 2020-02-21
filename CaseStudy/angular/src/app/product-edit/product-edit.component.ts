import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  productForm: FormGroup;
   id: number;
  firstName: string;
  lastName: string;
  emailId: string;
  isLoadingResults = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getProduct(this.route.snapshot.params['id']);
    this.productForm = this.formBuilder.group({
      'firstName' : ['', Validators.required],
      'lastName' : ['', Validators.required],
      'mobile' : ['', Validators.required],
      'emailId' : ['', Validators.required]
    });
  }

  getProduct(id) {
    // alert(id);
    this.api.getProduct(id).subscribe(data => {
      this.id = data[0].id;
      // console.log(this.id);
      // console.log(data);
      this.productForm.setValue({
        firstName: data[0].firstName,
        lastName: data[0].lastName,
        mobile: data[0].mobile,
        emailId: data[0].emailId
      });
    });
  }

  onFormSubmit(form: NgForm) {
    // console.log(form);
    this.isLoadingResults = true;
    this.api.updateProduct(this.id, form)
      .subscribe(res => {
          const id = res['id'];
          this.isLoadingResults = false;
          this.router.navigate(['/users']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  productDetails() {
    this.router.navigate(['/user-details', this.id]);
  }

}
