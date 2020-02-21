import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from './product';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private httpService: any;

  constructor(private http: HttpClient) { }

  getProducts (): Observable<Product[]> {
    const url = `${apiUrl}/getList`;
    return this.http.get<Product[]>(url)
      .pipe(
        tap(products => console.log('Fetch products')),
        catchError(this.handleError('getProducts', []))
      );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${apiUrl}/update/${id}`;
    return this.http.get<Product>(url).pipe(
      // tap(_ => console.log(`fetched product id=${id}`)),
      // catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  addProduct (product): Observable<Product> {
    const url = `${apiUrl}/employee`;
    return this.http.post<Product>(url, product, httpOptions).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      // tap((product: Product) => console.log(`added product w/ id=${product. id}`)),
      // catchError(this.handleError<Product>('addProduct'))
    );
  }

  updateProduct (id, product): Observable<any> {
    const url = `${apiUrl}/empUpdate/${id}`;
    return this.http.put(url, product, httpOptions).pipe(
      // tap(_ => console.log(`updated product id=${id}`)),
      // catchError(this.handleError<any>('updateProduct'))
    );
  }

  deleteProduct (id): Observable<Product> {
    const url = `${apiUrl}/delete/${id}`;

    return this.http.delete<Product>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted product id=${id}`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

    search(filter: {name: string} = {name: ''}, page = 1): Observable<Product> {
    // alert(JSON.stringify(filter.name));
      const term = filter.name;
      // tslint:disable-next-line:triple-equals
      return this.http.get<Product>(`${apiUrl}/searchName/${term}`)
        .pipe(
          tap((response: Product) => {
            // @ts-ignore
            response.results = response.results;
              // console.log(response.results);
              // .map(user => new Product(user.id, user.firstName))
              // // Not filtering in the server since in-memory-web-api has somewhat restricted api
              // .filter(user => user.firstName.includes(filter.name))
            return response;
          })
        );
    }
}
